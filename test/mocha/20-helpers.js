/*!
 * Copyright (c) 2014-2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const server = require('bedrock-server');
const path = require('path');
const mockCertBundle = path.join(__dirname, './mock.bundle.crt');

describe('bedrock-server helpers', function() {
  describe('_parseCerts', function() {
    it('properly parses a cert bundle', async () => {
      const caFiles = mockCertBundle;
      const parsedCerts = server._helpers._parseCerts({caFiles});
      parsedCerts.should.be.an('array');
      parsedCerts.length.should.equal(2);
    });
  });
});
