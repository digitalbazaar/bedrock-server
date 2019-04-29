/*!
 * Bedrock Server Module test configuration.
 *
 * Copyright (c) 2012-2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));
