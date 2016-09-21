/*
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 */
/* global should, describe, it */

'use strict';

var bedrock = require('bedrock');
var request = require('request');
request = request.defaults({strictSSL: false});

describe('bedrock-server', function() {
  describe('HTTP Strict Transport Security', function() {
    it('should be enabled by default', done => {
      var httpUrl = 'http://' + bedrock.config.server.domain + ':' +
        bedrock.config.server.httpPort + '/';
      request.get({
        url: httpUrl,
        followRedirect: false
      }, (err, res) => {
        should.not.exist(err);
        res.statusCode.should.equal(302);
        res.headers.should.have.property(
          'strict-transport-security', 'max-age=31536000');
        done();
      });
    });
  });

  describe('HTTPS', function() {
    it('should be enabled by default', done => {
      request.get(bedrock.config.server.baseUri + '/', (err, res, body) => {
        should.not.exist(err);
        res.statusCode.should.equal(503);
        body.should.equal('Service Unavailable');
        done();
      });
    });
  });

});
