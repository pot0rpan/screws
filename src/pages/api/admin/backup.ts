import { NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { Collection, Cursor } from 'mongodb';

import { UrlDbObjectType } from '../../../types/url';
import { URL_COLLECTION_NAME } from '../../../config';
import authMiddleware from '../../../middlewares/auth';
import dbMiddleware, { DatabaseRequest } from '../../../middlewares/database';

const handler = nextConnect();
handler.use(authMiddleware);
handler.use(dbMiddleware);

// Get basic aggregate info about urls db
handler.get(
  async (req: DatabaseRequest, res: NextApiResponse, _next: NextHandler) => {
    console.log('ADMIN DOWNLOADING DATABASE BACKUP');

    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    // Find matching urls in db
    // https://docs.mongodb.com/drivers/node/usage-examples/find
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
