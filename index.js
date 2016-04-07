/**
 * semlog
 * A semantic logger that colors and formats messages automatically according to the content
 *
 * @author Simon Heimler
 */

'use strict';

//////////////////////////////////////////
// Requirements                         //
//////////////////////////////////////////

var chalk = require('chalk');
var prettyjson = require('prettyjson');

//////////////////////////////////////////
// Variables                            //
//////////////////////////////////////////

if (!global.githubFannonSemlog) {
    global.githubFannonSemlog = {
        history: [],
        config: {
            silent: false,
            colorize: true,
            printYaml: false,
            logDateTime: true,
            printTime: true,
            printDateTime: false,
            printDebug: true,
            printVerbose: true,
            historySize: 2048 // 0 for none
        },
        statistics: {
            debug: 0,
            warning: 0,
            error: 0,
            total: 0
        }
    };
}

/** Publicly export the chalk color library */
exports.chalk = chalk;

//////////////////////////////////////////
// LOGGING FUNCTIONS                    //
//////////////////////////////////////////

/**
 * Custom Logging function
 *
 * Writes Logs to console, stringifies objects first
 *
 * @param {string|object}   msg     Message String or Object
 * @param {boolean}         [silent]  Dot not print message to the console, but stores it to the log history.
 */
exports.log = function(obj, silent) {
    if (obj && obj instanceof Error) {
        exports.error(obj, silent);
    } else if (obj && typeof obj === 'object') {
        exports.debug(obj, silent);
    } else {
        exports.message(obj, silent);
    }
};

exports.message = function(msg, silent) {

    global.githubFannonSemlog.statistics.total += 1;
    if (msg && msg.indexOf && (msg.indexOf('[V]') >= 0 || msg.indexOf('[D]') >= 0)) {
        global.githubFannonSemlog.statistics.debug += 1;
    } else if (msg && msg.indexOf && msg.indexOf('[W]') >= 0) {
        global.githubFannonSemlog.statistics.warning += 1;
    } else if (msg && msg.indexOf && msg.indexOf('[E]') >= 0) {
        global.githubFannonSemlog.statistics.error += 1;
    }

    var config = global.githubFannonSemlog.config;
    silent = silent || config.silent;

    if (typeof msg !== 'string') {
        try {
            msg = '' + JSON.stringify(msg);
        } catch (e) {
            msg = '[E] [SEMLOG] Could not stringify given parameter';
        }
    }

    exports.addToHistory(msg);

    if (!silent) {

        if (config.colorize) {
            msg = exports.colorize(msg);
        }

        if ((config.printTime || config.printDateTime) && msg.trim && msg.trim().length > 0) {
            if (config.printDateTime) {
                msg = chalk.gray('[' + exports.humanDate() + '] ') + msg;
            } else {
                msg = chalk.gray('[' + exports.humanTime() + '] ') + msg;
            }
        }

        if (!config.printVerbose && msg.indexOf('[V]') >= 0) {
            // Supressing output of verbose message
        } else if (!config.printDebug && msg.indexOf('[D]') >= 0) {
            // Supressing output of debug message
        } else {
            console.log(msg);
        }
    }
};

/**
 * Prints out debugging information for the current model object
 *
 * @param {object}        obj     Object
 */
exports.debug = function(obj, silent) {

    global.githubFannonSemlog.statistics.total += 1;

    var config = global.githubFannonSemlog.config;
    silent = silent || config.silent;
    exports.addToHistory(obj);

    if (!silent) {
        if (global.githubFannonSemlog.config.printYaml) {
            // Print YAML
            var options = {
                keysColor: 'white',
                dashColor: 'white',
                stringColor: 'yellow',
                numberColor: 'blue'
            };

            if (!global.githubFannonSemlog.config.colorize) {
                options.noColor = true;
            }
            console.log(chalk.gray('---\n') + prettyjson.render(obj, options));

        } else {
            // Print indented JSON
            var msg = JSON.stringify(obj, false, 4);
            console.log(chalk.gray(msg));
        }
    }
};

/**
 * Prints errors
 *
 * @param {object}        obj     Object
 */
exports.error = function(obj, silent) {

    global.githubFannonSemlog.statistics.total += 1;
    global.githubFannonSemlog.statistics.error += 1;

    var config = global.githubFannonSemlog.config;
    silent = silent || config.silent;
    exports.addToHistory(obj);

    if (!silent) {
        console.error(chalk.red('[E] ' + obj.message));
        console.log(chalk.gray(JSON.stringify(obj, null, 4)));
        if (obj.stack) {
            console.log(chalk.gray(obj.stack));
        }
    }
};


exports.addToHistory = function(obj) {

    var config = global.githubFannonSemlog.config;
    var msg = '';

    try {
        msg = JSON.stringify(obj, null, 4);

        // Check that the message history size doesn't get to big
        if (config.historySize && global.githubFannonSemlog.history.length >= config.historySize) {
            global.githubFannonSemlog.history.shift();
        }

        if (config.logDateTime) {
            msg = '[' + exports.humanDate() + '] ' + msg;
        }

    } catch (e) {
        msg = '[W] Internal semlog error: Could not push circular/invalid object into the history';
    }

    global.githubFannonSemlog.history.push(msg);
};

/**
 * Colors the messages by searching for specific indicator strings
 * TODO: Allow to add to the colorMap
 *
 * @param {string} msg
 * @returns {string}
 */
exports.colorize = function(msg) {

    var colorMap = {
        '[E]': 'red',         // ERROR
        '[W]': 'yellow',      // WARNING
        '[?]': 'yellow',      // MISSING
        '[S]': 'green',       // SUCCESS
        '[i]': 'blue',        // INFO
        '[+]': 'green',       // ADDED
        '[-]': 'red',         // REMOVED
        '[C]': 'cyan',        // CHANGED
        '[U]': 'grey',        // UNCHANGED
        '[=]': 'grey',        // EQUAL
        '[/]': 'grey',        // SKIPPED
        '[V]': 'magenta',     // VERBOSE
        '[D]': 'magenta',     // DEBUG
        '[T]': 'magenta',     // TO-DO
        '[TODO]': 'magenta'   // TO-DO
    };

    for (var searchString in colorMap) {
        var color = colorMap[searchString];
        if (msg && msg.indexOf && msg.indexOf(searchString) > -1) {
            return chalk[color](msg);
        }
    }

    return msg;
};


//////////////////////////////////////////
// LOGGER FUNCTIONS                     //
//////////////////////////////////////////

/**
 * Gets the current config
 */
exports.getConfig = function() {
    return global.githubFannonSemlog.config;
};


/**
 * Gets the current config
 */
exports.getStatistics = function() {
    return global.githubFannonSemlog.statistics;
};

/**
 * Updates the config.
 * Only those parameters that have been given will be updated
 *
 * @param {object} config
 */
exports.updateConfig = function(config) {
    for (var key in config) {
        var value = config[key];
        global.githubFannonSemlog.config[key] = value;
    }
    return global.githubFannonSemlog.config;
};

/**
 * Clears (empties) the log object
 */
exports.clearLogHistory = function() {
    global.githubFannonSemlog.history = [];
    global.githubFannonSemlog.statistics = {
        debug: 0,
        warning: 0,
        error: 0,
        total: 0
    };
};

/**
 * Returns the global.moboLogObject
 *
 * @returns {Array}
 */
exports.getLogHistory = function() {
    return global.githubFannonSemlog.history;
};


//////////////////////////////////////////
// HELPER UTILITIES                     //
//////////////////////////////////////////

/**
 * Pad a number with n digits
 *
 * @param {number} number   number to pad
 * @param {number} digits   number of total digits
 * @returns {string}
 */
exports.pad = function(number, digits) {
    return new Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
};

/**
 * Adds dots as thousand separators to numbers
 *
 * http://stackoverflow.com/a/2901298
 *
 * @param number
 * @returns {string}
 */
exports.prettyNumber = function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Replace all (/.../g) leading slash (^\/) or (|) trailing slash (\/$) with an empty string.
 *
 * @see http://stackoverflow.com/a/3840645
 *
 * @param {String} url URL / Path to cleanup

 * @returns {String}
 */
exports.cleanUrl = function(url) {
    url = url.trim();
    return url.replace(/^\/|\/$/g, '');
};


/**
 * Strips trailing slashes from URL
 *
 * @see http://stackoverflow.com/a/6680858/776425
 *
 * @param {String} url URL to cleanup
 * @returns {String}
 */
exports.stripTrailingSlash = function(url) {
    if (url.substr(-1) === '/') {
        url = url.substr(0, url.length - 1);
    }
    return url;
};

/**
 * Returns the byte length of an utf8 string or an object (when parsed to JSON)
 *
 * @see http://stackoverflow.com/a/23329386
 */
exports.byteSize = function(obj) {

    var str = '';

    if (typeof obj === 'object') {
        str = JSON.stringify(obj);
    } else {
        str = obj.toString();
    }

    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) {
            s++;
        } else if (code > 0x7ff && code <= 0xffff) {
            s += 2;
        }
        if (code >= 0xDC00 && code <= 0xDFFF) {
            i--;
        } //trail surrogate
    }
    return s;
};

/**
 *
 * @param bytes
 * @param [si]
 * @returns {string}
 *
 * @see http://stackoverflow.com/a/14919494
 */
exports.prettyBytes = function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (bytes < thresh) {
        return bytes + ' B';
    }
    var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + ' ' + units[u];
};

/**
 * Returns an array with date / time information
 * Starts with year at index 0 up to index 6 for milliseconds
 *
 * @param {Date=} date   Optional date object. If falsy, will take current time.
 * @returns {Array}
 */
exports.getDateArray = function(date) {
    date = date || new Date();
    return [
        date.getFullYear(),
        exports.pad(date.getMonth() + 1, 2),
        exports.pad(date.getDate(), 2),
        exports.pad(date.getHours(), 2),
        exports.pad(date.getMinutes(), 2),
        exports.pad(date.getSeconds(), 2),
        exports.pad(date.getMilliseconds(), 2)
    ];
};

/**
 * Returns nicely formatted date-time
 * @example 2015-02-10 16:01:12
 *
 * @param {object} [date]
 * @returns {string}
 */
exports.humanDate = function(date) {
    date = date || new Date();
    var d = exports.getDateArray(date);
    return d[0] + '-' + d[1] + '-' + d[2] + ' ' + d[3] + ':' + d[4] + ':' + d[5];
};

/**
 * Returns a formatted date-time, optimized for machines
 * @example 2015-02-10_16-00-08
 *
 * @param {object} [date]
 * @returns {string}
 */
exports.roboDate = function(date) {
    date = date || new Date();
    var d = exports.getDateArray(date);
    return d[0] + '-' + d[1] + '-' + d[2] + '_' + d[3] + '-' + d[4] + '-' + d[5];
};

/**
 * Returns nicely formatted date-time
 * @example 16:01:12
 *
 * @param {object} [date]
 * @returns {string}
 */
exports.humanTime = function(date) {
    date = date || new Date();
    var d = exports.getDateArray(date);
    return d[3] + ':' + d[4] + ':' + d[5];
};

/**
 * Returns a formatted date-time, optimized for machines
 * @example 2015-02-10_16-00-08
 *
 * @param {object} [date]
 * @returns {string}
 */
exports.roboTime = function(date) {
    date = date || new Date();
    var d = exports.getDateArray(date);
    return d[3] + '-' + d[4] + '-' + d[5];
};

