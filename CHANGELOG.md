# bedrock-server ChangeLog

## 3.2.1 - 2022-03-24

### Fixed
- Add missing `esm` dependency.

## 3.2.0 - 2022-03-24

### Changed
- Update peer deps:
  - `bedrock@4.5`.
- Update internals to use esm style and use `esm.js` to
  transpile to CommonJS.

## 3.1.0 - 2022-01-21

### Changed
- Use node-forge@1.2.1.

### Added
- Setup nyc and add code coverage to github actions.

## 3.0.0 - 2021-08-24

### Changed
- **BREAKING** Use native http2 implementation instead of `spdy`. If you
  are also using bedrock-express then use version 4.1+ of that library to
  ensure there are no compatibility issues. Note: `spdy` is an old package
  that does not receive regular maintenance and node now has its own http2
  implementation -- so using it is preferred.

## 2.9.0 - 2021-07-23

### Changed
- Update peer dependencies; use bedrock@4.

## 2.8.0 - 2021-07-15

### Added
- Do not listen for HTTP/HTTPS requests until readiness checks have passed. This
  is compatible with deployment platforms that lack explicit health and
  readiness checks, but instead expect that the application is ready when it
  responds to requests sent to the HTTP/HTTPS server's TCP port.
  - Emit a new `bedrock-server.readinessCheck` event.
  - Delay the start of the HTTP/HTTPS servers until the
    `bedrock-server.readinessCheck` listeners have succeeded.

## 2.7.0 - 2020-09-30

### Changed
- Use node-forge@0.10.0.

## 2.6.0 - 2020-04-14

### Changed
- Change default server name from `bedrock.localhost` to `localhost`.
- Setup CI.

## 2.5.0 - 2020-04-06

### Added
- Add HTTP/2 support.

## 2.4.1 - 2019-12-10

### Fixed
- Add missing colon between address and port number in logging.

## 2.4.0 - 2019-11-08

### Changed
- Update to latest bedrock events API.
- Use more async/await.
- Improve logging.

## 2.3.4 - 2019-05-07

### Fixed
- Start HTTP/HTTPS listeners on the `bedrock.ready` event.
  `bedrock-express@2.1.1` now attaches on `bedrock.start`.

## 2.3.3 - 2019-04-30

### Fixed
- Start HTTP/HTTPS listeners on the `bedrock.started` event. This is after
  `bedrock-express` configures routes on `bedrock.ready`.

## 2.3.2 - 2018-08-14

### Changed
- Change default server name from `bedrock.local` to `bedrock.localhost`.
- Update development certificate to use sha256.

## 2.3.1 - 2017-09-05

### Fixed
- Fixed incorrect use of `const`.

## 2.3.0 - 2017-08-17

### Changed
- Change default server name from `bedrock.dev` to `bedrock.local`. `dev` is
  a real top-level domain.

## 2.2.1 - 2017-07-24

### Changed
- Update `node-forge` dependency.
- Update `async` dependency.
- Use ES6 syntax.

## 2.2.0 - 2016-12-09

### Changed
- Update bedrock dependency.
- Use computed config for various server values.
  - Add defaults for bindAddr, host, baseUri.

## 2.1.3 - 2016-09-21

### Changed
- Restructure test framework for CI.

## 2.1.2 - 2016-04-30

### Fixed
- Fix typo that prevented replacing default HTTP behavior.

## 2.1.1 - 2016-03-15

### Changed
- Update bedrock dependencies.

## 2.1.0 - 2016-03-06

### Added

- Add ability to directly configure `tls.createServer` options via
  `bedrock.config.server.https.options`. Any options given in
  `bedrock.config.server.*` (such as `bedrock.config.server.key`) may
  overwrite those specified in `bedrock.config.server.https.options`.

## 2.0.0 - 2016-03-02

### Changed
- Update deps for npm v3 compatibility.

## 1.0.2 - 2015-05-07

## 1.0.1 - 2015-04-09

### Changed
- Fix dependencies for testing.

## 1.0.0 - 2015-04-08

### Changed
- Remove `bedrock.setProcessUser()` handled by bedrock core.
- Use `bedrock.admin.init` event.

## 0.1.1 - 2015-02-23

### Changed
- Upgrade to express `0.4.x`.

## 0.1.0 - 2015-02-23

- See git history for changes.
