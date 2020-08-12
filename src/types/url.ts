export interface PreviewDataType {
  title: string;
  description: string;
  image: {
    url: string;
    type: string;
  };
}

export interface UrlDbObjectType extends BaseUrlObjectType {
  _id: string;
  password: string | null;
  preview: PreviewDataType | null;
}

export interface UrlClientObjectType extends BaseUrlObjectType {
  _id: string;
  password: boolean;
  preview: PreviewDataType | null;
}

export interface UrlCreationObjectType extends BaseUrlObjectType {
  password: string;
  preview: PreviewDataType | null;
}

interface BaseUrlObjectType {
  longUrl: string;
  code: string;
  isRandomCode: boolean;
  date: number;
  expiration: number | null;
}
