# Changelog (1.x)

Archived changelog entries for the 1.x release line. This file is never modified after creation.

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

[1.0.1]: https://github.com/gesinn-it-pub/semlog/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/gesinn-it-pub/semlog/compare/0.8.0...1.0.0
