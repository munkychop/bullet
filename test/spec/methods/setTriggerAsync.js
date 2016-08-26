'use strict';

describe('setTriggerAsync()', function () {

    it('should set the private "_triggerAsync" property to a boolean value', function () {

        // It should be true by default.
        expect(this.bullet.getTriggerAsync()).to.equal(true);

        // Turn off async triggers.
        this.bullet.setTriggerAsync(false);

        expect(this.bullet.getTriggerAsync()).to.equal(false);

        // Turn on async triggers.
        this.bullet.setTriggerAsync(true);

        expect(this.bullet.getTriggerAsync()).to.equal(true);
    });

    it('should throw a ParamTypeError if a non-boolean value is passed as the parameter', function () {

        var self = this;

        // It should be true by default.
        expect(this.bullet.getTriggerAsync()).to.equal(true);

        function callSetTriggerAsync () {

            // Call setTriggerAsync and pass in a non-boolean value.
            self.bullet.setTriggerAsync({});
        }

        expect(callSetTriggerAsync).to.throw(this.bullet._errors.ParamTypeError);
    });
});
