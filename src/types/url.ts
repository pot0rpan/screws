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
  flags?: string[];
}

export interface UrlClientObjectType extends BaseUrlObjectType {
  _id: string;
  password: boolean;
  preview: PreviewDataType | null;
  flags?: number;
}

export interface UrlCreationObjectType extends BaseUrlObjectType {
  password: string | null;
  preview: PreviewDataType | null;
}

interface BaseUrlObjectType {
  longUrl: string;
  code: string;
  isRandomCode: boolean;
  date: number;
  expiration: number | null;
}
