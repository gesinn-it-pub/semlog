# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.0] - 2026-07-26

Raises the minimum supported Node.js version and moves CI to only test active LTS lines.

### Breaking Changes
- Raise minimum supported Node.js version from 20 to 22 [`98ab58b`](https://github.com/gesinn-it-pub/semlog/commit/98ab58b)

### Changed
- CI now tests only active Node.js LTS lines (22, 24) [`98ab58b`](https://github.com/gesinn-it-pub/semlog/commit/98ab58b)
- Bump `actions/checkout`, `actions/setup-node`, and `codecov/codecov-action` to v7 [`98ab58b`](https://github.com/gesinn-it-pub/semlog/commit/98ab58b)

### Fixed
- Drop Node 26 from the CI matrix; c8 (via yargs) crashes on Node >=25.7 with an unresolved upstream bug (bcoe/c8#582) [`a8e8c6c`](https://github.com/gesinn-it-pub/semlog/commit/a8e8c6c)

[Unreleased]: https://github.com/gesinn-it-pub/semlog/compare/1.0.0...HEAD
[1.0.0]: https://github.com/gesinn-it-pub/semlog/compare/0.8.0...1.0.0

Older releases: [0.x](CHANGELOG-0.x.md)
