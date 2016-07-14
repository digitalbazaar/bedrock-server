/*
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 */
/* global should */

'use strict';

var bedrock = require('bedrock');
var superagent = require('superagent');

describe('bedrock-server', function() {
  describe('HTTP Strict Transport Security', function() {
    it('should be enabled by default', function(done) {
      var httpUrl = 'http://' + bedrock.config.server.domain + ':' +
        bedrock.config.server.httpPort + '/';
      superagent.get(httpUrl)
        .redirects(0)
        .end(function(err) {
          should.exist(err);
          err.status.should.equal(302);
          err.response.header.should.have.property(
            'strict-transport-security', 'max-age=31536000');
          done();
        });
    });
  });

  describe('HTTPS', function() {
    it('should be enabled by default', function(done) {
      var old = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      superagent.get(bedrock.config.server.baseUri + '/')
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = old;
          res.status.should.equal(200);
          done();
        });
    });
  });

});
