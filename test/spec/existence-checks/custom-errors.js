'use strict';

describe('Custom Error Existence', function () {

    it('should have custom error type "ParamCountError"', function () {
        expect(this.bullet._errors.ParamCountError).to.be.a('function');
    });

    it('should have custom error type "ParamTypeError"', function () {
        expect(this.bullet._errors.ParamTypeError).to.be.a('function');
    });

    it('should have custom error type "EventNameLengthError"', function () {
        expect(this.bullet._errors.EventNameLengthError).to.be.a('function');
    });

    it('should have custom error type "EventNamesArrayLengthError"', function () {
        expect(this.bullet._errors.EventNamesArrayLengthError).to.be.a('function');
    });

    it('should have custom error type "UndeclaredEventError"', function () {
        expect(this.bullet._errors.UndeclaredEventError).to.be.a('function');
    });

    it('should have custom error type "UnmappedEventError"', function () {
        expect(this.bullet._errors.UnmappedEventError).to.be.a('function');
    });
});
