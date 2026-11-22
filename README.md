[![npm version](https://img.shields.io/npm/v/semlog.svg?style=flat)](https://www.npmjs.com/package/semlog)
[![CI](https://github.com/gesinn-it-pub/semlog/actions/workflows/ci.yml/badge.svg)](https://github.com/gesinn-it-pub/semlog/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/gesinn-it-pub/semlog/branch/master/graph/badge.svg)](https://codecov.io/github/gesinn-it-pub/semlog)
> A semantic logger module, that colors / formats automatically

## About
semlog is a simple logger utiltiy that automatically colors and formats the logging messages and objects, according to their content. 
It'll use a global object to store the config and the log history, so it can be easily used thoughout a project.

The semlog approach might not be for anyone, it's a lazy mans logging utility :)

## Install
```sh
$ npm install --save semlog
```

## Usage
### Import 
```javascript
import * as semlog from 'semlog';
const log = semlog.log; // Optional shortcut for logging

// or use named imports
import { log, chalk } from 'semlog';
```

semlog is an ES module. CommonJS code on Node.js 22.12 or newer can still load it with `require('semlog')`.

### Logging
```javascript
// Pretty log an error object
log(new Error('error log entry'));

// Pretty log an object (no circular object supported, sorry)
log({title: 'Object log entry', number: 10});

// Log strings
log('[i] info log entry ');
log('[W] warning log entry');
log('[E] error log entry');
log('[S] success log entry');
log('[D] debug log entry');
log('[+] added log entry');
log('[-] removed log entry');
log('[C] changed log entry');
log('[TODO] todo log entry');
```

### Markers
A message is colored, counted in the statistics and filtered according to the marker it starts with
(leading whitespace is ignored). Markers inside a message are ignored.

| Marker | Color | Meaning |
| --- | --- | --- |
| `[E]` | red | error |
| `[W]` | yellow | warning |
| `[?]` | yellow | missing |
| `[S]` | green | success |
| `[i]` | blue | info |
| `[+]` / `[-]` | green / red | added / removed |
| `[C]` | cyan | changed |
| `[U]` / `[=]` / `[/]` | grey | unchanged / equal / skipped |
| `[V]` / `[D]` | magenta | verbose / debug (hidden by `printVerbose` / `printDebug: false`) |
| `[T]` / `[TODO]` | magenta | to-do |

Register your own markers with any [chalk](https://github.com/chalk/chalk) color:

```javascript
semlog.addMarker('[OK]', 'green');
```

### Logger functions
Types for all functions are shipped in `index.d.ts`.

| Function | Description |
| --- | --- |
| `log(value, silent?)` | Errors go to `error()`, objects and arrays to `debug()`, everything else to `message()`. With `silent` the entry is only stored in the history |
| `message(value, silent?)` | Prints a string (other values as JSON), colored by its marker |
| `debug(object, silent?)` | Prints an object as indented JSON, or as YAML with `printYaml` |
| `error(value, silent?)` | Prints an error with its stack to stderr |
| `addMarker(marker, color)` | Registers a custom marker, e.g. `[OK]` |
| `getLogHistory()` | Returns the latest log entries as an array of strings |
| `clearLogHistory()` | Empties the history and resets the statistics, in place |
| `getStatistics()` | Returns `{ debug, warning, error, total }` |
| `getConfig()` | Returns the current config |
| `updateConfig(options)` | Updates the given options; throws a `TypeError` for unknown options or invalid values |

```javascript
semlog.updateConfig({
    silent: false,       // print nothing, only fill the history
    colorize: true,
    printYaml: false,    // print objects as YAML instead of JSON
    logDateTime: true,   // prefix history entries with the date and time
    printTime: true,     // prefix console output with the time
    printDateTime: false,// prefix console output with date and time instead
    printDebug: true,    // show [D] messages and objects
    printVerbose: true,  // show [V] messages
    historySize: 2048    // 0 for none
});
```

### Helper functions
Helpers for formatting dates, numbers, bytes and URLs are available as a separate entry point:

```javascript
import { humanDate, prettyBytes } from 'semlog/utils';

humanDate();           // 2015-02-10 16:01:12
prettyBytes(2048);     // 2.0 KiB
```

| Function | Example |
| --- | --- |
| `humanDate(date?)` / `humanTime(date?)` | `2015-02-10 16:01:12` / `16:01:12` |
| `roboDate(date?)` / `roboTime(date?)` | `2015-02-10_16-00-08` / `16-00-08` |
| `getDateArray(date?)` | `[year, month, day, hours, minutes, seconds, milliseconds]` |
| `pad(number, digits)` | `pad(7, 3)` → `007` |
| `prettyNumber(number)` | `1234567` → `1.234.567` |
| `prettyBytes(bytes, si?)` | `1024` → `1.0 KiB`, with `si` `1.0 kB` |
| `byteSize(value)` | UTF-8 byte length of a string or of an object as JSON |
| `cleanUrl(url)` | `/a/b/` → `a/b` |
| `stripTrailingSlash(url)` | `http://x.de/` → `http://x.de` |

More examples can be found in the [unit tests](https://github.com/gesinn-it-pub/semlog/blob/master/test).

## License
MIT © [Simon Heimler](http://www.fannon.de)
