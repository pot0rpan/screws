import type { Options } from 'express-rate-limit';

import type { ApiUserDbType } from '../types/auth';
import type { DatabaseRequest } from '../middlewares/database';
import { APIKEY_COLLECTION_NAME } from './index';
import { MILLISECONDS_PER_MINUTE } from '../utils/time';

export const defaultRateLimitOptions: Options = {
  windowMs: 2 * MILLISECONDS_PER_MINUTE,
  max: 5,
  message: JSON.stringify({
    message: 'Rate limit exceeded, please wait a few moments',
  }),
};

export const maxFn = async (req: DatabaseRequest): Promise<number> => {
  let apiKeyObj: ApiUserDbType | null = null;

  try {
    apiKeyObj = await checkApiKeyHeader(req);
  } catch (err) {
    console.error(err);
  }

  return apiKeyObj ? apiKeyObj.rate : (defaultRateLimitOptions.max as number);
};

// For external API usage with different rate limiting
const checkApiKeyHeader = async (
  req: DatabaseRequest
): Promise<ApiUserDbType | null> => {
  let foundKeyEntry: ApiUserDbType | null = null;

  if (req.headers['x-api-key']) {
    // Check API key validity
    const key = req.headers['x-api-key'] as string;
    const ApiKey = req.db.collection<ApiUserDbType>(APIKEY_COLLECTION_NAME);

    try {
      foundKeyEntry = await ApiKey.findOne({ key });
    } catch (err) {
      console.error(err);
    }
  }

  return foundKeyEntry;
};
