// https://developer.mongodb.com/how-to/nextjs-building-modern-applications
import { NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

import { UrlDbObjectType, UrlClientObjectType } from '../../../types/url';
import { URL_COLLECTION_NAME } from '../../../config';
import { defaultRateLimitOptions } from '../../../config/rate-limit';
import dbMiddleware, { DatabaseRequest } from '../../../middlewares/database';

const handler = nextConnect();

const limiter = rateLimit({
  ...defaultRateLimitOptions,
  skip: (req) => !req.body.password, // Only rate limit password attempts
});

handler.use(dbMiddleware);
handler.use(limiter);

interface RequestBody {
  password: string;
}

handler.use(
  async (req: DatabaseRequest, res: NextApiResponse, next: NextHandler) => {
    const allowedMethods = ['GET', 'POST'];
    if (!req.method || !allowedMethods.includes(req.method.toUpperCase())) {
      return next();
    }

    let { code } = req.query;
    const { password }: RequestBody = req.body;

    const Url: Collection<UrlDbObjectType> = req.db.collection(
      URL_COLLECTION_NAME
    );

    if (!code)
      return res.status(404).json({ message: 'No code supplied in URL' });

    if (typeof code === 'object') code = code[0];

    try {
      // Read the actual url object from db
      let url = await Url.findOne({ code });
      if (url) {
        // Delete if expired
        if (url.expiration && url.expiration < new Date().getTime()) {
          await Url.findOneAndDelete({ code });
          return res.status(404).json({ message: 'URL not found' });
        } else {
          // Verify password
          if (url.password) {
            let authorized = false;

            if (password) {
              // Check password
              authorized = await bcrypt.compare(password, url.password);
              if (!authorized) {
                return res.status(401).json({
                  message: 'Incorrect password',
                  passwordProtected: true,
                });
              }
            }

            if (!authorized) {
              return res.status(401).json({
                message: 'URL is password protected',
                passwordProtected: true,
              });
            }
          }

          // Send client-safe url object to client
          const clientSafeUrlObject: UrlClientObjectType = {
            ...url,
            password: !!url.password,
            flags: url.flags?.length || 0,
          };
          return res.json({ url: clientSafeUrlObject });
        }
      } else {
        return res.status(404).json({ message: 'URL not found' });
      }
    } catch (err) {
      return res.status(500).json({ message: err || 'Unknown server error' });
    }
  }
);

export default handler;
