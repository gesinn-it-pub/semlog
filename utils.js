/**
 * semlog utilities
 * Formatting helpers for numbers, bytes, URLs and dates
 *
 * @author Simon Heimler
 */

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
    return String(number).padStart(digits, '0');
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
 * @param {*} obj
 * @returns {number}
 */
export function byteSize(obj) {
    const str = typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
    return Buffer.byteLength(str, 'utf8');
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
