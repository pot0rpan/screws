import Head from 'next/head';

import { WEBSITE_NAME, BASE_URL } from '../config';
import Nav from './Nav';
import Footer from './Footer';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
}

const Layout: React.FC<Props> = ({
  title = '/ The secure URL shortener',
  description = 'A private and secure URL shortener built with you in mind.',
  ogImage = `${BASE_URL}/screws.png`,
  ogUrl = BASE_URL,
  children,
}) => {
  return (
    <div className="layout">
      <Head>
        <title>{`${WEBSITE_NAME} ${title}`}</title>
        <meta name="description" content={description} key="description" />

        <meta property="og:title" content={`${WEBSITE_NAME} ${title}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
      </Head>
      <Nav />
      {children}
      <Footer />
      <style jsx>
        {`
          .layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
