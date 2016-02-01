'use strict';

/*global describe, it*/

var semlog = require('../');
var log = semlog.log;
var expect = require('chai').expect;

describe('semlog logger', function() {

    it('logs a string message to the console', function() {

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

        // Create a new object, that prototypally inherits from the Error constructor.
        function MyError(message) {
            this.name = 'MyError';
            this.message = message || 'Default Message';
        }
        MyError.prototype = Object.create(Error.prototype);
        MyError.prototype.constructor = MyError;

        log({title: 'Object log entry', number: 10});
        log(new Error('error log entry'));
        log(new TypeError('error log entry'));
        log(new MyError('error log entry'));

        console.log('-------------------------------------------------------------');
        console.log('');
    });

    it('prints objects as colorized YAML', function() {
        semlog.updateConfig({printYaml: true});
        log({
            text: 'text',
            number: 42,
            array: [1, '2'],
            object: {
                key: 'value'
            }
        });
        semlog.updateConfig({printYaml: false});
    });

    it('prints errors', function() {
        semlog.error(new Error('Test Error'));
    });

    it('handles various invalid log objects', function() {
        log(undefined);
        log(null);
        log(Error);
        log(Infinity);
    });

    it('returns the log history as an array', function() {
        var logArchive = semlog.getLogHistory();

        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.be.least(1);
    });

    it('clears global log object', function() {
        semlog.clearLogHistory();
        var logArchive = semlog.getLogHistory();

        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.equal(0);
    });

    it('logs silently', function() {
        semlog.log(' [i] info log entry ', true);
        semlog.log(' [W] warning log entry', true);
        semlog.log(' [E] error log entry', true);

        var logArchive = semlog.getLogHistory();

        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.equal(3);
    });

    it('gets config', function() {
        var config = semlog.getConfig();

        expect(config).to.be.instanceof(Object);
        expect(Object.keys(config).length).to.be.least(3);
    });

    it('updates the config', function() {

        var config = semlog.getConfig();
        var newConfig = semlog.updateConfig({printTime: false});

        expect(newConfig).to.be.instanceof(Object);
        expect(newConfig.printTime).to.equal(false);
        expect(newConfig.historySize).to.equal(config.historySize);
    });

    it('keeps the log object at a specific size', function() {

        var historySize = 7;
        var newConfig = semlog.updateConfig({historySize: historySize, logDateTime: true});

        for (var i = 0; i < 32; i++) {
            log('[i] Index added: ' + i, true);
        }

        var logHistory = semlog.getLogHistory();
        expect(newConfig.historySize).to.equal(logHistory.length);
        expect(logHistory.length).to.equal(historySize);
    });

    it('returns the log archive as non circular array', function() {

        log(semlog.getLogHistory());
        var logHistory = semlog.getLogHistory();

        expect(JSON.stringify(logHistory)).to.be.a('string');

    });

    it('returns log statistics', function() {

        log(semlog.getStatistics());
        var statistics = semlog.getStatistics();

        expect(statistics.total).to.be.a('number');

    });

});

describe('semlog utilities', function() {

    it('pad numbers', function() {
        expect(semlog.pad(7, 1)).to.equal('7');
        expect(semlog.pad(7, 2)).to.equal('07');
        expect(semlog.pad(7, 3)).to.equal('007');
    });

    it('pretty prints numbers', function() {
        expect(semlog.prettyNumber(1)).to.equal('1');
        expect(semlog.prettyNumber(100000)).to.equal('100.000');
        expect(semlog.prettyNumber(-100000)).to.equal('-100.000');
    });

    it('pretty prints bytes', function() {
        expect(semlog.prettyBytes(1024)).to.be.a('string');
        expect(semlog.prettyBytes(1024)).to.equal('1.0 KiB');
        expect(semlog.prettyBytes(1024, true)).to.equal('1.0 kB');
    });

    it('strips trailing slashes from URLs', function() {
        expect(semlog.stripTrailingSlash('http://fannon.de/')).to.equal('http://fannon.de');
    });

    it('strips leading and ending slashes from URLs / URL paths', function() {
        expect(semlog.cleanUrl('http://fannon.de/')).to.equal('http://fannon.de');
        expect(semlog.cleanUrl('http://fannon.de  ')).to.equal('http://fannon.de');
        expect(semlog.cleanUrl('/test/')).to.equal('test');
        expect(semlog.cleanUrl('/test/ ')).to.equal('test');
        expect(semlog.cleanUrl('   test/ ')).to.equal('test');
    });

    it('creates date arrays', function() {
        expect(semlog.getDateArray().length).to.equal(7);
        expect(semlog.getDateArray()[0]).to.equal(new Date().getFullYear());
    });

    it('return human readable date-times', function() {
        expect(semlog.humanDate().length).to.equal(19);
        expect(semlog.humanDate(new Date('October 13, 2014 11:13:00'))).to.equal('2014-10-13 11:13:00');
    });

    it('return machine optimized date-times', function() {
        expect(semlog.roboDate().length).to.equal(19);
        expect(semlog.roboDate(new Date('October 13, 2014 11:13:00'))).to.equal('2014-10-13_11-13-00');
    });

    it('return human readable time', function() {
        expect(semlog.humanTime().length).to.equal(8);
        expect(semlog.humanTime(new Date('October 13, 2014 11:13:00'))).to.equal('11:13:00');
    });

    it('return machine optimized time', function() {
        expect(semlog.roboTime().length).to.equal(8);
        expect(semlog.roboTime(new Date('October 13, 2014 11:13:00'))).to.equal('11-13-00');
    });

    it('calculates the bytesize of strings', function() {
        expect(semlog.byteSize('internationalization')).to.be.a('number');
        expect(semlog.byteSize('internationalization')).to.equal(20);
    });

    it('calculates the bytesize of objects (parsed to JSON)', function() {
        expect(semlog.byteSize({title: 'internationalization'})).to.be.a('number');
        expect(semlog.byteSize({title: 'internationalization'})).to.equal(32);
    });


});
