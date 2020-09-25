import { ObjectId } from 'mongodb';

export type SessionType = null | {
  expires: string;
  user: SessionUserType;
};

export type SessionUserType = {
  email: string;
  name: string;
  image: string;
};

export type AdminUserType = {
  name: string;
  discriminator: string;
  image: string;
};

// API keys for external use (Discord bot)
export interface ApiUserCreateType {
  key: string;
  rate: number;
}

export interface ApiUserDbType extends ApiUserCreateType {
  _id: string | ObjectId;
}
