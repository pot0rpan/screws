// Used for default/base page <title>
export const WEBSITE_NAME = 'Screws';

// "Table" names to store stuff in
export const URL_COLLECTION_NAME = process.env.URL_COLLECTION_NAME || 'urls';
export const APIKEY_COLLECTION_NAME =
  process.env.APIKEY_COLLECTION_NAME || 'access_keys';

// Use full words or characters for random code generation
export const USE_FULL_WORDS = true;

export const SECRET_URLS = ['youtube.com/watch?v=dQw4w9WgXcQ'];

export const RESERVED_CODES = [
  '',
  '#',
  'api',
  'about',
  'admin',
  'index',
  'screws',
  'support',
  'tools',
  'unscrew',
];

// Query parameters to warn user about on /[code] page
export const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_brand',
  'utm_name',
  'fbclid',
];

// Threshold before deletion is done on flagged URLs
// Example: Once a URL is flagged for deletion a second time
// by a different user, it gets deleted instead of flagged
export const DELETE_FLAG_THRESHOLD = 2;

// Website base url for fetch requests ran on server
// addUrlProtocolIfMissing causes import errors if used here,
// so it's done manually
let baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.VERCEL_URL ||
  'http://localhost:3000';

export const BASE_URL =
  baseUrl.startsWith('http://') || baseUrl.startsWith('https://')
    ? baseUrl
    : `https://${baseUrl}`;
