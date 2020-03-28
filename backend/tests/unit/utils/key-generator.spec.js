const KeyGenerator = require('../../../src/utils/key-generator');

describe('Generate Unique ID', () => {
    it('should generate an ID with 8 characthers', () => {
        const id = KeyGenerator.generateUniqueId();
        expect(id).toHaveLength(8)
    });
    const UniqueTries = 1000;
    it(`should generate ${UniqueTries} unique ID's`, () => {
        const ids = [];
        for(let i=0; i < UniqueTries; i++)
        {
            let id = KeyGenerator.generateUniqueId();
            expect(ids).not.toContain(id);
            ids.push(id);
            expect(ids).toContain(id);
        }
    });
});
