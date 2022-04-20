/*!
 * Copyright (c) 2014-2022 Digital Bazaar, Inc. All rights reserved.
 */
import {_readCertificateBundles} from '@bedrock/server';
import {fileURLToPath} from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockCertBundle = path.join(__dirname, './mock.bundle.crt');

describe('bedrock-server helpers', function() {
  describe('_readCertificateBundles', function() {
    it('properly reads certificate bundles', async () => {
      const caFiles = mockCertBundle;
      const bundles = await _readCertificateBundles({caFiles});
      bundles.should.be.an('array');
      bundles.length.should.equal(1);
    });
  });
});
