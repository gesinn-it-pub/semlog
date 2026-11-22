# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Breaking Changes
- semlog is now an ES module (`"type": "module"`, named exports). `import { log } from 'semlog'` and `import * as semlog from 'semlog'` work; CommonJS `require('semlog')` keeps working on Node.js 22.12 or newer

### Fixed
- `historySize: 0` now really disables the history instead of letting it grow without limit; the history also shrinks when `historySize` is lowered at runtime
- The history stores strings without JSON quotes and keeps message and stack of errors instead of `{}`
- `clearLogHistory()` resets history and statistics in place, so references obtained earlier via `getLogHistory()` / `getStatistics()` stay valid
- `debug()` and `error()` no longer throw for circular objects, BigInt values, `null` or non-Error arguments
- `error()` prints to stderr only and no longer repeats an empty `{}` dump
- `debug()` respects `printDebug` and counts in `statistics.debug`, consistent with `message()`
- Config options that are missing in state shared by an older copy of semlog are filled with their defaults
- `cleanUrl()` and `stripTrailingSlash()` remove repeated slashes, as documented, instead of only one

### Changed
- Update `chalk` to v6, which is re-exported as `chalk`
- Raise minimum supported Node.js version to 22.12, required by `chalk` 6 and the test dependencies (`chai` 6, `mocha` 12)

## [1.0.1] - 2026-11-17

Security maintenance release.

### Fixed
- Update `brace-expansion` and `js-yaml` to patched versions, resolving two high-severity denial-of-service advisories in development dependencies [`5a0524a`](https://github.com/gesinn-it-pub/semlog/commit/5a0524a)

## [1.0.0] - 2026-07-26

Raises the minimum supported Node.js version and moves CI to only test active LTS lines.

### Breaking Changes
- Raise minimum supported Node.js version from 20 to 22 [`98ab58b`](https://github.com/gesinn-it-pub/semlog/commit/98ab58b)

### Changed
- CI now tests only active Node.js LTS lines (22, 24) [`98ab58b`](https://github.com/gesinn-it-pub/semlog/commit/98ab58b)
- Bump `actions/checkout`, `actions/setup-node`, and `codecov/codecov-action` to v7 [`98ab58b`](https://github.com/gesinn-it-pub/semlog/commit/98ab58b)

### Fixed
- Drop Node 26 from the CI matrix; c8 (via yargs) crashes on Node >=25.7 with an unresolved upstream bug (bcoe/c8#582) [`a8e8c6c`](https://github.com/gesinn-it-pub/semlog/commit/a8e8c6c)

[Unreleased]: https://github.com/gesinn-it-pub/semlog/compare/1.0.1...HEAD
[1.0.1]: https://github.com/gesinn-it-pub/semlog/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/gesinn-it-pub/semlog/compare/0.8.0...1.0.0

Older releases: [0.x](CHANGELOG-0.x.md)
