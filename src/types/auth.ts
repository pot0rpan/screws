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
