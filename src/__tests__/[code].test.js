import { render } from '@testing-library/react';

import { BASE_URL } from '../config';
import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../config/cookies';
import CodePage, { getServerSideProps } from '../pages/[code]';

const _ctx = {
  req: {
    headers: {
      cookie: '',
    },
  },
  query: {
    code: 'code',
  },
};

const _url = {
  _id: '1',
  longUrl: 'https://example.com',
  code: 'code',
  isRandomCode: false,
  date: Date.now(),
  expiration: null,
  password: false,
  preview: null,
};

beforeEach(() => {
  fetch.resetMocks();
});

describe('/[code] getServerSideProps', () => {
  it('returns url data if url exists', async () => {
    const ctx = {
      ..._ctx,
      req: {
        ..._ctx.req,
        headers: { ..._ctx.req.headers },
      },
      query: { ..._ctx.query },
    };
    const url = { ..._url };
    fetch.mockResponseOnce(JSON.stringify({ url }));

    const { props } = await getServerSideProps(ctx);

    expect(fetch).toBeCalledWith(`${BASE_URL}/api/url/${url.code}`);
    expect(props.code).toBe(url.code);
    expect(props.passwordRequired).toBe(false);
    expect(props.url).toEqual(url);
  });

  it('returns password required and no url object if password protected', async () => {
    const ctx = {
      ..._ctx,
      req: {
        ..._ctx.req,
        headers: { ..._ctx.req.headers },
      },
      query: { ..._ctx.query },
    };
    fetch.mockResponseOnce(JSON.stringify({ passwordRequired: true }), {
      status: 401,
    });

    const { props } = await getServerSideProps(ctx);

    expect(fetch).toBeCalledWith(`${BASE_URL}/api/url/${ctx.query.code}`);
    expect(props.code).toBe(ctx.query.code);
    expect(props.passwordRequired).toBe(true);
    expect(props.url).toBeNull();
  });

  it('redirects to long url if cookie is set and no password', async () => {
    // Cookie library used seems to read cookies from document instead of ctx?
    const _cookie = document.cookie;
    delete document.cookie;
    const cookie = `${COOKIE_SKIP_REDIRECT_CONFIRMATION}=true`;
    document.cookie = cookie;
    const ctx = {
      ..._ctx,
      req: {
        ..._ctx.req,
        headers: {
          ..._ctx.req.headers,
          cookie,
        },
      },
      query: { ..._ctx.query },
    };
    const url = { ..._url };
    fetch.mockResponseOnce(JSON.stringify({ url }));

    const { props, redirect } = await getServerSideProps(ctx);

    expect(fetch).toBeCalledWith(`${BASE_URL}/api/url/${url.code}`);
    expect(props).toBeUndefined();
    expect(redirect.destination).toBe(url.longUrl);
    expect(redirect.permanent).toBe(false);

    document.cookie = _cookie;
  });

  it('returns `notFound: true` if url not found', async () => {
    const ctx = {
      ..._ctx,
      req: {
        ..._ctx.req,
        headers: { ..._ctx.req.headers },
      },
      res: {
        statusCode: 200,
      },
      query: { ..._ctx.query },
    };

    fetch.mockResponseOnce(
      JSON.stringify({ message: 'not found' }, { status: 404 })
    );

    const { props, notFound } = await getServerSideProps(ctx);

    expect(fetch).toBeCalledWith(`${BASE_URL}/api/url/${ctx.query.code}`);
    expect(props).toBeUndefined();
    expect(notFound).toBe(true);
  });

  it('returns `notFound: true` if http error', async () => {
    const ctx = {
      ..._ctx,
      req: {
        ..._ctx.req,
        headers: { ..._ctx.req.headers },
      },
      res: {
        statusCode: 200,
      },
      query: { ..._ctx.query },
    };

    fetch.mockRejectOnce(new Error('not found'));

    const { props, notFound } = await getServerSideProps(ctx);

    expect(fetch).toBeCalledWith(`${BASE_URL}/api/url/${ctx.query.code}`);
    expect(props).toBeUndefined();
    expect(notFound).toBe(true);
  });
});

describe('/[code] page', () => {
  it('renders RedirectInfo if url and no password required', () => {
    const { getByText } = render(
      <CodePage code="code" url={_url} passwordRequired={false} />
    );

    expect(getByText('/code')).toBeInTheDocument();
  });

  it('renders AuthorizeUrl if url is null and password required', () => {
    const { getByLabelText } = render(
      <CodePage code="code" url={null} passwordRequired={true} />
    );

    expect(getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders NotFound404 if url is null and no password required', () => {
    const { getByText } = render(
      <CodePage code="code" url={null} passwordRequired={false} />
    );

    expect(getByText('404')).toBeInTheDocument();
  });
});
