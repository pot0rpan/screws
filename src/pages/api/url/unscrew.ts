import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import rateLimit from 'express-rate-limit';
import ogs from 'open-graph-scraper';

import { PreviewDataType } from '../../../types/url';
import { BASE_URL } from '../../../config';
import { defaultRateLimitOptions } from '../../../config/rate-limit';
import { promiseTimeout } from '../../../utils';
import { validate, VALIDATOR_URL } from '../../../utils/validators';

const handler = nextConnect();
const limiter = rateLimit(defaultRateLimitOptions);
handler.use(limiter);

export interface UnscrewUrlResponse {
  redirected: boolean;
  requestUrl: string;
  responseUrl: string;
  preview: PreviewDataType | null;
}

interface RequestBody {
  url: string;
}

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { url: inputUrl }: RequestBody = req.body;

  if (
    !inputUrl ||
    !validate(inputUrl, [VALIDATOR_URL()]) ||
    inputUrl.includes(BASE_URL)
  ) {
    return res.status(402).json({ message: 'Invalid url provided' });
  }

  let fetchResponse: Response;
  let html: string;

  try {
    fetchResponse = await promiseTimeout<Response>(fetch(inputUrl), 5000);
    html = await fetchResponse.text();
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching url' });
  }

  const { result: ogsResult, error: ogsError } = await ogs({
    url: '',
    html,
  });

  if (ogsError || !ogsResult.success) {
    return res.status(404).json({ message: 'Error fetching URL data' });
  }

  // Construct response data
  const preview: PreviewDataType = {
    title: ogsResult.ogTitle || '',
    description: ogsResult.ogDescription || '',
    image: {
      url: ogsResult.ogImage?.url || '',
      type: ogsResult.ogImage?.type || '',
    },
  };

  const response: UnscrewUrlResponse = {
    redirected: fetchResponse.redirected,
    requestUrl: inputUrl,
    responseUrl: fetchResponse.url,
    preview:
      (preview.title && preview.description) || preview.image.url
        ? preview
        : null,
  };

  res.json(response);
});

export default handler;
