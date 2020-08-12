import { addUrlProtocolIfMissing } from '../utils/urls';

// Used for default/base page <title>
export const WEBSITE_NAME = 'Screws';

// "Table" name to store URLs in
export const URL_COLLECTION_NAME = process.env.URL_COLLECTION_NAME || 'urls';

// Use full words or characters for random code generation
export const USE_FULL_WORDS = true;

// For fetch requests ran on server
export const BASE_URL = addUrlProtocolIfMissing(
  process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000'
);

export const SECRET_URLS = ['youtube.com/watch?v=dQw4w9WgXcQ'];

export const RESERVED_CODES = [
  '',
  '#',
  'api',
  'about',
  'admin',
  'screws',
  'support',
];
