import {
  formatTime,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_WEEK,
} from '../time';

describe('formatTime util function', () => {
  it('correctly formats time', () => {
    expect(formatTime(1000)).toBe('1 second');
    expect(formatTime(2000)).toBe('2 seconds');

    expect(formatTime(MILLISECONDS_PER_MINUTE)).toBe('1 minute');
    expect(formatTime(2 * MILLISECONDS_PER_MINUTE)).toBe('2 minutes');

    expect(formatTime(MILLISECONDS_PER_HOUR)).toBe('1 hour');
    expect(formatTime(2 * MILLISECONDS_PER_HOUR)).toBe('2 hours');

    expect(formatTime(MILLISECONDS_PER_DAY)).toBe('1 day');
    expect(formatTime(2 * MILLISECONDS_PER_DAY)).toBe('2 days');
    expect(formatTime(MILLISECONDS_PER_WEEK)).toBe('7 days');
  });
});
