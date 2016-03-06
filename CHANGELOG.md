# bedrock-server ChangeLog

## [Unreleased]

## [1.1.0] - 2016-03-06

### Added

- Add ability to directly configure `tls.createServer` options via
  `bedrock.config.server.https.options`. Any options given in
  `bedrock.config.server.*` (such as `bedrock.config.server.key`) may
  overwrite those specified in `bedrock.config.server.https.options`.

## [1.0.2] - 2015-05-07

## [1.0.1] - 2015-04-09

### Changed
- Fix dependencies for testing.

## [1.0.0] - 2015-04-08

### Changed
- Remove `bedrock.setProcessUser()` handled by bedrock core.
- Use `bedrock.admin.init` event.

## [0.1.1] - 2015-02-23

### Changed
- Upgrade to express `0.4.x`.

## 0.1.0 - 2015-02-23

- See git history for changes.

[Unreleased]: https://github.com/digitalbazaar/bedrock-server/compare/1.1.0...HEAD
[1.1.0]: https://github.com/digitalbazaar/bedrock-server/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/digitalbazaar/bedrock-server/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/digitalbazaar/bedrock-server/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/digitalbazaar/bedrock-server/compare/0.1.1...1.0.0
[0.1.1]: https://github.com/digitalbazaar/bedrock-server/compare/0.1.0...0.1.1
