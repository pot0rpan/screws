import { stringIncludesSubstring, promiseTimeout } from '../index';

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

describe('promiseTimeout util function', () => {
  it('returns promise resolution if resolved before timeout', async () => {
    const response = await promiseTimeout(Promise.resolve(true), 1000);

    expect(response).toBe(true);
  });

  it('rejects if no resolve before timeout', async () => {
    let response;

    try {
      response = await promiseTimeout(
        new Promise((resolve) => {
          setTimeout(resolve, 2000);
        }),
        1000
      );
    } catch (err) {}

    expect(response).toBeUndefined();
  });

  it('rejects like normal if promise rejects before timeout', async () => {
    let response;

    try {
      response = await promiseTimeout(Promise.reject(false), 1000);
    } catch (err) {}

    expect(response).toBeUndefined();
  });
});
