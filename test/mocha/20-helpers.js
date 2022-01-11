/*!
 * Copyright (c) 2014-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const server = require('bedrock-server');
const path = require('path');
const mockCertBundle = path.join(__dirname, './mock.bundle.crt');

describe('bedrock-server helpers', function() {
  describe('_parseCerts', function() {
    it('properly parses a cert bundle', async () => {
      const httpsOptions = {};
      const caFiles = mockCertBundle;
      server._helpers._parseCerts({caFiles, httpsOptions});
    });
  });
});
