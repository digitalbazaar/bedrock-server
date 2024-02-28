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

import * as bedrock from '@bedrock/core';
import request from 'request';
const localRequest = request.defaults({strictSSL: false});

describe('bedrock-server', function() {
  describe('HTTP Strict Transport Security', function() {
    it('should redirect to HTTPS URL by default', done => {
      const httpUrl = 'http://' + bedrock.config.server.domain + ':' +
        bedrock.config.server.httpPort + '/';
      localRequest.get({
        url: httpUrl,
        followRedirect: false
      }, (err, res) => {
        should.not.exist(err);
        res.statusCode.should.equal(302);
        res.headers.should.have.property(
          'strict-transport-security', 'max-age=31536000');
        res.headers.should.have.property(
          'location', bedrock.config.server.baseUri + '/');
        done();
      });
    });
  });

  describe('HTTPS', function() {
    it('should be enabled by default', done => {
      localRequest.get(
        bedrock.config.server.baseUri + '/', (err, res, body) => {
          should.not.exist(err);
          res.statusCode.should.equal(503);
          body.should.equal('Service Unavailable');
          done();
        });
    });
  });

});
