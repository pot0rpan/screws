import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { RequestHandler } from 'next-connect';
import { MongoClient, Db } from 'mongodb';

const client = new MongoClient(process.env.DB_CONNECTION_STRING || '', {
  useUnifiedTopology: true,
});

export interface DatabaseRequest extends NextApiRequest {
  dbClient: MongoClient;
  db: Db;
}

const database: RequestHandler<DatabaseRequest, NextApiResponse> = async (
  req,
  _res,
  next
) => {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db();
  return next();
};

const middleware = nextConnect();
middleware.use(database);

export default middleware;
