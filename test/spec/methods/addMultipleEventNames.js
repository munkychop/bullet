'use strict';

describe('addMultipleEventNames()', function () {

    it('should add multiple events to the public "events" object', function () {

        var events = this.bullet.events;
        
        // The map should start empty
        expect(events).to.deep.equal({});

        // Add multiple events.
        this.bullet.addMultipleEventNames(['foo', 'bar', 'baz']);

        // Get the updated events map.
        events = this.bullet.events;
        
        // Bullet's public "events" object should now include the new events.
        expect(events).to.deep.equal({foo : 'foo', bar : 'bar', baz : 'baz'});
    });

    it('should throw an ParamTypeError if the passed parameter is not an array', function () {

        var self = this;

        function callAddMultipleEventNames () {
            self.bullet.addMultipleEventNames('hi');
        }

        expect(callAddMultipleEventNames).to.throw(this.bullet._errors.ParamTypeError);
    });

    it('should throw an EventNamesArrayLengthError if the passed array parameter length is 0', function () {

        var self = this;

        function callAddMultipleEventNames () {
            self.bullet.addMultipleEventNames([]);
        }

        expect(callAddMultipleEventNames).to.throw(this.bullet._errors.EventNamesArrayLengthError);
    });
});
