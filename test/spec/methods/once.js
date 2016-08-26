'use strict';

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
});
