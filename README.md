# bedrock-server

[![Bedrock Node.js CI](https://github.com/digitalbazaar/bedrock-server/workflows/Bedrock%20Node.js%20CI/badge.svg)](https://github.com/digitalbazaar/bedrock-server/actions?query=workflow%3A%22Bedrock+Node.js+CI%22)

## Table of Contents

- [Background](#background)
- [Requirements](#requirements)
- [Usage](#usage)
  - [Quick Example](#quick-examples)
- [Configuration](#configuration)
  - [IP Tunnel](#ip-tunnel)
- [Setup](#setup)
- [Bedrock Events](#bedrock-events)
- [How It Works](#how-it-works)

## Background
A [bedrock][] module that provides a basic HTTP and HTTPS server. Other
modules, such as [bedrock-express][], typically provide a routing framework
and other features for writing Web applications, but depend on this module
for core low-level functionality like listening for incoming connections,
redirecting HTTP traffic to the HTTPS port, and configuring SSL/TLS.

## Requirements

- npm v6+

## Usage 

### Quick Examples

```
npm install @bedrock/server
```

An example of attaching a custom request handler to the server once Bedrock is
ready.

```js
import * as bedrock from '@bedrock/core';
import * as server from '@bedrock/server';

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

By default, `@bedrock/server` will redirect any HTTP requests to HTTPS. To
replace this default behavior, do the following:

```js
import * as server from '@bedrock/server';

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

### IP Tunnel
Bedrock server maybe used with an IP tunnel.
In `config/express.js`:
```js
// allow the tunnel http only access
config.express.httpOnly = true;
// configure fastify to trust the ip tunnel proxy 
config.express.fastifyOptions.trustProxy = true;
```

In `config/server.js`:
```js
// accept connections from any IP
config.server.domain = '0.0.0.0';
// this should be website the IP tunnel will host on 
config.server.host = 'your.host.name';
// bind your tunnel to this port
config.server.httpPort = 8080; 
```

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

## Bedrock Events

List of emitted
[Bedrock Events](https://github.com/digitalbazaar/bedrock#bedrockevents):

- **bedrock-server.readinessCheck**
  - Emitted before listening starts on any ports.
- **bedrock-server.http.listen**
  - **Arguments**:
    - `{address, port}`: Object with address and port to listen on.
  - Emitted before listening on a HTTP port.
- **bedrock-server.http.listening**
  - **Arguments**:
    - `{address, port}`: Object with address and port now listening on.
  - Emitted after listening on a HTTP port.
- **bedrock-server.https.listen**
  - **Arguments**:
    - `{address, port}`: Object with address and port to listen on.
  - Emitted before listening on a HTTPS port.
- **bedrock-server.https.listening**
  - **Arguments**:
    - `{address, port}`: Object with address and port now listening on.
  - Emitted after listening on a HTTPS port.
- **bedrock-server.ready**
  - Emitted after listening is complete.

## How It Works

TODO

[bedrock]: https://github.com/digitalbazaar/bedrock
[bedrock-express]: https://github.com/digitalbazaar/bedrock-express
