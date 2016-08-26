'use strict';

describe('Method Existence', function () {

    it('should have a private method named "_getMappings"', function () {
        expect(this.bullet._getMappings).to.be.a('function');
    });

    it('should have a public method named "on"', function () {
        expect(this.bullet.on).to.be.a('function');
    });

    it('should have a public method named "off"', function () {
        expect(this.bullet.off).to.be.a('function');
    });

    it('should have a public method named "replaceCallback"', function () {
        expect(this.bullet.replaceCallback).to.be.a('function');
    });

    it('should have a public method named "replaceAllCallbacks"', function () {
        expect(this.bullet.replaceAllCallbacks).to.be.a('function');
    });

    it('should have a public method named "trigger"', function () {
        expect(this.bullet.trigger).to.be.a('function');
    });

    it('should have a public method named "once"', function () {
        expect(this.bullet.once).to.be.a('function');
    });

    it('should have a public method named "addEventName"', function () {
        expect(this.bullet.addEventName).to.be.a('function');
    });

    it('should have a public method named "removeEventName"', function () {
        expect(this.bullet.removeEventName).to.be.a('function');
    });

    it('should have a public method named "getStrictMode"', function () {
        expect(this.bullet.getStrictMode).to.be.a('function');
    });

    it('should have a public method named "setStrictMode"', function () {
        expect(this.bullet.setStrictMode).to.be.a('function');
    });

    it('should have a public method named "getTriggerAsync"', function () {
        expect(this.bullet.getTriggerAsync).to.be.a('function');
    });

    it('should have a public method named "setTriggerAsync"', function () {
        expect(this.bullet.setTriggerAsync).to.be.a('function');
    });
});
