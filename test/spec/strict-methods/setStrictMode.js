'use strict';

describe('Strict Mode:: setStrictMode()', function () {

    it('should set the private "_strictMode" property to a boolean value', function () {

        // It should be false by default.
        expect(this.bullet.getStrictMode()).to.equal(false);

        // Turn on strict mode.
        this.bullet.setStrictMode(true);

        expect(this.bullet.getStrictMode()).to.equal(true);

        // Turn off strict mode.
        this.bullet.setStrictMode(false);

        expect(this.bullet.getStrictMode()).to.equal(false);
    });

    it('should throw a ParamTypeError if a non-boolean value is passed as the parameter', function () {

        var self = this;

        // It should be false by default.
        expect(this.bullet.getStrictMode()).to.equal(false);

        function callSetStrictMode () {

            // Call setStrictMode and pass in a non-boolean value.
            self.bullet.setStrictMode({});
        }

        expect(callSetStrictMode).to.throw(this.bullet._errors.ParamTypeError);
    });
});
