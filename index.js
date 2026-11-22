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
import { humanDate, humanTime } from './utils.js';

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
 * @param {*}               obj       Message string, object or Error; Errors go to error(), objects to debug()
 * @param {boolean}         [silent]  Do not print message to the console, but store it in the log history.
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

/**
 * Prints a message, colored by its indicator string (e.g. `[E]`, `[W]`), and counts it in the statistics
 *
 * @param {*}               msg       Message string; other values are stringified as JSON
 * @param {boolean}         [silent]  Do not print message to the console, but store it in the log history.
 */
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

    // Statistics are derived from the leading marker of the final string
    state.statistics.total += 1;
    const marker = getMarker(msg);
    const isVerbose = marker === '[V]';
    const isDebug = marker === '[D]';
    if (isVerbose || isDebug) {
        state.statistics.debug += 1;
    } else if (marker === '[W]') {
        state.statistics.warning += 1;
    } else if (marker === '[E]') {
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

/** Indicator strings and their colors */
const MARKER_COLORS = new Map([
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
]);

const MARKER_PATTERN = /^\s*(\[[^\]\s]+\])/;

/**
 * Returns the indicator string a message starts with (ignoring leading whitespace), e.g. `[E]`
 *
 * @param {string} msg
 * @returns {string|undefined}
 */
function getMarker(msg) {
    const match = MARKER_PATTERN.exec(msg);
    return match ? match[1] : undefined;
}

/**
 * Registers an indicator string with a color, or changes the color of an existing one
 *
 * @param {string} marker  Indicator in square brackets without whitespace, e.g. `[OK]`
 * @param {string} color   Name of a chalk color or style, e.g. `green`
 */
export function addMarker(marker, color) {
    if (typeof marker !== 'string' || !/^\[[^\]\s]+\]$/.test(marker)) {
        throw new TypeError('Marker must be a string in square brackets without whitespace, e.g. "[OK]"');
    }
    if (typeof chalk[color] !== 'function') {
        throw new TypeError('Unknown chalk color: ' + color);
    }
    MARKER_COLORS.set(marker, color);
}

/**
 * Colors a message according to the indicator string it starts with, e.g. `[E]`
 *
 * @param {string} msg
 * @returns {string}
 */
export function colorize(msg) {
    if (typeof msg !== 'string') {
        return msg;
    }

    const marker = getMarker(msg);
    const color = marker && MARKER_COLORS.get(marker);
    return color ? chalk[color](msg) : msg;
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
 * Gets the log statistics (counts of debug, warning, error and total messages)
 */
export function getStatistics() {
    return global.githubFannonSemlog.statistics;
}

/**
 * Updates the config.
 * Only those parameters that have been given will be updated. Unknown options and values of the wrong type
 * are rejected with a TypeError, in which case nothing is changed.
 *
 * @param {object} config
 * @returns {object} The updated config
 */
export function updateConfig(config) {
    for (const [key, value] of Object.entries(config)) {
        if (!(key in DEFAULT_CONFIG)) {
            throw new TypeError('Unknown semlog config option: ' + key);
        }
        if (key === 'historySize') {
            if (!Number.isInteger(value) || value < 0) {
                throw new TypeError('Config option historySize must be a non-negative integer');
            }
        } else if (typeof value !== 'boolean') {
            throw new TypeError('Config option ' + key + ' must be a boolean');
        }
    }
    Object.assign(global.githubFannonSemlog.config, config);
    return global.githubFannonSemlog.config;
}

/**
 * Clears the log history and resets the statistics
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
