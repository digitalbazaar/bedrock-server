/*!
 * Copyright (c) 2012-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as bedrock from '@bedrock/core';
import {createSecureServer} from 'node:http2';
import express from 'express';
import http from 'node:http';
import morgan from 'morgan';
import {promises as fs} from 'node:fs';

const logger = bedrock.loggers.get('app').child('bedrock-server');

// load config defaults
import './config.js';

export const servers = {};

bedrock.events.on('bedrock.ready', async () => {
  // wait until the readiness checks have succeeded
  await bedrock.events.emit('bedrock-server.readinessCheck');
  // start http/https listener
  await listen();
  await bedrock.events.emit('bedrock-server.ready');
  logger.info('ready');
});

// stop servers when bedrock stops
bedrock.events.on('bedrock.stop', async () => {
  if(servers.http) {
    servers.http.close();
  }
  if(servers.https) {
    servers.https.close();
  }
});

bedrock.events.on('bedrock.admin.init', async () => {
  // configure servers in all cases
  await configure();
});

/**
 * Configure the server.
 */
async function configure() {
  // TLS server
  const httpsCfg = bedrock.config.server.https || {};
  const httpsOptions = {...httpsCfg.options};
  if('key' in bedrock.config.server) {
    httpsOptions.key = await fs.readFile(bedrock.config.server.key);
  }
  if('cert' in bedrock.config.server) {
    httpsOptions.cert = await fs.readFile(bedrock.config.server.cert);
  }
  const caBundles = await _readCertificateBundles(
    {caFiles: bedrock.config.server.ca});
  if(caBundles) {
    httpsOptions.ca = caBundles;
  }

  servers.https = createSecureServer({...httpsOptions, allowHTTP1: true});
  // TODO: consider setting http2SessionTimeout
  // https://github.com/digitalbazaar/bedrock-server/issues/23
  /*servers.https.on('session', function sessionTimeout(session) {
    // TODO: use config option or reuse keep-alive timeout option?
    const http2SessionTimeout = 5000;
    session.setTimeout(http2SessionTimeout, function close() {
      this.close();
    });
  });*/
  servers.https.setMaxListeners(0);
  servers.https.on('error', err => {
    throw err;
  });

  const accessLogger = bedrock.loggers.get('access');
  // send service unavailable until another listener is added; include some
  // express + native http2 compatibility code (manually construct router
  // to avoid prototype overrides and use native APIs to send 503 instead of
  // `res.sendStatus`)
  const unavailable = express();
  unavailable.lazyrouter();
  unavailable._router.stack.pop();
  unavailable.use(function _customExpressInit(req, res, next) {
    req.res = res;
    res.req = req;
    req.next = next;
    res.locals = res.locals || Object.create(null);
    next();
  });
  unavailable.enable('trust proxy');
  unavailable.disable('x-powered-by');
  unavailable.use(morgan('combined', {
    stream: {write: str => accessLogger.log('info', str)}
  }));
  unavailable.use((req, res) => {
    // write head directly to avoid express APIs
    res.writeHead(503, {'Content-Type': 'text/plain'});
    res.write('Service Unavailable');
    res.end();
  });
  servers.https.on('request', unavailable);
  servers.https.on('newListener', function removeGatekeeper(event) {
    if(event === 'request') {
      servers.https.removeListener('request', unavailable);
      servers.https.removeListener('newListener', removeGatekeeper);
    }
  });

  // HTTP server
  servers.http = http.createServer();
  servers.http.setMaxListeners(0);
  servers.http.on('error', err => {
    throw err;
  });

  // redirect plain http traffic to https until another listener is attached
  const redirect = express();
  redirect.enable('trust proxy');
  redirect.use(morgan('(http) ' + morgan.combined, {
    stream: {write: str => accessLogger.log('info', str)}
  }));
  redirect.get('*', (req, res) => {
    // set HSTS flag to last one year and update after each visit
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.redirect('https://' + bedrock.config.server.host + req.url);
  });
  servers.http.on('request', redirect);
  servers.http.on('newListener', function removeRedirect(event) {
    if(event === 'request') {
      servers.http.removeListener('request', redirect);
      servers.http.removeListener('newListener', removeRedirect);
    }
  });
}

async function listenHttp() {
  const port = bedrock.config.server.httpPort;
  return Promise.all(bedrock.config.server.bindAddr.map(async addr => {
    logger.debug(`HTTP starting on ${addr}:${port}`);
    await bedrock.events.emit(
      'bedrock-server.http.listen', {address: addr, port});
    await new Promise(resolve => servers.http.listen(port, addr, resolve));
    await bedrock.events.emit(
      'bedrock-server.http.listening', {address: addr, port});
    logger.debug(`HTTP listening on ${addr}:${port}`);
    logger.info(
      `HTTP URL: http://${addr}${port === 80 ? '' : ':' + port}/`);
  }));
}

async function listenHttps() {
  const port = bedrock.config.server.port;
  return Promise.all(bedrock.config.server.bindAddr.map(async addr => {
    logger.debug(`HTTPS starting on ${addr}:${port}`);
    await bedrock.events.emit(
      'bedrock-server.https.listen', {address: addr, port});
    await new Promise(resolve => servers.https.listen(port, addr, resolve));
    await bedrock.events.emit(
      'bedrock-server.https.listening', {address: addr, port});
    logger.debug(`HTTPS listening on ${addr}:${port}`);
    logger.info(
      `HTTPS URL: https://${addr}${port === 443 ? '' : ':' + port}/`);
  }));
}

/**
 * Start listening on the configured ports.
 */
async function listen() {
  await Promise.all([listenHttp(), listenHttps()]);
}

// exported for testing purposes
export async function _readCertificateBundles({caFiles}) {
  if(typeof caFiles === 'string') {
    caFiles = [caFiles];
  } else if(!(Array.isArray(caFiles) && caFiles.length > 0)) {
    // no files to read
    return;
  }

  // populate the bundles array from the file contents, noting that
  // node >= 8 accepts multiple concatenated certs per file (a "bundle");
  // also ensure that they are read in the order provided, so do not read
  // them in parallel
  const bundles = [];
  for(const file of caFiles) {
    bundles.push(await fs.readFile(file));
  }
  return bundles;
}
