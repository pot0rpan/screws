// https://developer.mongodb.com/how-to/nextjs-building-modern-applications
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import ogs from 'open-graph-scraper';
import rateLimit from 'express-rate-limit';

import {
  UrlCreationObjectType,
  PreviewDataType,
  UrlDbObjectType,
  UrlClientObjectType,
} from '../../../types/url';
import { URL_COLLECTION_NAME, USE_FULL_WORDS, BASE_URL } from '../../../config';
import { defaultRateLimitOptions } from '../../../config/rate-limit';
import dbMiddleware, { DatabaseRequest } from '../../../middlewares/database';
import { MILLISECONDS_PER_HOUR } from '../../../utils/time';
import { expirationOptions } from '../../../components/CreateUrl';
import {
  validate,
  VALIDATOR_URL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SAFECODE,
} from '../../../utils/validators';
import {
  addUrlProtocolIfMissing,
  generateRandomCode,
  isReservedCode,
} from '../../../utils/urls';

const handler = nextConnect();

const limiter = rateLimit(defaultRateLimitOptions);

handler.use(dbMiddleware);
handler.use(limiter);

interface RequestBody {
  code: string;
  longUrl: string;
  expirationHours: number;
  password: string;
}

handler.post(async (req: DatabaseRequest, res: NextApiResponse) => {
  let { code, longUrl, expirationHours, password }: RequestBody = req.body;
  let isRandomCode = false;
  let hashedPassword: string | null = null;
  let ogData: PreviewDataType | null = null;

  // Clean up url
  longUrl = addUrlProtocolIfMissing(longUrl.trim());

  // Validate input
  const isValidInput =
    validate(longUrl, [VALIDATOR_URL()]) &&
    (code
      ? validate(code, [VALIDATOR_MAXLENGTH(24), VALIDATOR_SAFECODE()])
      : true) &&
    expirationOptions.map((exp) => exp.value).includes(expirationHours);

  if (!isValidInput) {
    return res.status(402).json({ message: 'Invalid values supplied' });
  }

  const Url = req.db.collection<UrlCreationObjectType | UrlDbObjectType>(
    URL_COLLECTION_NAME
  );

  // Generate random code if not supplied
  if (!code) {
    // If no expiration time and no password supplied, send existing Url object if found
    if (expirationHours === -1 && password === '') {
      // See if there's already a random code with same url and no expiration date or pass
      const existingUrl: UrlDbObjectType = await Url.findOne({
        longUrl,
        isRandomCode: true,
        expiration: null,
        password: null,
      });

      if (existingUrl) {
        const clientSafeUrlObject: UrlClientObjectType = {
          ...existingUrl,
          password: !!existingUrl.password,
        };
        return res.json({ url: clientSafeUrlObject });
      }
    }

    // Generate safe-to-use code
    isRandomCode = true;
    code = await generateRandomCode(Url, USE_FULL_WORDS);
  }

  // Make sure code is not a reserved route
  if (isReservedCode(code)) {
    return res.status(402).json({ message: 'URL code is already taken' });
  }

  // Hash password if supplied
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return res.status(500).json({ message: 'Error creating short URL' });
    }
  }

  try {
    // Check if code is taken
    const existingUrl: UrlDbObjectType = await Url.findOne({ code });
    if (existingUrl) {
      // Delete url if it's expired to allow creation
      if (
        existingUrl.expiration &&
        existingUrl.expiration < new Date().getTime()
      ) {
        await Url.findOneAndDelete({ code });
      } else {
        return res.status(402).json({ message: 'URL code is already taken' });
      }
    }

    // Finally fetch open graph data once we know url is ok to create
    try {
      const { result } = await ogs({
        url: longUrl,
      });
      // Only save if there's enough data to make it worth saving
      if (
        result?.success &&
        ((result.ogTitle && result.ogDescription) || result.ogImage?.url)
      ) {
        ogData = {
          title: result.ogTitle || '',
          description: result.ogDescription || '',
          image: {
            url: result.ogImage?.url || '',
            type: result.ogImage?.type || '',
          },
        };
      }
    } catch (err) {
      console.log('/api/url/create open graph error:\n', err);
    }

    // Create and save url object to db
    const newUrlDbObject: UrlCreationObjectType = {
      longUrl,
      code,
      date: new Date().getTime(),
      isRandomCode,
      password: hashedPassword,
      expiration:
        expirationHours > 0
          ? new Date().getTime() + expirationHours * MILLISECONDS_PER_HOUR
          : null,
      preview: ogData,
    };

    await Url.insertOne(newUrlDbObject);

    // Only tell client whether the url has a password
    const newUrlWithPasswordBoolean = {
      ...newUrlDbObject,
      password: !!hashedPassword,
    };

    res.json({ url: newUrlWithPasswordBoolean });
  } catch (err) {
    console.log('/api/url/create error saving url to db:\n', err);
    res.status(500).json({ message: err || 'Unknown server error' });
  }
});

export default handler;
