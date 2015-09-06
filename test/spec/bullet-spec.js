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

        it('should have a private method named "_getMappings"', function () {
            expect(this.bullet._getMappings).to.be.a('function');
        });

        it('should have a public method named "on"', function () {
            expect(this.bullet.on).to.be.a('function');
        });

        it('should have a public method named "off"', function () {
            expect(this.bullet.off).to.be.a('function');
        });

        it('should have a public method named "trigger"', function () {
            expect(this.bullet.trigger).to.be.a('function');
        });

        it('should have a public method named "once"', function () {
            expect(this.bullet.once).to.be.a('function');
        });

        it('should have a public method named "addEvent"', function () {
            expect(this.bullet.addEvent).to.be.a('function');
        });

        it('should have a public method named "removeEvent"', function () {
            expect(this.bullet.removeEvent).to.be.a('function');
        });
    });

    describe('Method Implementation', function () {

        beforeEach(function () {

            this.bullet = new BulletClass();
            this.testEventName = 'hello there';
            this.testCallback = function testCallback () {};
        });

        describe('_getMappings()', function () {

            it('should return the public state of the internal "_mappings" object', function () {

                var mappings = this.bullet._getMappings();
                expect(mappings).to.deep.equal({});

                // Add a property to the returned mappings object.
                mappings.foo = 'bar';

                // Get the updated events map.
                mappings = this.bullet._getMappings();
                
                // Bullet's internal mappings should not have been modified.
                expect(mappings).to.deep.equal({});
            });
        });

        describe('on()', function () {

            it('should create a mapping for the specified event name', function () {

                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('undefined');

                // Add an event.
                this.bullet.on(this.testEventName, this.testCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks).to.be.an('object');

                var testCallbackString = this.testCallback.toString();

                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('object');
            });

            // TODO : It should really throw an Error here. The 'on' method needs updating.
            it('should not create a mapping if only one parameter is passed', function () {

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                // Attempt to add an event with only one param.
                this.bullet.on(this.testEventName);

                // The map should be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            // TODO : It should really throw an Error here. The 'on' method needs updating.
            it('should not create a mapping if no parameters are passed', function () {

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                // Attempt to add an event with no params.
                this.bullet.on();

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });
        });

        describe('off()', function () {

            before(function () {

                this.someOtherEventName = 'toto';
                this.someOtherCallback = function someOtherCallback () {};
            });

            it('should remove a mapping only for the specified event name and function', function () {

                // Create multiple event mappings so that we can test the removal of a single mapping.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, this.someOtherCallback);

                var testCallbackString = this.testCallback.toString();
                var someOtherCallbackString = this.someOtherCallback.toString();

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[someOtherCallbackString]).to.be.an('object');

                // Remove the mapping to this.testCallback
                this.bullet.off(this.testEventName, this.testCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('undefined');
                expect(mappings[this.testEventName].callbacks[someOtherCallbackString]).to.be.an('object');

                // Remove the mapping to this.someOtherCallback
                this.bullet.off(this.testEventName, this.someOtherCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                // The map should be empty, now that all event mappings have been removed.
                expect(mappings).to.deep.equal({});
            });

            it('should remove all mappings for the specified event name', function () {

                // Create multiple event mappings so that we can test the removal of all mappings
                // for a specific event name.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, this.someOtherCallback);
                this.bullet.on(this.someOtherEventName, this.testCallback);
                this.bullet.on(this.someOtherEventName, this.someOtherCallback);

                var testCallbackString = this.testCallback.toString();
                var someOtherCallbackString = this.someOtherCallback.toString();

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[someOtherCallbackString]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[testCallbackString]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[someOtherCallbackString]).to.be.an('object');

                // Remove all mappings for this.testEventName
                this.bullet.off(this.testEventName);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('undefined');
                expect(mappings[this.someOtherEventName].callbacks[testCallbackString]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[someOtherCallbackString]).to.be.an('object');

                // Remove all mappings for this.someOtherEventName
                this.bullet.off(this.someOtherEventName);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.someOtherEventName]).to.be.an('undefined');
            });
        });

        describe('trigger()', function () {

            afterEach(function () {

                sinon.restore(this.testCallback);
            });

            it('should trigger a mapped callback', function () {

                sinon.spy(this, 'testCallback');

                // Create an event mapping so that we can test that it gets triggered below.
                this.bullet.on(this.testEventName, this.testCallback);

                // Trigger the event.
                this.bullet.trigger(this.testEventName);

                expect(this.testCallback.calledOnce).to.equal(true);
            });

            it('should trigger a mapped callback with data', function () {

                var testData = {hello : 'sunshine'};
                
                sinon.spy(this, 'testCallback');

                // Create an event mapping so that we can test that it gets triggered below.
                this.bullet.on(this.testEventName, this.testCallback);

                // Trigger the event with data.
                this.bullet.trigger(this.testEventName, testData);

                expect(this.testCallback).to.have.been.calledWith(testData);

            });
        });

        describe('once()', function () {

            it('should create a one-time mapping for the specified event name', function () {

                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('undefined');

                // Add a one-time event.
                this.bullet.once(this.testEventName, this.testCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks).to.be.an('object');

                // Trigger the event.
                this.bullet.trigger(this.testEventName);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                // The event mapping should have been deleted, as it was triggered once.
                expect(mappings[this.testEventName]).to.be.an('undefined');
            });

            // TODO : It should really throw an Error here. The 'on' method needs updating.
            it('should not create a mapping if only one parameter is passed', function () {

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                // Attempt to add an event with only one param.
                this.bullet.once(this.testEventName);

                // The map should be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            // TODO : It should really throw an Error here. The 'on' method needs updating.
            it('should not create a mapping if no parameters are passed', function () {

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                // Attempt to add an event with no params.
                this.bullet.once();

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });
        });

        describe('getEvents()', function () {

            it('should return the current state of the internal "_strictEvents" object', function () {

                var events = this.bullet.getEvents();
                
                // The map should start empty
                expect(events).to.deep.equal({});

                // Add a property to the returned events object.
                events.foo = 'bar';

                // Get the updated events map.
                events = this.bullet.getEvents();
                
                // Bullet's internal events object should not have been modified.
                expect(events).to.deep.equal({});
            });
        });
        
        describe('addEvent()', function () {

            it('should add an event to the internal "_strictEvents" object', function () {

                var events = this.bullet.getEvents();
                
                // The map should start empty
                expect(events).to.deep.equal({});

                // Add an event.
                this.bullet.addEvent('foo');

                // Get the updated events map.
                events = this.bullet.getEvents();
                
                // Bullet's internal _events should not have been modified.
                expect(events).to.deep.equal({foo : 'foo'});

                // Add another event.
                this.bullet.addEvent('bar');

                // Get the updated events map.
                events = this.bullet.getEvents();
                
                // Bullet's internal _events should not have been modified.
                expect(events).to.deep.equal({foo : 'foo', bar : 'bar'});
            });

            it('should throw a TypeError if the passed parameter is not a string', function () {

                var self = this;

                function callAddEvent() {
                    self.bullet.addEvent({hello : 'hi'});
                }

                expect(callAddEvent).to.throw(TypeError);
            });

            it('should throw an Error if the passed string parameter length is 0', function () {

                var self = this;

                function callAddEvent() {
                    self.bullet.addEvent('');
                }

                expect(callAddEvent).to.throw(Error);
            });
        });

        describe('removeEvent()', function () {

            it('should remove an event from the internal "_strictEvents" object', function () {

                var events = this.bullet.getEvents();
                
                // Add multiple events so that we can test the removal of a single event.
                this.bullet.addEvent('foo');
                this.bullet.addEvent('bar');
                this.bullet.addEvent('baz');

                // Get the updated events map.
                events = this.bullet.getEvents();
                
                expect(events).to.deep.equal({foo : 'foo', bar : 'bar', baz : 'baz'});

                // Remove one of the events.
                this.bullet.removeEvent('bar');

                // Get the updated events map.
                events = this.bullet.getEvents();

                expect(events).to.deep.equal({foo : 'foo', baz : 'baz'});
                
                // Remove the remaining events.
                this.bullet.removeEvent('foo');
                this.bullet.removeEvent('baz');

                // Get the updated events map.
                events = this.bullet.getEvents();

                // The map should start empty
                expect(events).to.deep.equal({});
            });
        
            it('should throw a TypeError if the passed parameter is not a string', function () {

                var self = this;

                function callRemoveEvent() {
                    self.bullet.removeEvent({hello : 'hi'});
                }

                expect(callRemoveEvent).to.throw(TypeError);
            });

            it('should throw an Error if the passed string parameter length is 0', function () {

                var self = this;

                function callRemoveEvent() {
                    self.bullet.removeEvent('');
                }

                expect(callRemoveEvent).to.throw(Error);
            });
        });
    });
});