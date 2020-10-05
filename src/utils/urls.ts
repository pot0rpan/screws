import { Collection } from 'mongodb';
import randomWords from 'random-words';
import shortId from 'shortid';

import { UrlDbObjectType } from '../types/url';
import { RESERVED_CODES } from '../config';

// https://www.regextester.com/96146
// Modified to allow single char SLD and up to 12 char TLD
export const UrlRegExp = /^((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,12}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

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
  Collection: Collection<UrlDbObjectType>,
  useFullWords = true,
  numWords = 2
): Promise<string> => {
  let code = '';
  let isDuplicate = true;

  code = useFullWords
    ? randomWords({ exactly: numWords, join: '' })
    : shortId.generate();

  try {
    const existingUrl = await Collection.findOne({ code });
    isDuplicate = !!existingUrl || isReservedCode(code);
  } catch (err) {
    console.log(err);
  }

  // Keep recursing until not duplicate url
  return isDuplicate
    ? generateRandomCode(Collection, useFullWords, ++numWords)
    : code;
};
