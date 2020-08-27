import { stringIncludesSubstring } from '../index';

describe('stringIncludesSubstring util function', () => {
  it('returns true or false based on whether substring(s) found', () => {
    const str = 'This is a test string';

    // Found
    expect(stringIncludesSubstring(str, 'test')).toBe(true);
    expect(stringIncludesSubstring(str, /test/)).toBe(true);
    expect(stringIncludesSubstring(str, ['test', /not found/])).toBe(true);

    // Not found
    expect(stringIncludesSubstring(str, 'not found')).toBe(false);
    expect(stringIncludesSubstring(str, /not found/)).toBe(false);
    expect(stringIncludesSubstring(str, ['not found', /not found/])).toBe(
      false
    );
  });
});
