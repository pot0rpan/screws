import shortid from 'shortid';
import randomWords from 'random-words';

import {
  addUrlProtocolIfMissing,
  isReservedCode,
  generateRandomCode,
  getTrackingParamData,
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
  jest.fn((numWords) => ['one', 'two', 'three'].slice(0, numWords))
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
    expect(randomWords).toBeCalledWith(2);
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
    expect(randomWords).toBeCalledWith(3);
    expect(mockDbCollection.findOne).toBeCalledTimes(1);
    expect(randomCode).toBe('onetwothree');
  });
});

describe('getTrackingParamData util function', () => {
  const defaultUrl = 'https://example.com';

  it('returns basic data if no tracking params in provided url', () => {
    let cleanUrl = defaultUrl;
    let trackingData = getTrackingParamData(cleanUrl);
    expect(trackingData.url).toBe(cleanUrl);
    expect(trackingData.isDirty).toBe(false);
    expect(trackingData.trackingParams.length).toBe(0);
    expect(trackingData.cleanUrl).toBe(cleanUrl);

    cleanUrl = `${defaultUrl}/test/`;
    trackingData = getTrackingParamData(cleanUrl);
    expect(trackingData.url).toBe(cleanUrl);
    expect(trackingData.isDirty).toBe(false);
    expect(trackingData.trackingParams.length).toBe(0);
    expect(trackingData.cleanUrl).toBe(cleanUrl);
  });

  it('returns basic data along with clean url and tracking params if in provided url', () => {
    let dirtyUrl = `${defaultUrl}/?utm_medium=test&ok=ok`;
    let trackingData = getTrackingParamData(dirtyUrl);
    expect(trackingData.url).toBe(dirtyUrl);
    expect(trackingData.isDirty).toBe(true);
    expect(trackingData.trackingParams.length).toBe(1);
    expect(trackingData.cleanUrl).toBe(`${defaultUrl}/?ok=ok`);

    dirtyUrl = `${defaultUrl}/test/?utm_term=test&ok=ok`;
    trackingData = getTrackingParamData(dirtyUrl);
    expect(trackingData.url).toBe(dirtyUrl);
    expect(trackingData.isDirty).toBe(true);
    expect(trackingData.trackingParams.length).toBe(1);
    expect(trackingData.cleanUrl).toBe(`${defaultUrl}/test/?ok=ok`);

    dirtyUrl = `${defaultUrl}/test?fbclid=test&ok=ok`;
    trackingData = getTrackingParamData(dirtyUrl);
    expect(trackingData.url).toBe(dirtyUrl);
    expect(trackingData.isDirty).toBe(true);
    expect(trackingData.trackingParams.length).toBe(1);
    expect(trackingData.cleanUrl).toBe(`${defaultUrl}/test?ok=ok`);
  });
});
