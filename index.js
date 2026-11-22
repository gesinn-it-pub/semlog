/**
 * semlog
 * A semantic logger that colors and formats messages automatically according to the content
 *
 * @author Simon Heimler
 */

//////////////////////////////////////////
// Requirements                         //
//////////////////////////////////////////

import chalk from 'chalk';
import prettyjson from 'prettyjson';

//////////////////////////////////////////
// Variables                            //
//////////////////////////////////////////

const DEFAULT_CONFIG = {
    silent: false,
    colorize: true,
    printYaml: false,
    logDateTime: true,
    printTime: true,
    printDateTime: false,
    printDebug: true,
    printVerbose: true,
    historySize: 2048, // 0 for none
};

// The state lives on the global object, so several copies of this module share one history and config
if (!global.githubFannonSemlog) {
    global.githubFannonSemlog = {
        history: [],
        config: {},
        statistics: {
            debug: 0,
            warning: 0,
            error: 0,
            total: 0,
        },
    };
}

// Fill in options that an older copy of this module, which created the state first, did not know about
global.githubFannonSemlog.config = { ...DEFAULT_CONFIG, ...global.githubFannonSemlog.config };

/** Publicly export the chalk color library */
export { chalk };

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
export function log(obj, silent) {
    if (obj && obj instanceof Error) {
        error(obj, silent);
    } else if (obj && typeof obj === 'object') {
        debug(obj, silent);
    } else {
        message(obj, silent);
    }
}

export function message(msg, silent) {
    const state = global.githubFannonSemlog;
    const config = state.config;

    if (typeof msg !== 'string') {
        try {
            msg = '' + JSON.stringify(msg);
        } catch {
            msg = '[E] [SEMLOG] Could not stringify given parameter';
        }
    }

    // Statistics are derived from the final string, so non-string values (e.g. arrays) cannot be misdetected
    state.statistics.total += 1;
    const isVerbose = msg.includes('[V]');
    const isDebug = msg.includes('[D]');
    if (isVerbose || isDebug) {
        state.statistics.debug += 1;
    } else if (msg.includes('[W]')) {
        state.statistics.warning += 1;
    } else if (msg.includes('[E]')) {
        state.statistics.error += 1;
    }

    addToHistory(msg);

    // Decide before formatting, so suppressed messages cost nothing and the time prefix cannot interfere
    if (silent || config.silent || (isVerbose && !config.printVerbose) || (isDebug && !config.printDebug)) {
        return;
    }

    if (config.colorize) {
        msg = colorize(msg);
    }

    if ((config.printTime || config.printDateTime) && msg.trim().length > 0) {
        const time = config.printDateTime ? humanDate() : humanTime();
        msg = chalk.gray('[' + time + '] ') + msg;
    }

    console.log(msg);
}

/**
 * Stringifies a value for output without ever throwing
 *
 * @param {*} obj
 * @param {number} [space]  Indentation
 * @returns {string}
 */
function safeStringify(obj, space) {
    try {
        const json = JSON.stringify(obj, null, space);
        return json === undefined ? String(obj) : json;
    } catch {
        return '[E] [SEMLOG] Could not stringify given parameter';
    }
}

/**
 * Prints out debugging information for the current model object
 *
 * @param {object}        obj       Object
 * @param {boolean}       [silent]  Do not print to the console, but store in the history
 */
export function debug(obj, silent) {
    const state = global.githubFannonSemlog;
    const config = state.config;
    state.statistics.total += 1;
    state.statistics.debug += 1;
    addToHistory(obj);

    if (silent || config.silent || !config.printDebug) {
        return;
    }

    if (config.printYaml) {
        const options = {
            keysColor: 'white',
            dashColor: 'white',
            stringColor: 'yellow',
            numberColor: 'blue',
        };

        if (!config.colorize) {
            options.noColor = true;
        }

        try {
            console.log(chalk.gray('---\n') + prettyjson.render(obj, options));
            return;
        } catch {
            // Fall through to the JSON output, e.g. for circular objects
        }
    }

    console.log(chalk.gray(safeStringify(obj, 4)));
}

/**
 * Prints errors
 *
 * @param {Error|object|string} obj       Error (or any value) to print
 * @param {boolean}             [silent]  Do not print to the console, but store in the history
 */
export function error(obj, silent) {
    const state = global.githubFannonSemlog;
    state.statistics.total += 1;
    state.statistics.error += 1;
    addToHistory(obj);

    if (silent || state.config.silent) {
        return;
    }

    const hasMessage = obj !== null && typeof obj === 'object' && obj.message !== undefined;
    console.error(chalk.red('[E] ' + (hasMessage ? obj.message : typeof obj === 'string' ? obj : safeStringify(obj))));

    if (hasMessage) {
        // Message and stack of an Error are not enumerable, so only additional properties show up here
        const details = safeStringify(obj, 4);
        if (details !== '{}') {
            console.error(chalk.gray(details));
        }
    }
    if (obj && obj.stack) {
        console.error(chalk.gray(obj.stack));
    }
}

/**
 * Converts any value into the string that is stored in the history
 *
 * @param {*} obj
 * @returns {string}
 */
function serializeForHistory(obj) {
    if (typeof obj === 'string') {
        return obj;
    }
    if (obj instanceof Error) {
        return obj.stack || obj.name + ': ' + obj.message;
    }
    const json = JSON.stringify(obj, null, 4);
    return json === undefined ? String(obj) : json;
}

/**
 * Adds an entry to the log history, respecting `historySize` (0 disables the history)
 *
 * @param {*} obj
 */
export function addToHistory(obj) {
    const { config, history } = global.githubFannonSemlog;

    if (!(config.historySize > 0)) {
        return;
    }

    let msg;
    try {
        msg = serializeForHistory(obj);
        if (config.logDateTime) {
            msg = '[' + humanDate() + '] ' + msg;
        }
    } catch {
        msg = '[W] Internal semlog error: Could not push circular/invalid object into the history';
    }

    history.push(msg);

    // Also shrinks the history if historySize was lowered at runtime
    if (history.length > config.historySize) {
        history.splice(0, history.length - config.historySize);
    }
}

/** Indicator strings and their colors, in order of precedence */
const COLOR_MAP = [
    ['[E]', 'red'], // ERROR
    ['[W]', 'yellow'], // WARNING
    ['[?]', 'yellow'], // MISSING
    ['[S]', 'green'], // SUCCESS
    ['[i]', 'blue'], // INFO
    ['[+]', 'green'], // ADDED
    ['[-]', 'red'], // REMOVED
    ['[C]', 'cyan'], // CHANGED
    ['[U]', 'grey'], // UNCHANGED
    ['[=]', 'grey'], // EQUAL
    ['[/]', 'grey'], // SKIPPED
    ['[V]', 'magenta'], // VERBOSE
    ['[D]', 'magenta'], // DEBUG
    ['[T]', 'magenta'], // TO-DO
    ['[TODO]', 'magenta'], // TO-DO
];

/**
 * Colors the messages by searching for specific indicator strings
 * TODO: Allow to add to the colorMap
 *
 * @param {string} msg
 * @returns {string}
 */
export function colorize(msg) {
    if (typeof msg !== 'string') {
        return msg;
    }

    for (const [searchString, color] of COLOR_MAP) {
        if (msg.includes(searchString)) {
            return chalk[color](msg);
        }
    }

    return msg;
}

//////////////////////////////////////////
// LOGGER FUNCTIONS                     //
//////////////////////////////////////////

/**
 * Gets the current config
 */
export function getConfig() {
    return global.githubFannonSemlog.config;
}

/**
 * Gets the current config
 */
export function getStatistics() {
    return global.githubFannonSemlog.statistics;
}

/**
 * Updates the config.
 * Only those parameters that have been given will be updated
 *
 * @param {object} config
 */
export function updateConfig(config) {
    Object.assign(global.githubFannonSemlog.config, config);
    return global.githubFannonSemlog.config;
}

/**
 * Clears (empties) the log object
 */
export function clearLogHistory() {
    const state = global.githubFannonSemlog;
    // Reset in place, so references obtained via getLogHistory() / getStatistics() stay valid
    state.history.length = 0;
    Object.assign(state.statistics, { debug: 0, warning: 0, error: 0, total: 0 });
}

/**
 * Returns the log history
 *
 * @returns {Array}
 */
export function getLogHistory() {
    return global.githubFannonSemlog.history;
}

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
export function pad(number, digits) {
    return new Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

/**
 * Adds dots as thousand separators to numbers; a decimal fraction is separated by a comma
 *
 * http://stackoverflow.com/a/2901298
 *
 * @param number
 * @returns {string}
 */
export function prettyNumber(number) {
    const [integer, fraction] = number.toString().split('.');
    const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return fraction === undefined ? grouped : grouped + ',' + fraction;
}

/**
 * Removes all leading and trailing slashes and surrounding whitespace
 *
 * @see http://stackoverflow.com/a/3840645
 *
 * @param {string} url URL / Path to cleanup
 * @returns {string}
 */
export function cleanUrl(url) {
    return url.trim().replace(/^\/+|\/+$/g, '');
}

/**
 * Strips all trailing slashes from a URL
 *
 * @see http://stackoverflow.com/a/6680858/776425
 *
 * @param {string} url URL to cleanup
 * @returns {string}
 */
export function stripTrailingSlash(url) {
    return url.replace(/\/+$/, '');
}

/**
 * Returns the byte length of an utf8 string or an object (when parsed to JSON)
 *
 * @see http://stackoverflow.com/a/23329386
 */
export function byteSize(obj) {
    let str;

    if (typeof obj === 'object') {
        str = JSON.stringify(obj);
    } else {
        str = obj.toString();
    }

    let s = str.length;
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) {
            s++;
        } else if (code > 0x7ff && code <= 0xffff) {
            s += 2;
        }
        if (code >= 0xdc00 && code <= 0xdfff) {
            i--;
        } //trail surrogate
    }
    return s;
}

/**
 *
 * @param bytes
 * @param [si]
 * @returns {string}
 *
 * @see http://stackoverflow.com/a/14919494
 */
export function prettyBytes(bytes, si) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
        // Compare the rounded value, so 1023.96 KiB becomes 1.0 MiB instead of 1024.0 KiB
    } while (Math.abs(Number(bytes.toFixed(1))) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

/**
 * Returns an array with date / time information
 * Starts with year at index 0 up to index 6 for milliseconds
 *
 * @param {Date=} date   Optional date object. If falsy, will take current time.
 * @returns {Array}
 */
export function getDateArray(date) {
    date = date || new Date();
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1, 2),
        pad(date.getDate(), 2),
        pad(date.getHours(), 2),
        pad(date.getMinutes(), 2),
        pad(date.getSeconds(), 2),
        pad(date.getMilliseconds(), 3),
    ];
}

/**
 * Returns nicely formatted date-time
 * @example 2015-02-10 16:01:12
 *
 * @param {object} [date]
 * @returns {string}
 */
export function humanDate(date) {
    date = date || new Date();
    const d = getDateArray(date);
    return d[0] + '-' + d[1] + '-' + d[2] + ' ' + d[3] + ':' + d[4] + ':' + d[5];
}

/**
 * Returns a formatted date-time, optimized for machines
 * @example 2015-02-10_16-00-08
 *
 * @param {object} [date]
 * @returns {string}
 */
export function roboDate(date) {
    date = date || new Date();
    const d = getDateArray(date);
    return d[0] + '-' + d[1] + '-' + d[2] + '_' + d[3] + '-' + d[4] + '-' + d[5];
}

/**
 * Returns nicely formatted date-time
 * @example 16:01:12
 *
 * @param {object} [date]
 * @returns {string}
 */
export function humanTime(date) {
    date = date || new Date();
    const d = getDateArray(date);
    return d[3] + ':' + d[4] + ':' + d[5];
}

/**
 * Returns a formatted date-time, optimized for machines
 * @example 2015-02-10_16-00-08
 *
 * @param {object} [date]
 * @returns {string}
 */
export function roboTime(date) {
    date = date || new Date();
    const d = getDateArray(date);
    return d[3] + '-' + d[4] + '-' + d[5];
}
