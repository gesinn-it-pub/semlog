'use strict';

var semlog = require('../');
var log = semlog.log;
var expect = require('chai').expect;

describe('semlog logger', function() {

    it('logs a string message to the console', function() {

        console.log('');
        console.log('-------------------------------------------------------------');
        console.log(' Starting log message test');
        console.log('-------------------------------------------------------------');

        log(new Error('error log entry'));
        log({title: 'Object log entry', number: 10});
        log(' [i] info log entry ');
        log(' [W] warning log entry');
        log(' [E] error log entry');
        log(' [S] success log entry');
        log(' [D] debug log entry');
        log(' [+] added log entry');
        log(' [-] removed log entry');
        log(' [C] changed log entry');
        log(' [TODO] todo log entry');
        log(' unknown todo log entry');

        console.log('-------------------------------------------------------------');
        console.log('');
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
        var newConfig = semlog.updateConfig({date: false});

        expect(newConfig).to.be.instanceof(Object);
        expect(newConfig.date).to.equal(false);
        expect(newConfig.historySize).to.equal(config.historySize);
    });

    it('keeps the log object at a specific size', function() {

        var historySize = 7;
        var newConfig = semlog.updateConfig({historySize: historySize});

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
        expect(semlog.prettyBytes(1024)).to.be.a.string;
        expect(semlog.prettyBytes(1024)).to.equal('1.0 KiB');
    });

    it('strip trailing slashes from URLs', function() {
        expect(semlog.stripTrailingSlash('http://fannon.de/')).to.equal('http://fannon.de');
    });

    it('creates date arrays', function() {
        expect(semlog.getDateArray().length).to.equal(7);
        expect(semlog.getDateArray()[0]).to.equal(new Date().getFullYear());
    });

    it('return human readable date-times', function() {
        expect(semlog.humanDate().length).to.equal(19);
    });

    it('return machine optimized date-times', function() {
        expect(semlog.roboDate().length).to.equal(19);
    });

    it('calculates the bytesize of strings', function() {
        expect(semlog.byteSize('internationalization')).to.be.a.number;
        expect(semlog.byteSize('internationalization')).to.equal(20);
    });

    it('calculates the bytesize of objects (parsed to JSON)', function() {
        expect(semlog.byteSize({title: 'internationalization'})).to.be.a.number;
        expect(semlog.byteSize({title: 'internationalization'})).to.equal(32);
    });



});
