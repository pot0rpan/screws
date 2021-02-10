import shortid from 'shortid';
import randomWords from 'random-words';

import {
  addUrlProtocolIfMissing,
  isReservedCode,
  generateRandomCode,
  isBlockedUrl,
} from '../urls';

// Mock `findOne` to never find existing urls
//TODO: Find a way to mock separate returns for each call
//      to fully test recursive `generateRandomCode()`
const mockDbCollection = {
  findOne: jest.fn(() => Promise.resolve(null)),
};

jest.mock('shortid', () => ({
  generate: jest.fn(() => 'abcdefg'),
}));
jest.mock('random-words', () =>
  jest.fn(({ exactly, join }) =>
    ['one', 'two', 'three'].slice(0, exactly).join(join)
  )
);

beforeEach(() => {
  mockDbCollection.findOne.mockReset();
});

describe('addUrlProtocolIfMissing util function', () => {
  it('adds `https://` if no protocol in supplied url', () => {
    expect(addUrlProtocolIfMissing('example.com')).toBe('https://example.com');
    expect(addUrlProtocolIfMissing('http://example.com')).toBe(
      'http://example.com'
    );
    expect(addUrlProtocolIfMissing('https://example.com')).toBe(
      'https://example.com'
    );
  });
});

describe('isReservedCode util function', () => {
  it('returns true or false based on whether code is reserved', () => {
    expect(isReservedCode('admin')).toBe(true);
    expect(isReservedCode('abcdefg')).toBe(false);
  });
});

describe('generateRandomCode util function', () => {
  it('returns 2-word code by default', async () => {
    const randomCode = await generateRandomCode(mockDbCollection);
    expect(randomWords).toBeCalledTimes(1);
    expect(randomWords).toBeCalledWith({ exactly: 2, join: '' });
    expect(mockDbCollection.findOne).toBeCalledTimes(1);
    expect(randomCode).toBe('onetwo');
  });

  it('returns random character code if second param `false`', async () => {
    const randomCode = await generateRandomCode(mockDbCollection, false);
    expect(shortid.generate).toBeCalledTimes(1);
    expect(mockDbCollection.findOne).toBeCalledTimes(1);
    expect(randomCode).toBe('abcdefg');
  });

  it('returns n-word code as specified', async () => {
    const randomCode = await generateRandomCode(mockDbCollection, true, 3);
    expect(randomWords).toBeCalledTimes(1);
    expect(randomWords).toBeCalledWith({ exactly: 3, join: '' });
    expect(mockDbCollection.findOne).toBeCalledTimes(1);
    expect(randomCode).toBe('onetwothree');
  });
});

describe('isBlockedUrl util function', () => {
  it('returns true or false based on whether the URL is on the block list', () => {
    expect(isBlockedUrl('https://service-paypal.freesite.vip/bad')).toBe(true);
    expect(isBlockedUrl('https://google.com/ok')).toBe(false);
  });
});
