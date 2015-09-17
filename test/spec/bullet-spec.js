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

    describe('Custom Error Existence', function () {
        
        before(function () {

            this.bullet = new BulletClass();
        });

        it('should have custom error type "ParamCountError"', function () {
            expect(this.bullet._errors.ParamCountError).to.be.a('function');
        });

        it('should have custom error type "ParamTypeError"', function () {
            expect(this.bullet._errors.ParamTypeError).to.be.a('function');
        });

        it('should have custom error type "EventNameLengthError"', function () {
            expect(this.bullet._errors.EventNameLengthError).to.be.a('function');
        });

        it('should have custom error type "UndeclaredEventError"', function () {
            expect(this.bullet._errors.UndeclaredEventError).to.be.a('function');
        });

        it('should have custom error type "UnmappedEventError"', function () {
            expect(this.bullet._errors.UnmappedEventError).to.be.a('function');
        });
    });

    describe('Property Existence', function () {
        
        before(function () {

            this.bullet = new BulletClass();
        });

        it('should have a public property named "events"', function () {
            expect(this.bullet.events).to.be.an('object');
        });
    });

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

        it('should have a public method named "updateEventMapping"', function () {
            expect(this.bullet.updateEventMapping).to.be.a('function');
        });

        it('should have a public method named "replaceEventMappings"', function () {
            expect(this.bullet.replaceEventMappings).to.be.a('function');
        });

        it('should have a public method named "trigger"', function () {
            expect(this.bullet.trigger).to.be.a('function');
        });

        it('should have a public method named "once"', function () {
            expect(this.bullet.once).to.be.a('function');
        });

        it('should have a public method named "addEventName"', function () {
            expect(this.bullet.addEventName).to.be.a('function');
        });

        it('should have a public method named "removeEventName"', function () {
            expect(this.bullet.removeEventName).to.be.a('function');
        });

        it('should have a public method named "getStrictMode"', function () {
            expect(this.bullet.getStrictMode).to.be.a('function');
        });

        it('should have a public method named "setStrictMode"', function () {
            expect(this.bullet.setStrictMode).to.be.a('function');
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
        }); // [_getMappings]

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

            it('should throw a ParamTypeError if the event name param is not a string', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event with a non-string event name parameter.
                    self.bullet.on({}, self.testCallback);
                }

                expect(callOn).to.throw(this.bullet._errors.ParamTypeError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event with an empty string as the event name parameter.
                    self.bullet.on('', self.testCallback);
                }

                expect(callOn).to.throw(this.bullet._errors.EventNameLengthError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw a ParamTypeError if the callback parameter is not a function', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event with a non-function as the callback parameter.
                    self.bullet.on(self.testEventName, {});
                }

                expect(callOn).to.throw(this.bullet._errors.ParamTypeError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw a ParamCountError if only one parameter is passed', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event with only one parameter.
                    self.bullet.on(self.testEventName);
                }

                expect(callOn).to.throw(this.bullet._errors.ParamCountError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw a ParamCountError if no parameters are passed', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event with no params.
                    self.bullet.on();
                }

                expect(callOn).to.throw(this.bullet._errors.ParamCountError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw a ParamCountError if more than three parameters are passed', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event with more than three params.
                    self.bullet.on(self.testEventName, self.testCallback, true, 123);
                }

                expect(callOn).to.throw(this.bullet._errors.ParamCountError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });
        }); // [on]

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

            it('should remove all mappings when no params are passed', function () {

                // Create multiple event mappings so that we can test the removal of all mappings.
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

                // Remove all mappings.
                this.bullet.off();

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings).to.deep.equal({});
            });

            it('should throw an ParamTypeError if the event name param is not a string', function () {

                var self = this;

                function callOff () {

                    // Attempt to unmap an event with a non-string event name parameter.
                    self.bullet.off({}, self.testCallback);
                }

                expect(callOff).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                function callOff () {

                    // Attempt to unmap an event with an empty string as the event name parameter.
                    self.bullet.off('', self.testCallback);
                }

                expect(callOff).to.throw(this.bullet._errors.EventNameLengthError);
            });

            it('should throw a ParamTypeError if the callback parameter is not a function', function () {

                var self = this;

                // Map an event via the 'on' method so that we can attempt to remove it below.
                this.bullet.on(this.testEventName, this.testCallback);

                function callOff () {

                    // Attempt to unmap an event with a non-function as the callback parameter.
                    self.bullet.off(self.testEventName, {});
                }

                expect(callOff).to.throw(this.bullet._errors.ParamTypeError);
            });
        }); // [off]

        describe('updateEventMapping()', function () {

            before(function () {

                this.someOtherCallback = function someOtherCallback () {};
            });

            it('should throw a ParamTypeError if the event name param is not a string', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callUpdateEventMapping () {

                    // Attempt to update a function mapped to an event name by using a non-string event name parameter.
                    self.bullet.updateEventMapping({}, self.testCallback, self.someOtherCallback);
                }

                expect(callUpdateEventMapping).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callUpdateEventMapping () {

                    // Attempt to update a function mapped to an event name by using an empty string for the event name parameter.
                    self.bullet.updateEventMapping('', self.testCallback, self.someOtherCallback);
                }

                expect(callUpdateEventMapping).to.throw(this.bullet._errors.EventNameLengthError);
            });
            
            it('should throw a ParamTypeError if the old callback param is not a function', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callUpdateEventMapping () {

                    // Attempt to update a function mapped to an event name by using a non-function for the old callback parameter.
                    self.bullet.updateEventMapping(self.testEventName, {}, self.someOtherCallback);
                }

                expect(callUpdateEventMapping).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw a ParamTypeError if the new callback param is not a function', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callUpdateEventMapping () {

                    // Attempt to update a function mapped to an event name by using a non-function for the new callback parameter.
                    self.bullet.updateEventMapping(self.testEventName, self.testCallback, {});
                }

                expect(callUpdateEventMapping).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw a ParamTypeError if the ‘once’ param is defined but not a boolean', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callUpdateEventMapping () {

                    // Attempt to update a function mapped to an event name by using a non-boolean for the 'once' parameter.
                    self.bullet.updateEventMapping(self.testEventName, self.testCallback, self.someOtherCallback, {});
                }

                expect(callUpdateEventMapping).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an UnmappedEventError if the specified event name does not exist within the mappings object', function () {

                var self = this;

                function callUpdateEventMapping () {

                    // Attempt to update a function that is not mapped to any event name.
                    self.bullet.updateEventMapping('someRandomEventName', self.testCallback, self.someOtherCallback);
                }

                expect(callUpdateEventMapping).to.throw(this.bullet._errors.UnmappedEventError);
            });

            it('should update a single mapped function for the specified event name', function () {

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                var testCallbackString = this.testCallback.toString();
                var someOtherCallbackString = this.someOtherCallback.toString();

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('object');

                // Replace the 'this.testCallback' mapping with a mapping for 'this.someOtherCallback'
                this.bullet.updateEventMapping(this.testEventName, this.testCallback, this.someOtherCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('undefined');
                expect(mappings[this.testEventName].callbacks[someOtherCallbackString]).to.be.an('object');
            });

            it('should respect the ‘once’ parameter when updating mapped functions', function () {});
        }); // [updateEventMapping]

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

            it('should throw an ParamTypeError if the event name param is not a string', function () {

                var self = this;

                function callTrigger () {

                    // Attempt to trigger an event with a non-string event name parameter.
                    self.bullet.trigger({});
                }

                expect(callTrigger).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                function callTrigger () {

                    // Attempt to trigger an event with an empty string as the event name parameter.
                    self.bullet.trigger('');
                }

                expect(callTrigger).to.throw(this.bullet._errors.EventNameLengthError);
            });
        }); // [trigger]

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

            it('should throw a ParamCountError if no parameters are passed', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event with no params.
                    self.bullet.once();
                }

                expect(callOnce).to.throw(this.bullet._errors.ParamCountError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw an ParamCountError if only one parameter is passed', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event with only one parameter.
                    self.bullet.once(self.testEventName);
                }

                expect(callOnce).to.throw(this.bullet._errors.ParamCountError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw an ParamCountError if more than three parameters are passed', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event with more than three params.
                    self.bullet.once(self.testEventName, self.testCallback, true, 123);
                }

                expect(callOnce).to.throw(this.bullet._errors.ParamCountError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw an ParamTypeError if the event name param is not a string', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event with a non-string event name parameter.
                    self.bullet.once({}, self.testCallback);
                }

                expect(callOnce).to.throw(this.bullet._errors.ParamTypeError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event with an empty string as the event name parameter.
                    self.bullet.once('', self.testCallback);
                }

                expect(callOnce).to.throw(this.bullet._errors.EventNameLengthError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should throw a ParamTypeError if the callback parameter is not a function', function () {

                var self = this;

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event with a non-function as the callback parameter.
                    self.bullet.once(self.testEventName, {});
                }

                expect(callOnce).to.throw(this.bullet._errors.ParamTypeError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });
        }); // [once]
        
        describe('addEventName()', function () {

            it('should add an event to the internal "_strictEvents" object', function () {

                var events = this.bullet.events;
                
                // The map should start empty
                expect(events).to.deep.equal({});

                // Add an event.
                this.bullet.addEventName('foo');

                // Get the updated events map.
                events = this.bullet.events;
                
                // Bullet's internal _events should not have been modified.
                expect(events).to.deep.equal({foo : 'foo'});

                // Add another event.
                this.bullet.addEventName('bar');

                // Get the updated events map.
                events = this.bullet.events;
                
                // Bullet's internal _events should not have been modified.
                expect(events).to.deep.equal({foo : 'foo', bar : 'bar'});
            });

            it('should throw an ParamTypeError if the passed parameter is not a string', function () {

                var self = this;

                function calladdEventName () {
                    self.bullet.addEventName({hello : 'hi'});
                }

                expect(calladdEventName).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the passed string parameter length is 0', function () {

                var self = this;

                function calladdEventName () {
                    self.bullet.addEventName('');
                }

                expect(calladdEventName).to.throw(this.bullet._errors.EventNameLengthError);
            });
        }); // [addEventName]

        describe('removeEventName()', function () {

            it('should remove an event from the internal "_strictEvents" object', function () {

                var events = this.bullet.events;
                
                // Add multiple events so that we can test the removal of a single event.
                this.bullet.addEventName('foo');
                this.bullet.addEventName('bar');
                this.bullet.addEventName('baz');

                // Get the updated events map.
                events = this.bullet.events;
                
                expect(events).to.deep.equal({foo : 'foo', bar : 'bar', baz : 'baz'});

                // Remove one of the events.
                this.bullet.removeEventName('bar');

                // Get the updated events map.
                events = this.bullet.events;

                expect(events).to.deep.equal({foo : 'foo', baz : 'baz'});
                
                // Remove the remaining events.
                this.bullet.removeEventName('foo');
                this.bullet.removeEventName('baz');

                // Get the updated events map.
                events = this.bullet.events;

                // The map should start empty
                expect(events).to.deep.equal({});
            });
        
            it('should throw an ParamTypeError if the passed parameter is not a string', function () {

                var self = this;

                function callremoveEventName () {
                    self.bullet.removeEventName({hello : 'hi'});
                }

                expect(callremoveEventName).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the passed string parameter length is 0', function () {

                var self = this;

                function callremoveEventName () {
                    self.bullet.removeEventName('');
                }

                expect(callremoveEventName).to.throw(this.bullet._errors.EventNameLengthError);
            });
        }); // [removeEventName]
    });

    describe('Strict Mode Method Implementation', function () {

        beforeEach(function () {

            this.bullet = new BulletClass();
            this.testEventName = 'hello there';
            this.testCallback = function testCallback () {};
        });

        describe('getStrictMode()', function () {

            it('should return the boolean value of the private "_strictMode" property', function () {

                expect(this.bullet.getStrictMode()).to.be.a('boolean');
            });

            it('should be false by default', function () {

                expect(this.bullet.getStrictMode()).to.equal(false);
            });
        }); // [getStrictMode]

        describe('setStrictMode()', function () {

            it('should set the private "_strictMode" property to a boolean value', function () {

                // It should be false by default.
                expect(this.bullet.getStrictMode()).to.equal(false);

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                expect(this.bullet.getStrictMode()).to.equal(true);

                // Turn off strict mode.
                this.bullet.setStrictMode(false);

                expect(this.bullet.getStrictMode()).to.equal(false);
            });

            it('should throw a ParamTypeError if a non-boolean value is passed as the parameter', function () {

                var self = this;

                // It should be false by default.
                expect(this.bullet.getStrictMode()).to.equal(false);

                function callSetStrictMode () {

                    // Call setStrictMode and pass in a non-boolean value.
                    self.bullet.setStrictMode({});
                }

                expect(callSetStrictMode).to.throw(this.bullet._errors.ParamTypeError);
            });
        }); // [setStrictMode]

        describe('on()', function () {

            it('should throw an UndeclaredEventError if the event name param is not in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOn () {

                    // Attempt to map an event that hasn't been added to the 'events' object.
                    self.bullet.on(self.testEventName, self.testCallback);
                }

                expect(callOn).to.throw(this.bullet._errors.UndeclaredEventError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should not throw an UndeclaredEventError if the event name param is in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                // Get the mappings.
                var mappings = this.bullet._getMappings();

                // The map should start empty.
                expect(mappings).to.deep.equal({});

                function callOn () {

                    // Map an event that was added to the 'events' object.
                    self.bullet.on(self.testEventName, self.testCallback);
                }

                expect(callOn).to.not.throw(this.bullet._errors.UndeclaredEventError);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                var testCallbackString = this.testCallback.toString();

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('object');
            });
        }); // [on] (strict mode)

        describe('off()', function () {

            it('should throw an UndeclaredEventError if the event name param is not in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                function callOff () {

                    // Attempt to unmap an event that hasn't been added to the 'events' object.
                    self.bullet.off(self.testEventName, self.testCallback);
                }

                expect(callOff).to.throw(this.bullet._errors.UndeclaredEventError);
            });

            it('should not throw an UndeclaredEventError if the event name param is in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                // Map the test event to a callback via the 'on' method.
                this.bullet.on(this.testEventName, this.testCallback);

                function callOff () {

                    // Unmap the event that was added to the 'events' object.
                    self.bullet.off(self.testEventName, self.testCallback);
                }

                expect(callOff).to.not.throw(this.bullet._errors.UndeclaredEventError);
            });
        }); // [off] (strict mode)

        // TODO : Add tests for replaceEventMappings method in strict mode.
        describe('replaceEventMappings()', function () {});

        // TODO : Add tests for updateEventMapping method in strict mode.
        describe('updateEventMapping()', function () {});

        describe('once()', function () {

            it('should throw an UndeclaredEventError if the event name param is not in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // The map should start empty
                expect(this.bullet._getMappings()).to.deep.equal({});

                function callOnce () {

                    // Attempt to map an event that hasn't been added to the 'events' object.
                    self.bullet.once(self.testEventName, self.testCallback);
                }

                expect(callOnce).to.throw(this.bullet._errors.UndeclaredEventError);

                // The map should still be empty
                expect(this.bullet._getMappings()).to.deep.equal({});
            });

            it('should not throw an UndeclaredEventError if the event name param is in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                // Get the mappings.
                var mappings = this.bullet._getMappings();

                // The map should start empty.
                expect(mappings).to.deep.equal({});

                function callOnce () {

                    // Map an event that was added to the 'events' object.
                    self.bullet.once(self.testEventName, self.testCallback);
                }

                expect(callOnce).to.not.throw(this.bullet._errors.UndeclaredEventError);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                var testCallbackString = this.testCallback.toString();

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[testCallbackString]).to.be.an('object');
            });
        }); // [once] (strict mode)
        
        describe('trigger()', function () {

            it('should throw an UndeclaredEventError if the event name param is not in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                function callTrigger () {

                    // Attempt to trigger an event that hasn't been added to the 'events' object.
                    self.bullet.trigger(self.testEventName);
                }

                expect(callTrigger).to.throw(this.bullet._errors.UndeclaredEventError);
            });

            it('should throw an UnmappedEventError if the event name param is not mapped to any callbacks', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                function callTrigger () {

                    // Attempt to trigger an event that hasn't been mapped any callbacks via the 'on' method.
                    self.bullet.trigger(self.testEventName);
                }

                expect(callTrigger).to.throw(this.bullet._errors.UnmappedEventError);
            });

            it('should not throw an UndeclaredEventError if the event name param is in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                function callTrigger () {

                    // Trigger the event that was added to the 'events' object, but wasn't mapped to any callback.
                    self.bullet.trigger(self.testEventName);
                }

                expect(callTrigger).not.to.throw(this.bullet._errors.UndeclaredEventError);
            });

            it('should not throw an UnmappedEventError if the event name param is mapped to a callback', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                // Map the event that was added to the 'events' object.
                self.bullet.on(self.testEventName, self.testCallback);

                function callTrigger () {

                    // Trigger the event that was added to the 'events' object and mapped to a callback.
                    self.bullet.trigger(self.testEventName);
                }

                expect(callTrigger).to.not.throw(this.bullet._errors.UnmappedEventError);
            });
        }); // [trigger] (strict mode)
    });
});