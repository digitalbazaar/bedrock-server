# bedrock-server

[![Build Status](http://ci.digitalbazaar.com/buildStatus/icon?job=bedrock-server)](http://ci.digitalbazaar.com/job/bedrock-server)

A [bedrock][] module that provides a basic HTTP and HTTPS server. Other
modules, such as [bedrock-express][], typically provide a routing framework
and other features for writing Web applications, but depend on this module
for core low-level functionality like listening for incoming connections,
redirecting HTTP traffic to the HTTPS port, and configuring SSL/TLS.

## Requirements

- npm v3+

## Quick Examples

```
npm install bedrock-server
```

An example of attaching a custom request handler to the server once Bedrock is
ready.

```js
var bedrock = require('bedrock');
var server = require('bedrock-server');

// once bedrock is ready, attach request handler
bedrock.events.on('bedrock.ready', function() {
  // attach to TLS server
  server.servers.https.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  });
});

bedrock.start();
```

By default, `bedrock-server` will redirect any HTTP requests to HTTPS. To
replace this default behavior, do the following:

```js
var server = require('bedrock-server');

// once bedrock is ready, attach request handler
bedrock.events.on('bedrock.ready', function() {
  // attach to HTTP server
  server.servers.http.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  });
});

bedrock.start();
```

## Configuration

For documentation on server configuration, see [config.js](./lib/config.js).

## Setup

1. [optional] Tweak configuration
2. Map the `bedrock.localhost` hostname (or whatever you've configured) to your
   machine:
   1. Edit the /etc/hosts file as the administrator/root.
   2. Add an entry mapping the IP address to `bedrock.localhost`.
      For example: `127.0.0.1 localhost bedrock.localhost`.
      (If accessing the server externally, you may need to use the IP address
      of your primary network device).

To access the server once bedrock is running:

1. Go to: https://bedrock.localhost:18443/
2. The certificate warning is normal for development mode. Accept it and
   continue.

## How It Works

TODO

[bedrock]: https://github.com/digitalbazaar/bedrock
[bedrock-express]: https://github.com/digitalbazaar/bedrock-express
