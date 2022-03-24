/*!
 * Copyright (c) 2012-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from 'bedrock';
import {fileURLToPath} from 'url';
import path from 'path';

const c = bedrock.util.config.main;
const cc = c.computer();
const config = bedrock.config;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config.server = {};
config.server.port = 18443;
config.server.httpPort = 18080;
config.server.domain = 'localhost';
cc('server.bindAddr', () => {
  return [config.server.domain];
});
cc('server.host', () => {
  // assume https and omit default port if possible
  if(config.server.port === 443) {
    return config.server.domain;
  }
  return config.server.domain + ':' + config.server.port;
});
cc('server.baseUri', 'https://${server.host}');
config.server.key = path.join(__dirname, '../pki/bedrock.localhost.key');
config.server.cert = path.join(__dirname, '../pki/bedrock.localhost.crt');
// config.server.ca = [];
config.server.https = {};
// options to pass directly to `tls.createServer`; any individual options that
// can be set on `config.server.*`, if present, will overwrite the options
// specified here
config.server.https.options = {
  // secureOptions: require('constants').SSL_OP_NO_SSLv3
  // ciphers: '...'
};
