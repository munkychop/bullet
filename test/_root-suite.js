'use strict';

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = chai.expect;

global.BULLET_NAMESPACE = '__bullet_pubsub__';

var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var bulletSingleton = require('../src/bullet');
var BulletClass = bulletSingleton.constructor;


beforeEach(function () {

    this.bullet = new BulletClass();
    this.testEventName = 'hello there';
    this.testCallback = function testCallback () {};
});