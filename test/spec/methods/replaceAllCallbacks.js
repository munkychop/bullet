'use strict';

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
});
