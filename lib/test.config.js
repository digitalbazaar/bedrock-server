/*
 * Bedrock Server Module test configuration.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;

config.server.port = 18444;
config.server.httpPort = 18081;
config.server.host = 'bedrock.dev:18444';
config.server.baseUri = 'https://' + config.server.host;
