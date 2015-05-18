/**
 * semlog
 * A semantic logger that colors and formats messages automatically according to the content
 *
 * @author Simon Heimler
 */

'use strict';

/* jshint unused: false */
/* global global */

//////////////////////////////////////////
// Requirements                         //
//////////////////////////////////////////

var chalk = require('chalk');
var events = require('events');


//////////////////////////////////////////
// Variables                            //
//////////////////////////////////////////

if (!global.githubFannonSemlog) {
    global.githubFannonSemlog = {
        history: [],
        events: new events.EventEmitter(),
        config: {
            colorize: true,
            logDate: false,
            date: true,
            longdate: false,
            historySize: 2048 // 0 for none
        }
    };
}

var sl = global.githubFannonSemlog;


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
exports.log = function(msg, silent) {

    var config = global.githubFannonSemlog.config;
    var history = global.githubFannonSemlog.history;

    // Check that the message history size doesn't get to big
    if (global.githubFannonSemlog.config.historySize &&
        global.githubFannonSemlog.history.length >= global.githubFannonSemlog.config.historySize) {
        global.githubFannonSemlog.history.shift();
    }

    // Append message (unformatted and uncolored) to log history
    msg = JSON.parse(JSON.stringify(msg)); // Deep Copy, to avoid circular dependencies
    if (config.logDate) {
        history.push([msg, exports.humanDate(), (new Date()).getTime()]);
    } else {
        history.push(msg);
    }


    global.githubFannonSemlog.events.emit('log', msg);

    // If msg is an object, use the debug function instead
    if (msg !== null && typeof msg === 'object') {
        exports.debug(msg, silent);
        return;
    }

    if (msg && !silent) {
        var finalMsg = exports.colorMessage(msg);

        if (global.githubFannonSemlog.config.date && finalMsg.trim().length > 0) {
            if (global.githubFannonSemlog.config.longdate) {
                finalMsg = chalk.gray('[' + exports.humanDate() + '] ') + finalMsg;
            } else {
                finalMsg = chalk.gray('[' + exports.humanTime() + '] ') + finalMsg;
            }

        }

        console.log(finalMsg);
    }
};

/**
 * Prints out debugging information for the current model object
 *
 * @param {{}}        obj     Object from Development Model
 * @param {boolean}   silent  Silent mode (logs only to file)
 */
exports.debug = function(obj, silent) {

    if (typeof obj === 'object' && !silent) {

        // Print Errors / Stacktraces
        if (obj.stack && obj.name && obj.message) {
            // If the object is an error object, print the stacktrace
            console.log(chalk.red('> ') + chalk.gray(obj.stack) + '\n');
            return;
        }

        var msg = JSON.stringify(obj, false, 4);
        console.log(chalk.gray(msg));
    }

};

/**
 * semlog events
 * Currently only 'log'
 */
exports.events = global.githubFannonSemlog.events;

/**
 * Colors the messages by searching for specific indicator strings
 *
 * @param {string} msg
 * @returns {string}
 */
exports.colorMessage = function(msg) {

    var colorMap = {
        'E': 'red',         // ERROR
        'W': 'yellow',      // WARNING
        'S': 'green',       // SUCCESS
        'i': 'blue',        // INFO
        '+': 'green',       // ADDED
        '-': 'red',         // REMOVED
        'C': 'cyan',        // CHANGED
        'U': 'grey',        // UNCHANGED
        'D': 'magenta',     // DEBUG
        'TODO': 'magenta'   // TO-DO
    };

    for (var searchString in colorMap) {
        var color = colorMap[searchString];
        if (msg.indexOf('[' + searchString + ']') > -1) {
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
 * Updates the config.
 * Only those parameters that have been given will be updated
 *
 * @param {{}} config
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
    return global.githubFannonSemlog.history = [];
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
    for (var i = str.length-1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) {
            s++;
        } else if (code > 0x7ff && code <= 0xffff) {
            s+=2;
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
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};

/**
 * Returns an array with date / time information
 * Starts with year at index 0 up to index 6 for milliseconds
 *
 * @param {Date=} date   Optional date object. If falsy, will take current time.
 * @returns {[]}
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

