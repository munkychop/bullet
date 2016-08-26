'use strict';

describe('Strict Mode:: on()', function () {

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
});
