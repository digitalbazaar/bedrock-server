/*!
 * Bedrock server module.
 *
 * This module binds to configured HTTP and HTTPS addresses and ports. It
 * installs an to-HTTPS redirect request listener on the HTTP server and
 * a service unavailable request listener on the HTTPS server. If a new
 * HTTP request listener is attached, the redirect listener is removed. If
 * a new HTTPS request listener is attached, the service unavailable listener
 * is removed.
 *
 * Once the ports are bound, the process is switched to any configured
 * system user.
 *
 * Copyright (c) 2012-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const express = require('express');
const forge = require('node-forge');
const fs = require('fs');
const http = require('http');
const https = require('https');
const morgan = require('morgan');

// load config defaults
require('./config');

// module api
const api = {servers: {}};
module.exports = api;

bedrock.events.on('bedrock.ready', async () => {
  // start http/https listener
  await listen();

  // log server URL
  const logger = bedrock.loggers.get('app');
  logger.info('server url: https://' +
    bedrock.config.server.bindAddr + ':' + bedrock.config.server.port);
});

// stop servers when bedrock stops
bedrock.events.on('bedrock.stop', async () => {
  if(api.servers.http) {
    api.servers.http.close();
  }
  if(api.servers.https) {
    api.servers.https.close();
  }
});

bedrock.events.on('bedrock.admin.init', async () => {
  // configure servers in all cases
  configure();
});

/**
 * Configure the server.
 */
function configure() {
  // TLS server
  const httpsCfg = bedrock.config.server.https || {};
  const httpsOptions = bedrock.util.extend({}, httpsCfg.options || {});
  if('key' in bedrock.config.server) {
    httpsOptions.key = fs.readFileSync(bedrock.config.server.key);
  }
  if('cert' in bedrock.config.server) {
    httpsOptions.cert = fs.readFileSync(bedrock.config.server.cert);
  }
  let caFiles = bedrock.config.server.ca;
  if(typeof caFiles === 'string' ||
    (Array.isArray(caFiles) && caFiles.length > 0)) {
    if(!Array.isArray(caFiles)) {
      caFiles = [caFiles];
    }
    // all certs must be parsed individually
    httpsOptions.ca = [];
    caFiles.forEach(file => {
      let bundle = fs.readFileSync(file);
      try {
        const certs = forge.pem.decode(bundle);
        bundle = certs.map(cert => forge.pem.encode(cert));
      } catch(e) {
        throw new Error(e.message);
      }
      httpsOptions.ca.push.apply(httpsOptions.ca, bundle);
    });
  }
  api.servers.https = https.createServer(httpsOptions);
  api.servers.https.setMaxListeners(0);
  api.servers.https.on('error', err => {throw err;});

  const accessLogger = bedrock.loggers.get('access');
  // send service unavailable until another listener is added
  const unavailable = express();
  unavailable.enable('trust proxy');
  unavailable.disable('x-powered-by');
  unavailable.use(morgan('combined', {
    stream: {write: str => accessLogger.log('info', str)}
  }));
  unavailable.use((req, res) => res.sendStatus(503));
  api.servers.https.on('request', unavailable);
  api.servers.https.on('newListener', function removeGatekeeper(event) {
    if(event === 'request') {
      api.servers.https.removeListener('request', unavailable);
      api.servers.https.removeListener('newListener', removeGatekeeper);
    }
  });

  // HTTP server
  api.servers.http = http.createServer();
  api.servers.http.setMaxListeners(0);
  api.servers.http.on('error', err => {throw err;});

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
  api.servers.http.on('request', redirect);
  api.servers.http.on('newListener', function removeRedirect(event) {
    if(event === 'request') {
      api.servers.http.removeListener('request', redirect);
      api.servers.http.removeListener('newListener', removeRedirect);
    }
  });
}

async function listenHttps() {
  const logger = bedrock.loggers.get('app');
  const port = bedrock.config.server.port;
  return Promise.all(bedrock.config.server.bindAddr.map(async addr => {
    logger.debug('starting HTTPS server on %s:%d', addr, port);
    await bedrock.events.emit(
      'bedrock-server.https.listen', {address: addr, port});
    await new Promise(resolve => {
      api.servers.https.listen(port, addr, () => resolve());
    });
    await bedrock.events.emit(
      'bedrock-server.https.listening', {address: addr, port});
  }));
}

async function listenHttp() {
  const logger = bedrock.loggers.get('app');
  const port = bedrock.config.server.httpPort;
  return Promise.all(bedrock.config.server.bindAddr.map(async addr => {
    logger.debug('starting HTTP server on %s:%d', addr, port);
    await bedrock.events.emit(
      'bedrock-server.http.listen', {address: addr, port});
    await new Promise(resolve => {
      api.servers.http.listen(port, addr, () => resolve());
    });
    await bedrock.events.emit(
      'bedrock-server.http.listening', {address: addr, port});
  }));
}

/**
 * Start listening on the configured ports.
 */
async function listen() {
  await Promise.all([listenHttps(), listenHttp()]);
  const logger = bedrock.loggers.get('app');
  logger.info('started server on port ' + bedrock.config.server.port);
  await bedrock.events.emit('bedrock-server.ready');
}
