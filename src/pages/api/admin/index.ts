import { NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import {
  Collection,
  Cursor,
  DeleteWriteOpResultObject,
  UpdateWriteOpResult,
  CollStats,
} from 'mongodb';

import { UrlDbObjectType, UrlClientObjectType } from '../../../types/url';
import { URL_COLLECTION_NAME, DELETE_FLAG_THRESHOLD } from '../../../config';
import authMiddleware, { AuthSessionRequest } from '../../../middlewares/auth';
import dbMiddleware, { DatabaseRequest } from '../../../middlewares/database';

const queryFields = ['id', 'code', 'date', 'expiration', 'longUrl', 'flags'];

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

    console.log('ADMIN QUERY:\n', JSON.stringify(req.body));

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
      flags: url.flags?.length || 0,
    }));

    // Send to client if found
    return res.json({ urls });
  }
);

interface DeleteRequest extends DatabaseRequest, AuthSessionRequest {}

interface DeleteRequestBody {
  codes: string[];
}

export interface DeleteResponse {
  success: boolean;
  flagged: string[];
  deleted: string[];
}

handler.delete(
  async (req: DeleteRequest, res: NextApiResponse, _next: NextHandler) => {
    const { codes }: DeleteRequestBody = req.body;
    const { session } = req;

    if (!codes.length) {
      return res
        .status(402)
        .json({ message: 'Invalid input, no URL IDs supplied' });
    }

    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    // Find urls matching codes
    let foundUrls: UrlDbObjectType[];
    try {
      const queryResult = Url.find({ code: { $in: codes } });
      foundUrls = await queryResult.toArray();
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Error fetching URLs from database' });
    }

    if (!foundUrls.length) {
      return res.status(402).json({ message: 'No URLs found matching query' });
    }

    // Determine which urls to flag and which to delete
    const user = session.user.email;
    const flagCodes = [];
    const delCodes = [];

    for (let url of foundUrls) {
      // URL already has a flag
      if (url.flags && url.flags.length) {
        // URL not flagged by this user yet,
        if (!url.flags.some((flagUser) => flagUser === user)) {
          // One more flag will be under threshold, add flag
          if (url.flags.length + 1 < DELETE_FLAG_THRESHOLD) {
            flagCodes.push(url.code);
          } else {
            // Meets threshold, delete
            delCodes.push(url.code);
          }
        }
      } else {
        // No flags exist yet
        if (DELETE_FLAG_THRESHOLD > 1) {
          flagCodes.push(url.code);
        } else {
          delCodes.push(url.code);
        }
      }
    }

    // Flag any that need it
    let flagResult: UpdateWriteOpResult;
    if (flagCodes.length) {
      try {
        flagResult = await Url.updateMany(
          { code: { $in: flagCodes } },
          {
            $push: { flags: user },
          }
        );
      } catch (err) {
        return res
          .status(500)
          .json({ message: 'Error flagging URLs in database' });
      }

      const flagCount = flagResult.modifiedCount;
      console.log(
        `ADMIN FLAGGED ${flagCount} URL${flagCount === 1 ? '' : 's'}`
      );
    }

    // Delete any that need it
    let delResult: DeleteWriteOpResultObject;
    if (delCodes.length) {
      try {
        delResult = await Url.deleteMany({ code: { $in: delCodes } });
      } catch (err) {
        return res
          .status(500)
          .json({ message: 'Error deleting URLs from database' });
      }

      const delCount = delResult.deletedCount;
      console.log(`ADMIN DELETED ${delCount} URL${delCount === 1 ? '' : 's'}`);
    }

    const response: DeleteResponse = {
      success: !!flagResult?.result?.ok || !!delResult?.result?.ok,
      flagged: flagResult?.modifiedCount === flagCodes.length ? flagCodes : [],
      deleted: delResult?.deletedCount === delCodes.length ? delCodes : [],
    };

    return res.json(response);
  }
);

export default handler;
