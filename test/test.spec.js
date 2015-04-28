'use strict';

var semlog = require('../');
var expect = require('chai').expect;

describe('semlog logger', function() {

    it('clears global log object', function() {
        expect(semlog.clearLogHistory()).to.be.instanceof(Array);
    });

    it('logs a string message to the console', function() {
        semlog.log(new Error('error log entry'), true);
        semlog.log({title: 'Object log entry'}, true);
        semlog.log(' [i] info log entry ', true);
        semlog.log(' [W] warning log entry', true);
        semlog.log(' [E] error log entry', true);
        semlog.log(' [S] success log entry', true);
        semlog.log(' [D] debug log entry', true);
        semlog.log(' [+] added log entry', true);
        semlog.log(' [-] removed log entry', true);
        semlog.log(' [C] changed log entry', true);
        semlog.log(' [TODO] todo log entry', true);
    });

    it('returns the log history as an array', function() {
        var logArchive = semlog.getLogHistory();
        expect(logArchive).to.be.instanceof(Array);
        expect(logArchive.length).to.be.least(1);
    });
});

describe('semlog utilities', function() {

    it('pad numbers', function() {
        expect(semlog.pad(7, 1)).to.equal('7');
        expect(semlog.pad(7, 2)).to.equal('07');
        expect(semlog.pad(7, 3)).to.equal('007');
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

});
