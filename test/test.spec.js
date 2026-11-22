import * as semlog from '../index.js';
import { expect } from 'chai';
const log = semlog.log;

describe('semlog logger', function () {
    it('logs a string message to the console', function () {
        console.log('');
        console.log('-------------------------------------------------------------');
        console.log(' Testing Log Messages');
        console.log('-------------------------------------------------------------');

        log('[i] info log entry ');
        log('[W] warning log entry');
        log('[E] error log entry');
        log('[S] success log entry');
        log('[D] debug log entry');
        log('[+] added log entry');
        log('[-] removed log entry');
        log('[C] changed log entry');
        log('[TODO] todo log entry');
        log('unknown todo log entry');

        console.dir(semlog.getLogHistory());

        console.log('');
        console.log('-------------------------------------------------------------');
        console.log(' Testing Numbers and Datatypes');
        console.log('-------------------------------------------------------------');

        log(3);
        log([1, 2, 3]);
        log(true);
        log(false);
        log(null);
        log(Infinity);

        console.log('');
        console.log('-------------------------------------------------------------');
        console.log(' Testing Log Objects and Errors');
        console.log('-------------------------------------------------------------');

        // Create a new object, that prototypical inherits from the Error constructor.
        function MyError(message) {
            this.name = 'MyError';
            this.message = message || 'Default Message';
        }
        MyError.prototype = Object.create(Error.prototype);
        MyError.prototype.constructor = MyError;

        log({ title: 'Object log entry', number: 10 });
        log(new Error('error log entry'));
        log(new TypeError('error log entry'));
        log(new MyError('error log entry'));

        console.log('-------------------------------------------------------------');
        console.log('');

        expect(semlog.getLogHistory().length).to.be.least(20);
    });

    it('prints objects as colorized YAML', function () {
        semlog.updateConfig({ printYaml: true });
        log({
            text: 'text',
            number: 42,
            array: [1, '2'],
            object: {
                key: 'value',
            },
        });
        semlog.updateConfig({ printYaml: false });
    });

    it('prints objects as YAML without color when colorize is false', function () {
        semlog.updateConfig({ printYaml: true, colorize: false });
        log({ key: 'value' });
        semlog.updateConfig({ printYaml: false, colorize: true });
    });

    it('prints errors', function () {
        semlog.error(new Error('Test Error'));
    });

    it('handles various invalid log objects', function () {
        log(undefined);
        log(null);
        log(Error);
        log(Infinity);
    });

    it('suppresses verbose and debug messages when configured', function () {
        semlog.updateConfig({ printVerbose: false, printDebug: false });
        log('[V] suppressed verbose');
        log('[D] suppressed debug');
        semlog.updateConfig({ printVerbose: true, printDebug: true });
    });

    it('returns the log history as an array', function () {
        const logArchive = semlog.getLogHistory();

        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.be.least(1);
    });

    it('clears global log object', function () {
        semlog.clearLogHistory();
        const logArchive = semlog.getLogHistory();

        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.equal(0);
    });

    it('logs silently', function () {
        semlog.log(' [i] info log entry ', true);
        semlog.log(' [W] warning log entry', true);
        semlog.log(' [E] error log entry', true);

        const logArchive = semlog.getLogHistory();

        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.equal(3);
    });

    it('gets config', function () {
        const config = semlog.getConfig();

        expect(config).to.be.instanceof(Object);
        expect(Object.keys(config).length).to.be.least(3);
    });

    it('updates the config', function () {
        const config = semlog.getConfig();
        const newConfig = semlog.updateConfig({ printTime: false });

        expect(newConfig).to.be.instanceof(Object);
        expect(newConfig.printTime).to.equal(false);
        expect(newConfig.historySize).to.equal(config.historySize);
    });

    it('keeps the log object at a specific size', function () {
        const historySize = 7;
        const newConfig = semlog.updateConfig({ historySize: historySize, logDateTime: true });

        for (let i = 0; i < 32; i++) {
            log('[i] Index added: ' + i, true);
        }

        const logHistory = semlog.getLogHistory();
        expect(newConfig.historySize).to.equal(logHistory.length);
        expect(logHistory.length).to.equal(historySize);
    });

    it('handles circular objects in history gracefully', function () {
        const circular = {};
        circular.self = circular;
        semlog.addToHistory(circular);
        const history = semlog.getLogHistory();
        expect(history[history.length - 1]).to.include('[W]');
    });

    it('returns the log archive as non circular array', function () {
        log(semlog.getLogHistory());
        const logHistory = semlog.getLogHistory();

        expect(JSON.stringify(logHistory)).to.be.a('string');
    });

    it('returns log statistics', function () {
        log(semlog.getStatistics());
        const statistics = semlog.getStatistics();

        expect(statistics.total).to.be.a('number');
    });
});

describe('semlog utilities', function () {
    it('pad numbers', function () {
        expect(semlog.pad(7, 1)).to.equal('7');
        expect(semlog.pad(7, 2)).to.equal('07');
        expect(semlog.pad(7, 3)).to.equal('007');
    });

    it('pretty prints numbers', function () {
        expect(semlog.prettyNumber(1)).to.equal('1');
        expect(semlog.prettyNumber(100000)).to.equal('100.000');
        expect(semlog.prettyNumber(-100000)).to.equal('-100.000');
    });

    it('pretty prints bytes', function () {
        expect(semlog.prettyBytes(500)).to.equal('500 B');
        expect(semlog.prettyBytes(1024)).to.be.a('string');
        expect(semlog.prettyBytes(1024)).to.equal('1.0 KiB');
        expect(semlog.prettyBytes(1024, true)).to.equal('1.0 kB');
    });

    it('strips trailing slashes from URLs', function () {
        expect(semlog.stripTrailingSlash('http://fannon.de/')).to.equal('http://fannon.de');
    });

    it('strips leading and ending slashes from URLs / URL paths', function () {
        expect(semlog.cleanUrl('http://fannon.de/')).to.equal('http://fannon.de');
        expect(semlog.cleanUrl('http://fannon.de  ')).to.equal('http://fannon.de');
        expect(semlog.cleanUrl('/test/')).to.equal('test');
        expect(semlog.cleanUrl('/test/ ')).to.equal('test');
        expect(semlog.cleanUrl('   test/ ')).to.equal('test');
    });

    it('creates date arrays', function () {
        expect(semlog.getDateArray().length).to.equal(7);
        expect(semlog.getDateArray()[0]).to.equal(new Date().getFullYear());
    });

    it('return human readable date-times', function () {
        expect(semlog.humanDate().length).to.equal(19);
        expect(semlog.humanDate(new Date('October 13, 2014 11:13:00'))).to.equal('2014-10-13 11:13:00');
    });

    it('return machine optimized date-times', function () {
        expect(semlog.roboDate().length).to.equal(19);
        expect(semlog.roboDate(new Date('October 13, 2014 11:13:00'))).to.equal('2014-10-13_11-13-00');
    });

    it('return human readable time', function () {
        expect(semlog.humanTime().length).to.equal(8);
        expect(semlog.humanTime(new Date('October 13, 2014 11:13:00'))).to.equal('11:13:00');
    });

    it('return machine optimized time', function () {
        expect(semlog.roboTime().length).to.equal(8);
        expect(semlog.roboTime(new Date('October 13, 2014 11:13:00'))).to.equal('11-13-00');
    });

    it('calculates the bytesize of strings', function () {
        expect(semlog.byteSize('internationalization')).to.be.a('number');
        expect(semlog.byteSize('internationalization')).to.equal(20);
    });

    it('calculates the bytesize of objects (parsed to JSON)', function () {
        expect(semlog.byteSize({ title: 'internationalization' })).to.be.a('number');
        expect(semlog.byteSize({ title: 'internationalization' })).to.equal(32);
    });

    it('calculates the bytesize of multibyte strings', function () {
        expect(semlog.byteSize('\u00F1')).to.equal(2); // 2-byte UTF-8 (ñ)
        expect(semlog.byteSize('\u20AC')).to.equal(3); // 3-byte UTF-8 (€)
        expect(semlog.byteSize('\uD840\uDC00')).to.equal(4); // 4-byte UTF-8 surrogate pair (𠀀)
    });
});

describe('semlog history', function () {
    let originalConfig;

    beforeEach(function () {
        originalConfig = { ...semlog.getConfig() };
        semlog.clearLogHistory();
    });

    afterEach(function () {
        semlog.updateConfig(originalConfig);
        semlog.clearLogHistory();
    });

    it('stores nothing when historySize is 0', function () {
        semlog.updateConfig({ historySize: 0 });
        log('[i] first', true);
        log({ a: 1 }, true);
        expect(semlog.getLogHistory()).to.have.length(0);
    });

    it('shrinks the history when historySize is lowered', function () {
        semlog.updateConfig({ historySize: 10 });
        for (let i = 0; i < 10; i++) {
            log('[i] entry ' + i, true);
        }
        semlog.updateConfig({ historySize: 3 });
        log('[i] entry 10', true);
        const history = semlog.getLogHistory();
        expect(history).to.have.length(3);
        expect(history[2]).to.include('entry 10');
    });

    it('stores strings without JSON quotes', function () {
        semlog.updateConfig({ logDateTime: false });
        log('[i] plain', true);
        expect(semlog.getLogHistory()).to.deep.equal(['[i] plain']);
    });

    it('stores error details and undefined values', function () {
        semlog.updateConfig({ logDateTime: false });
        semlog.addToHistory(new Error('boom'));
        semlog.addToHistory(undefined);
        const history = semlog.getLogHistory();
        expect(history[0]).to.include('boom');
        expect(history[1]).to.equal('undefined');
    });

    it('keeps references valid when clearing history and statistics', function () {
        const history = semlog.getLogHistory();
        const statistics = semlog.getStatistics();
        log('[E] something', true);
        expect(statistics.error).to.equal(1);
        semlog.clearLogHistory();
        expect(history).to.have.length(0);
        expect(statistics.error).to.equal(0);
        expect(semlog.getLogHistory()).to.equal(history);
        expect(semlog.getStatistics()).to.equal(statistics);
    });
});

describe('semlog console output', function () {
    let originalConfig;
    let out;
    let errOut;
    let origLog;
    let origError;

    beforeEach(function () {
        originalConfig = { ...semlog.getConfig() };
        semlog.updateConfig({ colorize: false, printTime: false, printDateTime: false });
        semlog.clearLogHistory();
        out = [];
        errOut = [];
        origLog = console.log;
        origError = console.error;
        console.log = (...args) => out.push(args.join(' '));
        console.error = (...args) => errOut.push(args.join(' '));
    });

    afterEach(function () {
        console.log = origLog;
        console.error = origError;
        semlog.updateConfig(originalConfig);
        semlog.clearLogHistory();
    });

    it('does not throw when debugging circular objects', function () {
        const circular = {};
        circular.self = circular;
        expect(() => semlog.debug(circular)).to.not.throw();
        expect(out).to.have.length(1);
        expect(() => {
            semlog.updateConfig({ printYaml: true });
            semlog.debug(circular);
        }).to.not.throw();
    });

    it('does not throw when debugging BigInt values', function () {
        expect(() => semlog.debug({ n: 1n })).to.not.throw();
    });

    it('does not throw for non-Error values passed to error()', function () {
        expect(() => semlog.error(null)).to.not.throw();
        expect(() => semlog.error(undefined)).to.not.throw();
        semlog.error('plain text');
        expect(errOut.join('\n')).to.include('[E] plain text');
        const circular = {};
        circular.self = circular;
        expect(() => semlog.error(circular)).to.not.throw();
    });

    it('prints errors with message and stack to stderr only', function () {
        semlog.error(new Error('boom'));
        expect(out).to.have.length(0);
        expect(errOut[0]).to.equal('[E] boom');
        expect(errOut.join('\n')).to.include('Error: boom');
        expect(errOut.join('\n')).to.not.include('{}');
    });

    it('prints additional error properties', function () {
        const err = new Error('boom');
        err.code = 'E_TEST';
        semlog.error(err);
        expect(errOut.join('\n')).to.include('E_TEST');
    });

    it('suppresses debug objects when printDebug is false', function () {
        semlog.updateConfig({ printDebug: false });
        log({ a: 1 });
        expect(out).to.have.length(0);
        expect(semlog.getLogHistory()).to.have.length(1);
    });

    it('counts debug() calls in the statistics', function () {
        log({ a: 1 }, true);
        expect(semlog.getStatistics().debug).to.equal(1);
    });

    it('suppresses verbose and debug strings without printing', function () {
        semlog.updateConfig({ printVerbose: false, printDebug: false });
        log('[V] verbose');
        log('[D] debug');
        expect(out).to.have.length(0);
        expect(semlog.getLogHistory()).to.have.length(2);
        expect(semlog.getStatistics().debug).to.equal(2);
    });

    it('derives statistics from the stringified message', function () {
        log('[i] ok', true);
        semlog.message(['[E]'], true);
        expect(semlog.getStatistics().error).to.equal(1);
        expect(semlog.getStatistics().total).to.equal(2);
    });

    it('colors by indicator and leaves unknown messages untouched', function () {
        expect(semlog.colorize('plain')).to.equal('plain');
        expect(semlog.colorize(5)).to.equal(5);
        expect(semlog.colorize('[E] x')).to.include('[E] x');
    });

    it('prefixes messages with the time unless disabled', function () {
        semlog.updateConfig({ printTime: true });
        log('[i] timed');
        expect(out[0]).to.match(/^\[\d\d:\d\d:\d\d\] \[i\] timed$/);
    });
});

describe('semlog shared state', function () {
    it('fills missing config options when state from another copy exists', async function () {
        const original = global.githubFannonSemlog;
        try {
            global.githubFannonSemlog = {
                history: [],
                config: { silent: true, colorize: false },
                statistics: { debug: 0, warning: 0, error: 0, total: 0 },
            };
            const fresh = await import('../index.js?shared-state');
            const config = fresh.getConfig();
            expect(config.silent).to.equal(true);
            expect(config.colorize).to.equal(false);
            expect(config.historySize).to.equal(2048);
            expect(config.printDebug).to.equal(true);
        } finally {
            global.githubFannonSemlog = original;
        }
    });
});

describe('semlog URL helpers', function () {
    it('removes repeated slashes as documented', function () {
        expect(semlog.cleanUrl('//a//')).to.equal('a');
        expect(semlog.cleanUrl('/a/b/')).to.equal('a/b');
        expect(semlog.stripTrailingSlash('http://fannon.de//')).to.equal('http://fannon.de');
        expect(semlog.stripTrailingSlash('http://fannon.de')).to.equal('http://fannon.de');
        expect(semlog.stripTrailingSlash('')).to.equal('');
    });
});

describe('semlog number formatting edge cases', function () {
    it('formats bytes at unit boundaries and beyond the largest unit', function () {
        expect(semlog.prettyBytes(1024 * 1023.96)).to.equal('1.0 MiB');
        expect(semlog.prettyBytes(-2048)).to.equal('-2.0 KiB');
        expect(semlog.prettyBytes(-5)).to.equal('-5 B');
        expect(semlog.prettyBytes(1024 ** 9)).to.equal('1024.0 YiB');
    });

    it('does not group the fraction of decimal numbers', function () {
        expect(semlog.prettyNumber(1234.5678)).to.equal('1.234,5678');
        expect(semlog.prettyNumber(1234567)).to.equal('1.234.567');
    });
});

describe('semlog byteSize and pad edge cases', function () {
    it('handles null and undefined', function () {
        expect(semlog.byteSize(null)).to.equal(4);
        expect(semlog.byteSize(undefined)).to.equal(9);
    });

    it('does not truncate numbers longer than the requested digits', function () {
        expect(semlog.pad(12345, 2)).to.equal('12345');
    });
});
