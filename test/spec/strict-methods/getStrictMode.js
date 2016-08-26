'use strict';

describe('Strict Mode:: getStrictMode()', function () {

    it('should return the boolean value of the private "_strictMode" property', function () {

        expect(this.bullet.getStrictMode()).to.be.a('boolean');
    });

    it('should be false by default', function () {

        expect(this.bullet.getStrictMode()).to.equal(false);
    });
});
