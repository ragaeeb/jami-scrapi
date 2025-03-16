import { describe, expect, it } from 'vitest';

import { fetchSnapshots } from './wayback';

describe.skip('wayback', () => {
    describe('fetchSnapshots', () => {
        it('should get all the snapshots', async () => {
            const actual = await fetchSnapshots('alsoheemy.net/play.php?catsmktba=*');
            expect(actual).toEqual([]);
        });
    });
});
