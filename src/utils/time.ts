export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
export const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
export const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
export const MILLISECONDS_PER_WEEK = 7 * MILLISECONDS_PER_DAY;

export const formatTime = (milliseconds: number) => {
  let amount = 0;
  let unit = '';
  if (milliseconds < MILLISECONDS_PER_MINUTE) {
    amount = milliseconds / MILLISECONDS_PER_SECOND;
    unit = 'second';
  } else if (milliseconds < MILLISECONDS_PER_HOUR) {
    amount = milliseconds / MILLISECONDS_PER_MINUTE;
    unit = 'minute';
  } else if (milliseconds < MILLISECONDS_PER_DAY) {
    amount = milliseconds / MILLISECONDS_PER_HOUR;
    unit = 'hour';
  } else {
    amount = milliseconds / MILLISECONDS_PER_DAY;
    unit = 'day';
  }

  amount = Math.round(amount);

  return `${amount} ${unit}${amount !== 1 && 's'}`;
};
