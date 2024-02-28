/*!
 * Copyright 2014 - 2024 Digital Bazaar, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
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
