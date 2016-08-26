'use strict';

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
});
