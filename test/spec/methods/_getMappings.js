'use strict';

describe('_getMappings()', function () {

    it('should return the public state of the internal "_mappings" object', function () {

        var mappings = this.bullet._getMappings();
        expect(mappings).to.deep.equal({});

        // Add a property to the returned mappings object.
        mappings.foo = 'bar';

        // Get the updated events map.
        mappings = this.bullet._getMappings();
        
        // Bullet's internal mappings should not have been modified.
        expect(mappings).to.deep.equal({});
    });
});
