import { useState, useEffect } from 'react';

import { UrlClientObjectType } from '../types/url';
import UrlsContext from '../context/urls-context';
import '../styles.css';

export default function MyApp({ Component, pageProps }) {
  const [storedUrls, setStoredUrls] = useState<UrlClientObjectType[]>([]);

  const addUrl = (url: UrlClientObjectType) => {
    setStoredUrls([...storedUrls, url]);

    // Update local storage
    const storedUrlsString = sessionStorage.getItem('urls');
    const oldUrls: UrlClientObjectType[] = storedUrlsString
      ? JSON.parse(storedUrlsString)
      : [];
    sessionStorage.setItem('urls', JSON.stringify([...oldUrls, url]));
  };

  const removeUrl = (_id: string) => {
    setStoredUrls(storedUrls.filter((url) => url._id !== _id));

    // Update local storage
    sessionStorage.setItem(
      'urls',
      JSON.stringify(storedUrls.filter((url) => url._id !== _id))
    );
  };

  // Load saved urls from session storage once client loads
  useEffect(() => {
    const storedUrlsString = sessionStorage.getItem('urls');
    const oldUrls: UrlClientObjectType[] = storedUrlsString
      ? JSON.parse(storedUrlsString)
      : [];
    if (oldUrls.length) setStoredUrls(oldUrls);
  }, []);

  return (
    <UrlsContext.Provider value={{ urls: storedUrls, addUrl, removeUrl }}>
      <Component {...pageProps} />
    </UrlsContext.Provider>
  );
}
