import Head from 'next/head';

import { WEBSITE_NAME } from '../config';
import Nav from './Nav';
import Footer from './Footer';

interface Props {
  title?: string;
  description?: string;
}

const Layout: React.FC<Props> = ({
  title = '/ The secure URL shortener',
  description = 'A private and secure URL shortener built with you in mind.',
  children,
}) => {
  return (
    <div className="layout">
      <Head>
        <title>{`${WEBSITE_NAME} ${title}`}</title>
        <meta name="description" content={description} key="description" />
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
