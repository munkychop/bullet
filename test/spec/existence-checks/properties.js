'use strict';

describe('Property Existence', function () {

    it('should have a public property named "events"', function () {
        expect(this.bullet.events).to.be.an('object');
    });
});
