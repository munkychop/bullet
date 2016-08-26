'use strict';

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
});
