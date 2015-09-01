'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var BULLET_MODULE_PATH = '../../src/bullet';

var expect = chai.expect;
var bulletSingleton = require(BULLET_MODULE_PATH);
var BulletClass = bulletSingleton.constructor;

chai.use(sinonChai);

describe('Bullet', function () {

    describe('Method Existence', function () {
        
        before(function () {

            this.bullet = new BulletClass();
        });

        it('should have a method named "getEventsMap"', function () {
            expect(this.bullet.getEventsMap).to.be.a('function');
        });

        it('should have a method named "on"', function () {
            expect(this.bullet.on).to.be.a('function');
        });

        it('should have a method named "off"', function () {
            expect(this.bullet.off).to.be.a('function');
        });

        it('should have a method named "once"', function () {
            expect(this.bullet.once).to.be.a('function');
        });

        it('should have a method named "trigger"', function () {
            expect(this.bullet.trigger).to.be.a('function');
        });
    });

    describe('Method Implementation', function () {

        beforeEach(function () {

            this.bullet = new BulletClass();
            this.testEventName = 'hello there';
            this.testCallback = function () {};
        });

        describe('getEventsMap()', function () {

            it('should return the public state of the internal "_events.dictionary" object', function () {

                expect(this.bullet.getEventsMap()).to.deep.equal({});

                // this.bullet.on(this.testEventName, this.testCallback);

                // var events = _bullet.getEventsMap();
                
                // expect(events[this.testEventName]).to.not.equal(undefined);
            });
        });

        describe('on()', function () {

            it('should create a mapping for the specified event name', function () {

                var eventsMap = this.bullet.getEventsMap();

                expect(eventsMap[this.testEventName]).to.be.an('undefined');

                // Add an event.
                this.bullet.on(this.testEventName, this.testCallback);

                // Get the updated events map.
                eventsMap = this.bullet.getEventsMap();

                expect(eventsMap[this.testEventName]).to.be.an('object');
                expect(eventsMap[this.testEventName].callbacks).to.be.an('object');
            });

            // TODO : It should really throw an Error here. The 'on' method needs updating.
            it('should not create a mapping if only one parameter is passed', function () {

                // The map should start empty
                expect(this.bullet.getEventsMap()).to.deep.equal({});

                // Attempt to add an event with only one param.
                this.bullet.on(this.testEventName);

                // The map should be empty
                expect(this.bullet.getEventsMap()).to.deep.equal({});
            });

            // TODO : It should really throw an Error here. The 'on' method needs updating.
            it('should not create a mapping if no parameters are passed', function () {

                // The map should start empty
                expect(this.bullet.getEventsMap()).to.deep.equal({});

                // Attempt to add an event with no params.
                this.bullet.on();

                // The map should still be empty
                expect(this.bullet.getEventsMap()).to.deep.equal({});
            });
        });

        describe('off()', function () {

            it('should remove a mapping for the specified event name', function () {

                // Create an event mapping so that we can test its removal below.
                this.bullet.on(this.testEventName, this.testCallback);

                // Get the updated events map.
                var eventsMap = this.bullet.getEventsMap();

                expect(eventsMap[this.testEventName]).to.be.an('object');
                expect(eventsMap[this.testEventName].callbacks).to.be.an('object');

                this.bullet.off(this.testEventName, this.testCallback);

                eventsMap = this.bullet.getEventsMap();

                // The map should now be empty
                expect(this.bullet.getEventsMap()).to.deep.equal({});
            });
        });
    });
});