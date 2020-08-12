import { createContext } from 'react';

import { UrlClientObjectType } from '../types/url';

type UrlsContextType = {
  urls: UrlClientObjectType[];
  addUrl: (url: UrlClientObjectType) => void;
  removeUrl: (_id: string) => void;
};

const UrlsContext = createContext<UrlsContextType>({
  urls: [],
  addUrl: () => {},
  removeUrl: () => {},
});

export default UrlsContext;
