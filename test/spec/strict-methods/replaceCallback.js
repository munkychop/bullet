'use strict';

describe('Strict Mode:: replaceCallback()', function () {

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
});
