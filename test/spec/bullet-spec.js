'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var BULLET_MODULE_PATH = '../../src/bullet';
var BULLET_NAMESPACE = '__bullet_pubsub__';

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

        it('should have a public method named "replaceCallback"', function () {
            expect(this.bullet.replaceCallback).to.be.a('function');
        });

        it('should have a public method named "replaceAllCallbacks"', function () {
            expect(this.bullet.replaceAllCallbacks).to.be.a('function');
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

        it('should have a public method named "getTriggerAsync"', function () {
            expect(this.bullet.getTriggerAsync).to.be.a('function');
        });

        it('should have a public method named "setTriggerAsync"', function () {
            expect(this.bullet.setTriggerAsync).to.be.a('function');
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
                var testCallbackId = 0;

                expect(mappings[this.testEventName]).to.be.an('undefined');
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('undefined');

                // Add an event.
                this.bullet.on(this.testEventName, this.testCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                // check that Bullet's internal map has a reference to the callback.
                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[testCallbackId]).to.be.an('object');

                // check that a reference to the mapped event has been added to the callback.
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('object');
                expect(this.testCallback[BULLET_NAMESPACE].totalEvents).to.equal(1);
                expect(this.testCallback[BULLET_NAMESPACE][this.testEventName]).to.be.a('number');
            });

            it('should create mappings for different event names using the same callback', function () {

                // TODO : define 'someOtherEventName' and 'someOtherCallback' in a 'before' block.
                // (also update the others functions within the 'on()' block to use the 'before' version, i.e. this.someOtherEventName instead of just someOtherEventName)
                var someOtherEventName = 'hey';
                var someOtherCallback = function someOtherCallback () {};
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('undefined');
                expect(mappings[someOtherEventName]).to.be.an('undefined');
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('undefined');
                expect(someOtherCallback[BULLET_NAMESPACE]).to.be.an('undefined');

                // Add some events.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(someOtherEventName, this.testCallback);

                this.bullet.on(this.testEventName, someOtherCallback);
                this.bullet.on(someOtherEventName, someOtherCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks).to.be.an('object');

                expect(mappings[someOtherEventName]).to.be.an('object');
                expect(mappings[someOtherEventName].callbacks).to.be.an('object');

                var testCallbackId = 0;
                var someOtherCallbackId = 1;

                expect(mappings[this.testEventName].callbacks[testCallbackId]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[someOtherCallbackId]).to.be.an('object');

                expect(mappings[someOtherEventName].callbacks[testCallbackId]).to.be.an('object');
                expect(mappings[someOtherEventName].callbacks[someOtherCallbackId]).to.be.an('object');

                // check that references to the mapped events have been added to the callback.
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('object');
                expect(this.testCallback[BULLET_NAMESPACE].totalEvents).to.equal(2);
                expect(this.testCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(testCallbackId);
                expect(this.testCallback[BULLET_NAMESPACE][someOtherEventName]).to.equal(testCallbackId);

                expect(someOtherCallback[BULLET_NAMESPACE]).to.be.an('object');
                expect(someOtherCallback[BULLET_NAMESPACE].totalEvents).to.equal(2);
                expect(someOtherCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(someOtherCallbackId);
                expect(someOtherCallback[BULLET_NAMESPACE][someOtherEventName]).to.equal(someOtherCallbackId);
            });

            it('should map multiple callbacks to a single event name', function () {

                var someOtherCallback = function someOtherCallback () {};
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('undefined');
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('undefined');

                // Add an event.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, someOtherCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[0]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[1]).to.be.an('object');

                var testCallbackId = 0;
                var someOtherCallbackId = 1;

                expect(mappings[this.testEventName].callbacks[testCallbackId]).to.be.an('object');


                // check that a reference to the mapped event has been added to the first callback.
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('object');
                expect(this.testCallback[BULLET_NAMESPACE].totalEvents).to.equal(1);
                expect(this.testCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(testCallbackId);
                
                // check that a reference to the mapped event has been added to the second callback.
                expect(someOtherCallback[BULLET_NAMESPACE]).to.be.an('object');
                expect(someOtherCallback[BULLET_NAMESPACE].totalEvents).to.equal(1);
                expect(someOtherCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(someOtherCallbackId);
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
                this.testCallbackId = 0;
                this.someOtherCallbackId = 1;
            });

            it('should remove a mapping only for the specified event name and function', function () {

                // Create multiple event mappings so that we can test the removal of a single mapping.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, this.someOtherCallback);

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[this.testCallbackId]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');

                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('object');
                expect(this.someOtherCallback[BULLET_NAMESPACE]).to.be.an('object');


                // Remove the mapping to this.testCallback
                this.bullet.off(this.testEventName, this.testCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[this.testCallbackId]).to.be.an('undefined');
                expect(mappings[this.testEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');

                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('undefined');
                expect(this.someOtherCallback[BULLET_NAMESPACE]).to.be.an('object');

                // Remove the mapping to this.someOtherCallback
                this.bullet.off(this.testEventName, this.someOtherCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                // The map should be empty, now that all event mappings have been removed.
                expect(mappings).to.deep.equal({});

                expect(this.someOtherCallback[BULLET_NAMESPACE]).to.be.an('undefined');
            });

            it('should remove all mappings for the specified event name', function () {

                // Create multiple event mappings so that we can test the removal of all mappings
                // for a specific event name.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, this.someOtherCallback);
                this.bullet.on(this.someOtherEventName, this.testCallback);
                this.bullet.on(this.someOtherEventName, this.someOtherCallback);

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[this.testCallbackId]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[this.testCallbackId]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');

                expect(this.testCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(this.testCallbackId);
                expect(this.testCallback[BULLET_NAMESPACE][this.someOtherEventName]).to.equal(this.testCallbackId);
                
                expect(this.someOtherCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(this.someOtherCallbackId);
                expect(this.someOtherCallback[BULLET_NAMESPACE][this.someOtherEventName]).to.equal(this.someOtherCallbackId);

                // Remove all mappings for this.testEventName
                this.bullet.off(this.testEventName);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName]).to.be.an('undefined');
                expect(mappings[this.someOtherEventName].callbacks[this.testCallbackId]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');
                
                // All references to the specified event name should have been removed from testCallback and someOtherCallback.
                expect(this.testCallback[BULLET_NAMESPACE][this.testEventName]).to.be.an('undefined');
                expect(this.someOtherCallback[BULLET_NAMESPACE][this.testEventName]).to.be.an('undefined');

                // The other event – someOtherEventName – on these callbacks shouldn't be affected.
                expect(this.testCallback[BULLET_NAMESPACE][this.someOtherEventName]).to.equal(this.testCallbackId);
                expect(this.someOtherCallback[BULLET_NAMESPACE][this.someOtherEventName]).to.equal(this.someOtherCallbackId);

                // Remove all mappings for this.someOtherEventName
                this.bullet.off(this.someOtherEventName);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.someOtherEventName]).to.be.an('undefined');

                // All references to bullet should have been removed from someOtherCallback.
                expect(this.someOtherCallback[BULLET_NAMESPACE]).to.be.an('undefined');
            });

            it('should remove all mappings when no params are passed', function () {

                // Create multiple event mappings so that we can test the removal of all mappings
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, this.someOtherCallback);
                this.bullet.on(this.someOtherEventName, this.testCallback);
                this.bullet.on(this.someOtherEventName, this.someOtherCallback);

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[this.testCallbackId]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[this.testCallbackId]).to.be.an('object');
                expect(mappings[this.someOtherEventName].callbacks[this.someOtherCallbackId]).to.be.an('object');

                expect(this.testCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(this.testCallbackId);
                expect(this.testCallback[BULLET_NAMESPACE][this.someOtherEventName]).to.equal(this.testCallbackId);
                
                expect(this.someOtherCallback[BULLET_NAMESPACE][this.testEventName]).to.equal(this.someOtherCallbackId);
                expect(this.someOtherCallback[BULLET_NAMESPACE][this.someOtherEventName]).to.equal(this.someOtherCallbackId);

                // Remove all mappings.
                this.bullet.off();

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings).to.deep.equal({});

                // All references should have been removed from testCallback and someOtherCallback.
                expect(this.testCallback[BULLET_NAMESPACE]).to.be.an('undefined');
                expect(this.someOtherCallback[BULLET_NAMESPACE]).to.be.an('undefined');
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

        describe('replaceCallback()', function () {

            before(function () {

                this.someOtherCallback = function someOtherCallback () {};
            });

            it('should throw a ParamTypeError if the event name param is not a string', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceCallback () {

                    // Attempt to update a function mapped to an event name by using a non-string event name parameter.
                    self.bullet.replaceCallback({}, self.testCallback, self.someOtherCallback);
                }

                expect(callReplaceCallback).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceCallback () {

                    // Attempt to update a function mapped to an event name by using an empty string for the event name parameter.
                    self.bullet.replaceCallback('', self.testCallback, self.someOtherCallback);
                }

                expect(callReplaceCallback).to.throw(this.bullet._errors.EventNameLengthError);
            });
            
            it('should throw a ParamTypeError if the old callback param is not a function', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceCallback () {

                    // Attempt to update a function mapped to an event name by using a non-function for the old callback parameter.
                    self.bullet.replaceCallback(self.testEventName, {}, self.someOtherCallback);
                }

                expect(callReplaceCallback).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw a ParamTypeError if the new callback param is not a function', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceCallback () {

                    // Attempt to update a function mapped to an event name by using a non-function for the new callback parameter.
                    self.bullet.replaceCallback(self.testEventName, self.testCallback, {});
                }

                expect(callReplaceCallback).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw a ParamTypeError if the ‘once’ param is defined but not a boolean', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceCallback () {

                    // Attempt to update a function mapped to an event name by using a non-boolean for the 'once' parameter.
                    self.bullet.replaceCallback(self.testEventName, self.testCallback, self.someOtherCallback, {});
                }

                expect(callReplaceCallback).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an UnmappedEventError if the specified event name does not exist within the mappings object', function () {

                var self = this;

                function callReplaceCallback () {

                    // Attempt to update a function that is not mapped to any event name.
                    self.bullet.replaceCallback('someRandomEventName', self.testCallback, self.someOtherCallback);
                }

                expect(callReplaceCallback).to.throw(this.bullet._errors.UnmappedEventError);
            });

            it('should update a single mapped function for the specified event name', function () {

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].totalCallbacks).to.equal(1);
                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(this.testCallback);

                // Replace the 'this.testCallback' mapping with a mapping for 'this.someOtherCallback'
                this.bullet.replaceCallback(this.testEventName, this.testCallback, this.someOtherCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].totalCallbacks).to.equal(1);
                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(this.someOtherCallback);
            });

            it('should respect the ‘once’ parameter when replacing mapped functions', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                // update the function mapped to the testEventName and set the 'once' param for the new function.
                self.bullet.replaceCallback(self.testEventName, self.testCallback, self.someOtherCallback, true);

                // Get the updated events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[0].once).to.equal(true);
            });
        }); // [replace]

        describe('replaceAllCallbacks()', function () {

            before(function () {

                this.someOtherCallback = function someOtherCallback () {};
            });

            it('should throw a ParamTypeError if the event name param is not a string', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceAllCallbacks () {

                    // Attempt to replace all functions mapped to an event name by using a non-string event name parameter.
                    self.bullet.replaceAllCallbacks({}, self.someOtherCallback);
                }

                expect(callReplaceAllCallbacks).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an EventNameLengthError if the event name param is an empty string', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceAllCallbacks () {

                    // Attempt to replace all functions mapped to an event name by using an empty string for the event name parameter.
                    self.bullet.replaceAllCallbacks('', self.someOtherCallback);
                }

                expect(callReplaceAllCallbacks).to.throw(this.bullet._errors.EventNameLengthError);
            });

            it('should throw a ParamTypeError if the new callback param is not a function', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceAllCallbacks () {

                    // Attempt to replace all functions mapped to an event name by using a non-function for the new callback parameter.
                    self.bullet.replaceAllCallbacks(self.testEventName, {});
                }

                expect(callReplaceAllCallbacks).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw a ParamTypeError if the ‘once’ param is defined but not a boolean', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceAllCallbacks () {

                    // Attempt to replace all functions mapped to an event name by using a non-boolean for the 'once' parameter.
                    self.bullet.replaceAllCallbacks(self.testEventName, self.someOtherCallback, {});
                }

                expect(callReplaceAllCallbacks).to.throw(this.bullet._errors.ParamTypeError);
            });

            it('should throw an UnmappedEventError if the specified event name does not exist within the mappings object', function () {

                var self = this;

                function callReplaceAllCallbacks () {

                    // Attempt to replace a function that is not mapped to any event name.
                    self.bullet.replaceAllCallbacks('someRandomEventName', self.someOtherCallback);
                }

                expect(callReplaceAllCallbacks).to.throw(this.bullet._errors.UnmappedEventError);
            });

            it('should replace all functions mapped to the specified event with a single function', function () {

                var thirdCallback = function thirdCallback () {};
                var newCallback = function newCallback () {};
                
                // Create multiple event mappings.
                this.bullet.on(this.testEventName, this.testCallback);
                this.bullet.on(this.testEventName, this.someOtherCallback);
                this.bullet.on(this.testEventName, thirdCallback);

                // Get the events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].totalCallbacks).to.equal(3);
                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(this.testCallback);
                expect(mappings[this.testEventName].callbacks[1].cb).to.equal(this.someOtherCallback);
                expect(mappings[this.testEventName].callbacks[2].cb).to.equal(thirdCallback);

                // Replace all mapped callbacks with the 'newCallback'.
                this.bullet.replaceAllCallbacks(this.testEventName, newCallback);

                // Get the updated events map.
                mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].totalCallbacks).to.equal(1);
                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(newCallback);
                expect(mappings[this.testEventName].callbacks[1]).to.be.an('undefined');
                expect(mappings[this.testEventName].callbacks[2]).to.be.an('undefined');
            });

            it('should respect the ‘once’ parameter when replacing all mapped functions', function () {

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                // Update the function mapped to the testEventName and set the 'once' param for the new function.
                this.bullet.replaceAllCallbacks(this.testEventName, this.someOtherCallback, true);

                // Get the updated events map.
                var mappings = this.bullet._getMappings();

                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(this.someOtherCallback);
                expect(mappings[this.testEventName].callbacks[0].once).to.equal(true);
            });
        }); // [replaceAllCallbacks]

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

        describe('getTriggerAsync()', function () {

            it('should return the boolean value of the private "_triggerAsync" property', function () {

                expect(this.bullet.getTriggerAsync()).to.be.a('boolean');
            });

            it('should be true by default', function () {

                expect(this.bullet.getTriggerAsync()).to.equal(true);
            });
        }); // [getTriggerAsync]

        describe('setTriggerAsync()', function () {

            it('should set the private "_triggerAsync" property to a boolean value', function () {

                // It should be true by default.
                expect(this.bullet.getTriggerAsync()).to.equal(true);

                // Turn off async triggers.
                this.bullet.setTriggerAsync(false);

                expect(this.bullet.getTriggerAsync()).to.equal(false);

                // Turn on async triggers.
                this.bullet.setTriggerAsync(true);

                expect(this.bullet.getTriggerAsync()).to.equal(true);
            });

            it('should throw a ParamTypeError if a non-boolean value is passed as the parameter', function () {

                var self = this;

                // It should be true by default.
                expect(this.bullet.getTriggerAsync()).to.equal(true);

                function callSetTriggerAsync () {

                    // Call setTriggerAsync and pass in a non-boolean value.
                    self.bullet.setTriggerAsync({});
                }

                expect(callSetTriggerAsync).to.throw(this.bullet._errors.ParamTypeError);
            });
        }); // [setTriggerAsync]

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

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(this.testCallback);
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

        describe('replaceCallback()', function () {

            it('should throw an UndeclaredEventError if the event name param is not in the "events" object', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                // Turn on strict mode after the event was already mapped (to avoid errors from the 'on' method).
                this.bullet.setStrictMode(true);

                function callReplace () {

                    // Attempt to replace a function for an event that hasn't been added to the 'events' object.
                    self.bullet.replaceCallback(self.testEventName, self.testCallback, self.someOtherCallback);
                }

                expect(callReplace).to.throw(this.bullet._errors.UndeclaredEventError);
            });

            it('should not throw an UndeclaredEventError if the event name param is in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplace () {

                    // Replace a function for an event that was added to the 'events' object.
                    self.bullet.replaceCallback(self.testEventName, self.testCallback, self.someOtherCallback);
                }

                expect(callReplace).to.not.throw(this.bullet._errors.UndeclaredEventError);
            });
        }); // [replaceCallback] (strict mode)

        describe('replaceAllCallbacks()', function () {

            it('should throw an UndeclaredEventError if the event name param is not in the "events" object', function () {

                var self = this;

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                // Turn on strict mode after the event was already mapped (to avoid errors from the 'on' method).
                this.bullet.setStrictMode(true);

                function callReplaceAllCallbacks () {

                    // Attempt to replace all functions for an event that hasn't been added to the 'events' object.
                    self.bullet.replaceAllCallbacks(self.testEventName, self.someOtherCallback);
                }

                expect(callReplaceAllCallbacks).to.throw(this.bullet._errors.UndeclaredEventError);
            });

            it('should not throw an UndeclaredEventError if the event name param is in the "events" object', function () {

                var self = this;

                // Turn on strict mode.
                this.bullet.setStrictMode(true);

                // Add the test event to the 'events' object via the 'addEventName' method.
                this.bullet.addEventName(this.testEventName);

                // Create an event mapping.
                this.bullet.on(this.testEventName, this.testCallback);

                function callReplaceAllCallbacks () {

                    // Replace all functions for an event that was added to the 'events' object.
                    self.bullet.replaceAllCallbacks(self.testEventName, self.someOtherCallback);
                }

                expect(callReplaceAllCallbacks).to.not.throw(this.bullet._errors.UndeclaredEventError);
            });
        }); // [replaceAllCallbacks] (strict mode)

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

                expect(mappings[this.testEventName]).to.be.an('object');
                expect(mappings[this.testEventName].callbacks[0].cb).to.equal(this.testCallback);
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