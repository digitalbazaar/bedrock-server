/*
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
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
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

// log server URL
bedrock.events.on('bedrock.started', () => {
  const logger = bedrock.loggers.get('app');
  logger.info('server url: https://' +
    bedrock.config.server.bindAddr + ':' + bedrock.config.server.port);
});

// stop servers when bedrock stops
bedrock.events.on('bedrock.stop', callback => {
  if(api.servers.http) {
    api.servers.http.close();
  }
  if(api.servers.https) {
    api.servers.https.close();
  }
  callback();
});

bedrock.events.on('bedrock.admin.init', callback => {
  configure();
  listen(callback);
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

/**
 * Start listening on the configured ports.
 *
 * @param callback(err) called once the operation completes.
 */
function listen(callback) {
  async.auto({
    listenHttps: callback => {
      const logger = bedrock.loggers.get('app');
      const port = bedrock.config.server.port;
      async.each(bedrock.config.server.bindAddr, (addr, next) => {
        logger.debug('starting HTTPS server on %s:%d', addr, port);
        bedrock.events.emit(
          'bedrock-server.https.listen', {address: addr, port});
        api.servers.https.listen(port, addr, () => {
          bedrock.events.emit(
            'bedrock-server.https.listening',
            {address: addr, port});
          next();
        });
      }, callback);
    },
    listenHttp: callback => {
      const logger = bedrock.loggers.get('app');
      const port = bedrock.config.server.httpPort;
      async.each(bedrock.config.server.bindAddr, (addr, next) => {
        logger.debug('starting HTTP server on %s:%d', addr, port);
        api.servers.http.listen(port, addr, () => next());
      }, callback);
    },
    ready: ['listenHttps', 'listenHttp', (results, callback) => {
      const logger = bedrock.loggers.get('app');
      logger.info('started server on port ' + bedrock.config.server.port);
      bedrock.events.emit('bedrock-server.ready', callback);
    }]
  }, err => callback(err));
}
