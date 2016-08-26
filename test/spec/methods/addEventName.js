'use strict';

describe('addEventName()', function () {

    it('should add an event to the internal "_strictEvents" object', function () {

        var events = this.bullet.events;
        
        // The map should start empty
        expect(events).to.deep.equal({});

        // Add an event.
        this.bullet.addEventName('foo');

        // Get the updated events map.
        events = this.bullet.events;
        
        // Bullet's internal _events should not have been modified.
        expect(events).to.deep.equal({foo : 'foo'});

        // Add another event.
        this.bullet.addEventName('bar');

        // Get the updated events map.
        events = this.bullet.events;
        
        // Bullet's internal _events should not have been modified.
        expect(events).to.deep.equal({foo : 'foo', bar : 'bar'});
    });

    it('should throw an ParamTypeError if the passed parameter is not a string', function () {

        var self = this;

        function calladdEventName () {
            self.bullet.addEventName({hello : 'hi'});
        }

        expect(calladdEventName).to.throw(this.bullet._errors.ParamTypeError);
    });

    it('should throw an EventNameLengthError if the passed string parameter length is 0', function () {

        var self = this;

        function calladdEventName () {
            self.bullet.addEventName('');
        }

        expect(calladdEventName).to.throw(this.bullet._errors.EventNameLengthError);
    });
});
