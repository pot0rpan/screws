import { Collection } from 'mongodb';
import randomWords from 'random-words';
import shortId from 'shortid';
import url from 'url';

import { RESERVED_CODES, TRACKING_PARAMS } from '../config';
import { stringIncludesSubstring } from './index';

// https://www.regextester.com/96146
export const UrlRegExp = /^((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

export const addUrlProtocolIfMissing = (url: string) =>
  url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `https://${url}`;

export const isReservedCode = (code: string) =>
  !RESERVED_CODES.reduce(
    (isReserved, reservedCode) =>
      isReserved && code.toLowerCase() !== reservedCode,
    true
  );

//! : (Collection: Collection) => string
export const generateRandomCode = async (
  Collection: Collection,
  useFullWords = true
) => {
  let code = '';
  let isDuplicate = true;

  try {
    if (useFullWords) {
      // Use full words like gfycat
      let numWords = 2; // 2 words by default

      code = randomWords(numWords).join('');
      numWords++; // Increment for duplicate scaling
      const existingUrl = await Collection.findOne({ code });
      isDuplicate = !!existingUrl || isReservedCode(code);
    } else {
      // Use random characters
      code = shortId.generate();
      const existingUrl = await Collection.findOne({ code });
      isDuplicate = !!existingUrl || isReservedCode(code);
    }
  } catch (err) {
    console.log(err);
    isDuplicate = true;
  }

  return isDuplicate ? generateRandomCode(Collection, useFullWords) : code;
};

type ParamsType = { key: string; value: string };

type UrlTrackingDataType = {
  url: string;
  isDirty: boolean;
  trackingParams: ParamsType[];
  cleanUrl: string;
};

export const getTrackingParamData = (dirtyUrl: string) => {
  const urlObj = url.parse(dirtyUrl);
  let baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  const urlData: UrlTrackingDataType = {
    url: dirtyUrl,
    isDirty: false,
    trackingParams: [],
    cleanUrl: dirtyUrl,
  };

  // If no query params, return default object
  if (!urlObj.query) return urlData;

  const _queries = urlObj.query.split('&');
  const safeParams: ParamsType[] = [];
  const trackingParams: ParamsType[] = [];

  // Gather up all key/value pairs of query params
  // Add to safe or dirty objects after checking
  for (const query of _queries) {
    const keyValue = query.split('=');
    const key = keyValue[0];
    const value = keyValue.length > 1 ? keyValue[1] : '';

    if (stringIncludesSubstring(key, TRACKING_PARAMS)) {
      trackingParams.push({ key, value });
    } else {
      safeParams.push({ key, value });
    }
  }

  // Construct safe query string for cleanUrl
  let safeQueryString = '';
  if (safeParams.length) {
    safeQueryString =
      '?' +
      safeParams
        .map((q) => {
          let param = `${q.key}=`;
          if (q.value) param += `${q.value}`;
          return param;
        })
        .join('&');
  }

  // Populate object with details on dirty url
  if (trackingParams.length) {
    urlData.isDirty = true;
    urlData.trackingParams = trackingParams;
    urlData.cleanUrl = baseUrl + safeQueryString;
  }

  return urlData;
};
