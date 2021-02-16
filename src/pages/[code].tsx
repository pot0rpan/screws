import { NextPage, GetServerSideProps } from 'next';
import cookies from 'next-cookies';

import { UrlClientObjectType } from '../types/url';
import { BASE_URL, SECRET_URLS } from '../config';
import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../config/cookies';
import { stringIncludesSubstring } from '../utils';
import Layout from '../components/layout/Layout';
import NotFound404 from '../components/shared/NotFound404';
import RedirectInfo from '../components/RedirectInfo';
import AuthorizeUrl from '../components/AuthorizeUrl';

interface UrlResponseType {
  url?: UrlClientObjectType;
  message?: string;
  passwordRequired?: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const code = ctx.query.code as string;
  const skipConfirmation = cookies(ctx)[COOKIE_SKIP_REDIRECT_CONFIRMATION];
  let url: UrlClientObjectType | null = null;
  let passwordRequired: boolean = false;

  if (!code) {
    return { notFound: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/url/${code}`);
    const data: UrlResponseType = await res.json();

    if (res.status === 401 || data.passwordRequired) {
      passwordRequired = true;
    } else if (data.url) {
      url = data.url;
    } else {
      ctx.res && (ctx.res.statusCode = res.status);
    }
  } catch (err) {
    console.error('/[code] getServerSideProps catch(err):\n', err);
  }

  if (!url && !passwordRequired) {
    return {
      notFound: true,
    };
  }

  // Redirect without showing confirmation page
  if (
    url &&
    !passwordRequired &&
    (skipConfirmation || stringIncludesSubstring(url.longUrl, SECRET_URLS))
  ) {
    return {
      redirect: {
        destination: url.longUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      code,
      url,
      passwordRequired,
    },
  };
};

interface Props {
  code: string;
  url: UrlClientObjectType | null;
  passwordRequired: boolean;
}

const Page: NextPage<Props> = ({ code, url, passwordRequired }) => {
  if (passwordRequired) {
    return (
      <Layout
        title={`/${code}`}
        description="Password is required to access this content."
      >
        <AuthorizeUrl code={code} />
      </Layout>
    );
  } else if (url) {
    return (
      <Layout
        title={`/${code}`}
        description={`Landing page for redirect to ${url.longUrl}`}
        ogImage={url.preview?.image?.url}
        ogUrl={`${BASE_URL}/${url.code}`}
      >
        <RedirectInfo url={url} />
      </Layout>
    );
  } else {
    return (
      <Layout title="/ Page not found">
        <NotFound404 />
      </Layout>
    );
  }
};

export default Page;
