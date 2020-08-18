import { NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { Collection, Cursor } from 'mongodb';

import { UrlDbObjectType } from '../../../types/url';
import { AdminRequest } from './index';
import { URL_COLLECTION_NAME } from '../../../config';
import { Logger } from '../../../utils/logger';
import authMiddleware from '../../../middlewares/auth';
import dbMiddleware from '../../../middlewares/database';

const handler = nextConnect();
handler.use(authMiddleware);
handler.use(dbMiddleware);

// Get full database backup in JSON
handler.get(
  async (req: AdminRequest, res: NextApiResponse, _next: NextHandler) => {
    Logger.log(
      `${req.session.user.name} downloaded database backup`,
      'Admin Activity'
    );

    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    // Get all urls in db in order of creation
    let cursor: Cursor<UrlDbObjectType>;
    try {
      const options = { sort: { date: 1 } };
      cursor = Url.find({}, options);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching URLs from database' });
    }

    if (!cursor || (await cursor.count()) === 0) {
      return res.status(404).json({ message: 'No URLs found in the database' });
    }

    const urls: UrlDbObjectType[] = await cursor.toArray();

    // Send to client if found
    return res.json({ date: new Date().toISOString(), urls });
  }
);

export default handler;
