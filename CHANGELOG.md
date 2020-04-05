# bedrock-server ChangeLog

## 2.5.0 - 2020-04-xx

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
