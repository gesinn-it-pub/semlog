import * as utils from '../utils.js';
import { expect } from 'chai';

describe('semlog utilities', function () {
    it('pad numbers', function () {
        expect(utils.pad(7, 1)).to.equal('7');
        expect(utils.pad(7, 2)).to.equal('07');
        expect(utils.pad(7, 3)).to.equal('007');
    });

    it('pretty prints numbers', function () {
        expect(utils.prettyNumber(1)).to.equal('1');
        expect(utils.prettyNumber(100000)).to.equal('100.000');
        expect(utils.prettyNumber(-100000)).to.equal('-100.000');
    });

    it('pretty prints bytes', function () {
        expect(utils.prettyBytes(500)).to.equal('500 B');
        expect(utils.prettyBytes(1024)).to.be.a('string');
        expect(utils.prettyBytes(1024)).to.equal('1.0 KiB');
        expect(utils.prettyBytes(1024, true)).to.equal('1.0 kB');
    });

    it('strips trailing slashes from URLs', function () {
        expect(utils.stripTrailingSlash('http://fannon.de/')).to.equal('http://fannon.de');
    });

    it('strips leading and ending slashes from URLs / URL paths', function () {
        expect(utils.cleanUrl('http://fannon.de/')).to.equal('http://fannon.de');
        expect(utils.cleanUrl('http://fannon.de  ')).to.equal('http://fannon.de');
        expect(utils.cleanUrl('/test/')).to.equal('test');
        expect(utils.cleanUrl('/test/ ')).to.equal('test');
        expect(utils.cleanUrl('   test/ ')).to.equal('test');
    });

    it('creates date arrays', function () {
        expect(utils.getDateArray().length).to.equal(7);
        expect(utils.getDateArray()[0]).to.equal(new Date().getFullYear());
    });

    it('return human readable date-times', function () {
        expect(utils.humanDate().length).to.equal(19);
        expect(utils.humanDate(new Date('October 13, 2014 11:13:00'))).to.equal('2014-10-13 11:13:00');
    });

    it('return machine optimized date-times', function () {
        expect(utils.roboDate().length).to.equal(19);
        expect(utils.roboDate(new Date('October 13, 2014 11:13:00'))).to.equal('2014-10-13_11-13-00');
    });

    it('return human readable time', function () {
        expect(utils.humanTime().length).to.equal(8);
        expect(utils.humanTime(new Date('October 13, 2014 11:13:00'))).to.equal('11:13:00');
    });

    it('return machine optimized time', function () {
        expect(utils.roboTime().length).to.equal(8);
        expect(utils.roboTime(new Date('October 13, 2014 11:13:00'))).to.equal('11-13-00');
    });

    it('calculates the bytesize of strings', function () {
        expect(utils.byteSize('internationalization')).to.be.a('number');
        expect(utils.byteSize('internationalization')).to.equal(20);
    });

    it('calculates the bytesize of objects (parsed to JSON)', function () {
        expect(utils.byteSize({ title: 'internationalization' })).to.be.a('number');
        expect(utils.byteSize({ title: 'internationalization' })).to.equal(32);
    });

    it('calculates the bytesize of multibyte strings', function () {
        expect(utils.byteSize('\u00F1')).to.equal(2); // 2-byte UTF-8 (ñ)
        expect(utils.byteSize('\u20AC')).to.equal(3); // 3-byte UTF-8 (€)
        expect(utils.byteSize('\uD840\uDC00')).to.equal(4); // 4-byte UTF-8 surrogate pair (𠀀)
    });
});

describe('semlog URL helpers', function () {
    it('removes repeated slashes as documented', function () {
        expect(utils.cleanUrl('//a//')).to.equal('a');
        expect(utils.cleanUrl('/a/b/')).to.equal('a/b');
        expect(utils.stripTrailingSlash('http://fannon.de//')).to.equal('http://fannon.de');
        expect(utils.stripTrailingSlash('http://fannon.de')).to.equal('http://fannon.de');
        expect(utils.stripTrailingSlash('')).to.equal('');
    });
});

describe('semlog number formatting edge cases', function () {
    it('formats bytes at unit boundaries and beyond the largest unit', function () {
        expect(utils.prettyBytes(1024 * 1023.96)).to.equal('1.0 MiB');
        expect(utils.prettyBytes(-2048)).to.equal('-2.0 KiB');
        expect(utils.prettyBytes(-5)).to.equal('-5 B');
        expect(utils.prettyBytes(1024 ** 9)).to.equal('1024.0 YiB');
    });

    it('does not group the fraction of decimal numbers', function () {
        expect(utils.prettyNumber(1234.5678)).to.equal('1.234,5678');
        expect(utils.prettyNumber(1234567)).to.equal('1.234.567');
    });
});

describe('semlog byteSize and pad edge cases', function () {
    it('handles null and undefined', function () {
        expect(utils.byteSize(null)).to.equal(4);
        expect(utils.byteSize(undefined)).to.equal(9);
    });

    it('does not truncate numbers longer than the requested digits', function () {
        expect(utils.pad(12345, 2)).to.equal('12345');
    });
});
