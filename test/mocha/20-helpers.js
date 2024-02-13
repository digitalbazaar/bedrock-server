/*!
 * Copyright (c) 2014-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {_readCertificateBundles} from '@bedrock/server';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

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
