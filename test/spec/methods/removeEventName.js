'use strict';

describe('removeEventName()', function () {

    it('should remove an event from the internal "_strictEvents" object', function () {

        var events = this.bullet.events;
        
        // Add multiple events so that we can test the removal of a single event.
        this.bullet.addEventName('foo');
        this.bullet.addEventName('bar');
        this.bullet.addEventName('baz');

        // Get the updated events map.
        events = this.bullet.events;
        
        expect(events).to.deep.equal({foo : 'foo', bar : 'bar', baz : 'baz'});

        // Remove one of the events.
        this.bullet.removeEventName('bar');

        // Get the updated events map.
        events = this.bullet.events;

        expect(events).to.deep.equal({foo : 'foo', baz : 'baz'});
        
        // Remove the remaining events.
        this.bullet.removeEventName('foo');
        this.bullet.removeEventName('baz');

        // Get the updated events map.
        events = this.bullet.events;

        // The map should start empty
        expect(events).to.deep.equal({});
    });

    it('should throw an ParamTypeError if the passed parameter is not a string', function () {

        var self = this;

        function callremoveEventName () {
            self.bullet.removeEventName({hello : 'hi'});
        }

        expect(callremoveEventName).to.throw(this.bullet._errors.ParamTypeError);
    });

    it('should throw an EventNameLengthError if the passed string parameter length is 0', function () {

        var self = this;

        function callremoveEventName () {
            self.bullet.removeEventName('');
        }

        expect(callremoveEventName).to.throw(this.bullet._errors.EventNameLengthError);
    });
});
