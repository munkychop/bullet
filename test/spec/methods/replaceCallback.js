'use strict';

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
});
