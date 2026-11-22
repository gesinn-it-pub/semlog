# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [2.0.0] - 2026-11-22

Major release: semlog is now an ES module with TypeScript types, a stricter and more predictable marker and config handling, and the formatting helpers in their own entry point.

### Breaking Changes
- semlog is now an ES module (`"type": "module"`, named exports); `import { log } from 'semlog'` and `import * as semlog from 'semlog'` work, and `require('semlog')` keeps working on Node.js 22.12 or newer [`3d46a62`](https://github.com/gesinn-it-pub/semlog/commit/3d46a62)
- Indicator strings such as `[E]` are only recognized at the start of a message (leading whitespace is ignored); messages that merely contain them, e.g. `array[D]`, are no longer colored, counted or suppressed [`3a982ab`](https://github.com/gesinn-it-pub/semlog/commit/3a982ab)
- `updateConfig()` throws a `TypeError` for unknown options and values of the wrong type instead of silently accepting them [`1260296`](https://github.com/gesinn-it-pub/semlog/commit/1260296)
- The formatting helpers (`pad`, `prettyNumber`, `prettyBytes`, `byteSize`, `cleanUrl`, `stripTrailingSlash`, `getDateArray`, `humanDate`, `humanTime`, `roboDate`, `roboTime`) are no longer exported from `semlog`; import them from `semlog/utils` [`6a6a983`](https://github.com/gesinn-it-pub/semlog/commit/6a6a983)
- Require Node.js 22.12 or newer [`6ae608f`](https://github.com/gesinn-it-pub/semlog/commit/6ae608f)

### Added
- Add `addMarker(marker, color)` to register custom indicator strings [`3a982ab`](https://github.com/gesinn-it-pub/semlog/commit/3a982ab)
- Add TypeScript type declarations for `semlog` and `semlog/utils` [`dbf5aed`](https://github.com/gesinn-it-pub/semlog/commit/dbf5aed)

### Changed
- Update `chalk` to v6, which is re-exported as `chalk` [`3d46a62`](https://github.com/gesinn-it-pub/semlog/commit/3d46a62)
- Document the markers, logger functions, config options and helpers in the README and remove the outdated generated API documentation [`c703efc`](https://github.com/gesinn-it-pub/semlog/commit/c703efc), [`6b01b0a`](https://github.com/gesinn-it-pub/semlog/commit/6b01b0a)

### Fixed
- `historySize: 0` now really disables the history instead of letting it grow without limit, and the history shrinks when `historySize` is lowered at runtime [`9ca9834`](https://github.com/gesinn-it-pub/semlog/commit/9ca9834)
- The history stores strings without JSON quotes and keeps message and stack of errors instead of `{}` [`9ca9834`](https://github.com/gesinn-it-pub/semlog/commit/9ca9834)
- `clearLogHistory()` resets history and statistics in place, so references obtained earlier via `getLogHistory()` / `getStatistics()` stay valid [`9965b61`](https://github.com/gesinn-it-pub/semlog/commit/9965b61)
- `debug()` and `error()` no longer throw for circular objects, BigInt values, `null` or non-Error arguments [`f831f0b`](https://github.com/gesinn-it-pub/semlog/commit/f831f0b)
- `error()` prints to stderr only and no longer repeats an empty `{}` dump [`f831f0b`](https://github.com/gesinn-it-pub/semlog/commit/f831f0b)
- `debug()` respects `printDebug` and counts in `statistics.debug`, consistent with `message()` [`f831f0b`](https://github.com/gesinn-it-pub/semlog/commit/f831f0b)
- Fill config options that are missing in state shared by an older copy of semlog with their defaults [`61fe05a`](https://github.com/gesinn-it-pub/semlog/commit/61fe05a)
- `cleanUrl()` and `stripTrailingSlash()` remove repeated slashes, as documented, instead of only one [`d423e0c`](https://github.com/gesinn-it-pub/semlog/commit/d423e0c)
- `prettyBytes()` no longer prints values like `1024.0 KiB` or `undefined` units and handles negative values; `prettyNumber()` no longer groups the digits after the decimal point [`26d1e5f`](https://github.com/gesinn-it-pub/semlog/commit/26d1e5f)
- `byteSize(undefined)` no longer throws [`1e998bc`](https://github.com/gesinn-it-pub/semlog/commit/1e998bc)

[Unreleased]: https://github.com/gesinn-it-pub/semlog/compare/2.0.0...HEAD
[2.0.0]: https://github.com/gesinn-it-pub/semlog/compare/1.0.1...2.0.0

Older releases: [1.x](CHANGELOG-1.x.md), [0.x](CHANGELOG-0.x.md)
