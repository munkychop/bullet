'use strict';

var expect = require('chai').expect;

var SRC_DIR = '../../src/';
var Bullet = require(SRC_DIR + 'bullet');

describe('Bullet', function() {

    it('should have a method named "on"', function() {
        expect(Bullet.on).to.be.a('function');
    });
});