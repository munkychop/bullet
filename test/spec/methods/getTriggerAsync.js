'use strict';

describe('getTriggerAsync()', function () {

    it('should return the boolean value of the private "_triggerAsync" property', function () {

        expect(this.bullet.getTriggerAsync()).to.be.a('boolean');
    });

    it('should be true by default', function () {

        expect(this.bullet.getTriggerAsync()).to.equal(true);
    });
});
