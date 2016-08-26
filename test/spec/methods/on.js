'use strict';

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
});
