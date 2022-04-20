/*!
 * Copyright (c) 2014-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {_parseCerts} from '@bedrock/server';
import {fileURLToPath} from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockCertBundle = path.join(__dirname, './mock.bundle.crt');

describe('bedrock-server helpers', function() {
  describe('_parseCerts', function() {
    it('properly parses a cert bundle', async () => {
      const caFiles = mockCertBundle;
      const parsedCerts = _parseCerts({caFiles});
      parsedCerts.should.be.an('array');
      parsedCerts.length.should.equal(2);
    });
  });
});
