[![npm version](https://img.shields.io/npm/v/semlog.svg?style=flat)](https://www.npmjs.com/package/semlog)
[![Dependency Status](https://img.shields.io/david/Fannon/semlog.svg?style=flat)](https://david-dm.org/Fannon/semlog)
[![Build Status](https://img.shields.io/travis/Fannon/semlog.svg?style=flat)](http://travis-ci.org/Fannon/semlog)
[![Code Climate](https://codeclimate.com/github/Fannon/semlog/badges/gpa.svg)](https://codeclimate.com/github/Fannon/semlog)
[![Test Coverage](https://codeclimate.com/github/Fannon/semlog/badges/coverage.svg)](https://codeclimate.com/github/Fannon/semlog)
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
### API Documentation
* [API Documenatation](API.md)

### Import 
```javascript
var semlog = require('semlog');
var log = semlog.log; // Optional shortcut for logging
```

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

### Logger functions
```javascript
// Returns an array with the latest log messages (depending on the config.
var logArchive = semlog.getLogHistory();

// Get current logger config
var config = semlog.getConfig();

// Change default options:
// This will only update the option that are actually given
semlog.updateConfig({
    colorize: true,
    printYaml: false,
    logDateTime: true,
    printTime: true,
    printDateTime: false,
    historySize: 2048 // 0 for none
});
```

### Helper Functions and more examples
semlog has some built in helper functions like returning nicely formatted dates.

For a complete API Doc, please view the [API docs](https://cdn.rawgit.com/Fannon/semlog/master/doc/).

More example can be found in the [unit test](https://github.com/Fannon/semlog/blob/master/test/test.spec.js) file.

## License
MIT © [Simon Heimler](http://www.fannon.de)

[npm-image]: https://badge.fury.io/js/semlog.svg
[npm-url]: https://npmjs.org/package/semlog
[travis-image]: https://travis-ci.org/Fannon/semlog.svg?branch=master
[travis-url]: https://travis-ci.org/Fannon/semlog
[daviddm-image]: https://david-dm.org/Fannon/semlog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Fannon/semlog
