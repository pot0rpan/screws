import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { RequestHandler } from 'next-connect';
import { Session, getSession } from 'next-auth/client';

export interface AuthSessionRequest extends NextApiRequest {
  session: Session;
}

const auth: RequestHandler<AuthSessionRequest, NextApiResponse> = async (
  req,
  res,
  next
) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  req.session = session;

  return next();
};

const middleware = nextConnect();
middleware.use(auth);

export default middleware;
