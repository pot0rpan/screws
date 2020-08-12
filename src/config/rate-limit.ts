import rateLimit from 'express-rate-limit';

import { MILLISECONDS_PER_MINUTE } from '../utils/time';

export const defaultRateLimitOptions: rateLimit.Options = {
  windowMs: 2 * MILLISECONDS_PER_MINUTE,
  max: 5,
  message: JSON.stringify({
    message: 'Rate limit exceeded, please wait a few moments',
  }),
};
