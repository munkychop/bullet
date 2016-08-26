'use strict';

describe('Strict Mode:: off()', function () {

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
});
