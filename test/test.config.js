/*
 * Bedrock Server Module test configuration.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));

// config.server.port = 18444;
// config.server.httpPort = 18081;
// config.server.host = 'bedrock.dev:18444';
// config.server.baseUri = 'https://' + config.server.host;
