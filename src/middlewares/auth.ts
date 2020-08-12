import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { RequestHandler } from 'next-connect';
import { getSession } from 'next-auth/client';

import { SessionType } from '../types/auth';

const auth: RequestHandler<NextApiRequest, NextApiResponse> = async (
  req,
  res,
  next
) => {
  const session: SessionType = await getSession({ req });

  if (!session) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  return next();
};

const middleware = nextConnect();
middleware.use(auth);

export default middleware;
