'use strict';

describe('Strict Mode:: trigger()', function () {

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
});
