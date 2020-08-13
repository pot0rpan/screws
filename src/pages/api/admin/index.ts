import { NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import {
  Collection,
  Cursor,
  DeleteWriteOpResultObject,
  CollStats,
} from 'mongodb';

import { UrlDbObjectType, UrlClientObjectType } from '../../../types/url';
import { URL_COLLECTION_NAME } from '../../../config';
import authMiddleware from '../../../middlewares/auth';
import dbMiddleware, { DatabaseRequest } from '../../../middlewares/database';

const queryFields = ['id', 'code', 'date', 'expiration', 'longUrl'];

const handler = nextConnect();
handler.use(authMiddleware);
handler.use(dbMiddleware);

export interface DbStatsResponse {
  stats: DbStatsType;
}

export interface DbStatsType {
  ok: boolean;
  name: string;
  count: number;
  size: number;
  storageSize: number;
  avgObjSize: number;
}

// Get basic aggregate info about urls db
handler.get(
  async (req: DatabaseRequest, res: NextApiResponse, _next: NextHandler) => {
    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    try {
      const statsRes: CollStats = await Url.stats();

      const stats: DbStatsResponse['stats'] = {
        ok: statsRes.ok === 1,
        name: statsRes.ns,
        count: statsRes.count,
        size: statsRes.size,
        storageSize: statsRes.storageSize,
        avgObjSize: statsRes.avgObjSize,
      };

      return res.json({ stats });
    } catch (err) {
      return res.status(500).json({ message: 'Could not fetch database info' });
    }
  }
);

interface PostRequestBody {
  query: string | object;
  field: string;
}

// Get urls matching search query
handler.post(
  async (req: DatabaseRequest, res: NextApiResponse, _next: NextHandler) => {
    const { query, field }: PostRequestBody = req.body;

    console.log('ADMIN QUERY:\n', req.body);

    // Verify inputs to use for query
    if ((!query && query !== null) || !field || !queryFields.includes(field)) {
      return res.status(402).json({ message: 'Invalid inputs' });
    }

    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    // Find matching urls in db
    // https://docs.mongodb.com/drivers/node/usage-examples/find
    let cursor: Cursor<UrlDbObjectType>;
    try {
      const filter = { [field]: query };
      const options = { sort: { date: -1 } };
      cursor = Url.find(filter, options).limit(50);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching URLs from database' });
    }

    if (!cursor || (await cursor.count()) === 0) {
      return res.status(404).json({ message: 'No URLs found matching query' });
    }

    const urls: UrlClientObjectType[] = (await cursor.toArray()).map((url) => ({
      ...url,
      password: !!url.password,
    }));

    // Send to client if found
    return res.json({ urls });
  }
);

interface DeleteRequestBody {
  codes: string[];
}

handler.delete(
  async (req: DatabaseRequest, res: NextApiResponse, _next: NextHandler) => {
    const { codes }: DeleteRequestBody = req.body;

    if (!codes.length) {
      return res
        .status(402)
        .json({ message: 'Invalid input, no URL IDs supplied' });
    }

    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    let result: DeleteWriteOpResultObject;
    try {
      result = await Url.deleteMany({ code: { $in: codes } });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching URLs from database' });
    }

    const count = result.deletedCount;
    const success = !!result.result.ok;

    console.log(`ADMIN DELETED ${count} item${count === 1 ? '' : 's'}`);

    return res.json({
      count,
      success,
    });
  }
);

export default handler;
