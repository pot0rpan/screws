import { Collection } from 'mongodb';
import randomWords from 'random-words';
import shortId from 'shortid';

import { RESERVED_CODES } from '../config';

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
