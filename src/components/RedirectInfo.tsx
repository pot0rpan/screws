import Link from 'next/link';
import { useState, useEffect } from 'react';
import { IoMdStopwatch } from 'react-icons/io';

import { UrlClientObjectType } from '../types/url';
import { BASE_URL, SECRET_URLS } from '../config';
import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../config/cookies';
import { stringIncludesSubstring } from '../utils';
import { formatTime, MILLISECONDS_PER_DAY } from '../utils/time';
import { setCookie } from '../utils/cookies';
import Button from './shared/Button';
import QRCodeGenerator from './QRCodeGenerator';
import OGPreview from './OGPreview';
import TrackingParams from './TrackingParams';

interface Props {
  url: UrlClientObjectType;
}

const RedirectInfo: React.FC<Props> = ({ url }) => {
  const [cookieEnabled, setCookieEnabled] = useState(false);
  const secretRedirect = stringIncludesSubstring(url.longUrl, SECRET_URLS);

  //* Redirect once client loads
  useEffect(() => {
    if (secretRedirect) {
      window.location.href = url.longUrl;
    }
  }, []);

  const expirationMs = url?.expiration
    ? url.expiration - new Date().getTime()
    : null;
  const createdDate =
    new Date(url.date).toLocaleDateString() === new Date().toLocaleDateString()
      ? 'today'
      : new Date(url.date).toLocaleDateString();

  // Set cookie to tell server to simply send redirect response
  const addSkipConfirmationPageCookie = () => {
    const expiration = new Date(Date.now() + MILLISECONDS_PER_DAY * 30);
    setCookie(COOKIE_SKIP_REDIRECT_CONFIRMATION, 'true', '/', expiration);
    setCookieEnabled(true);
  };

  //* Don't show any data if secret redirect
  if (secretRedirect) {
    return null;
  }

  return (
    <div>
      <div className="container">
        <h1>/{url.code} </h1>
        {url.expiration && (
          <p className="expiration">
            <IoMdStopwatch className="timer" />
            <span>Expires in {formatTime(expirationMs)}</span>
          </p>
        )}

        <TrackingParams url={url.longUrl} />

        <div className="info">
          {url.preview ? (
            <div className="preview">
              <OGPreview data={url.preview} url={url.longUrl} />
            </div>
          ) : null}

          <div className="details">
            {!url.preview?.title ? (
              <p className="redirect">
                <a href={url.longUrl}>{url.longUrl}</a>
              </p>
            ) : null}

            <div className="qr">
              <QRCodeGenerator data={`${BASE_URL}/${url.code}`} />
            </div>

            <p className="created">
              This URL was created <b>{createdDate}</b>.
            </p>
          </div>
        </div>

        <div className="explanation">
          <h2>Why am I seeing this page?</h2>
          <p>
            Most URL shortening services seamlessly redirect you without giving
            you a chance to see where the URL actually leads to.
          </p>
          <p>
            They also typically have detailed analytics that track when someone
            clicks on a link. One of the popular services advertises it can
            capture 20+ data points about you on every click. Screws only saves
            the data listed above,{' '}
            <Link href="/about#privacy">
              <a className="accent">nothing else</a>
            </Link>
            .
          </p>
          <p>
            I disagree with these practices, so this page is what makes Screws
            different.
          </p>

          <h2>Don't want to see this page?</h2>
          <p>
            Screws can store a cookie in your browser to let the server know
            you'd rather be immediately redirected. Clicking the button below
            simply sets a cookie with the value of{' '}
            <span className="accent">true</span> in your browser, with an
            expiration date of 30 days. This action can be undone on the{' '}
            <Link href="/about#cookies">
              <a className="accent">About</a>
            </Link>{' '}
            page.
          </p>

          <div className="button">
            <Button
              onClick={addSkipConfirmationPageCookie}
              disabled={cookieEnabled}
            >
              {cookieEnabled ? 'Done' : 'Hide this page for 30 days'}
            </Button>
          </div>

          <h2>Is this link safe to click?</h2>
          <p>
            I don't know! But unlike other URL shorteners,{' '}
            <Link href="/about">
              <a className="accent">
                Screws gives you a chance to make that decision
              </a>
            </Link>
            . Take a look at the full URL and the data above to decide for
            yourself whether or not the link is worth clicking.
          </p>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            align-items: center;
            display: flex;
            flex-direction: column;
            padding: 0 1rem;
          }
          .container h1 {
            text-align: center;
            word-break: break-word;
            word-wrap: wrap-word;
          }
          .expiration {
            align-items: center;
            color: var(--danger);
            display: flex;
            flex-wrap: nowrap;
            font-size: 1.4rem;
            justify-content: center;
            margin: 0;
          }
          .expiration span {
            font-size: 1.2rem;
            margin-left: 0.25rem;
            text-align: center;
          }
          a {
            color: var(--primary);
          }
          .info {
            border: 1px solid var(--bg-light);
            max-width: 700px;
            padding: 1rem;
          }
          .details .qr {
            --size: 12rem;
            display: flex;
            height: auto;
            justify-content: center;
            margin: 0 auto;
            max-width: 100%;
            width: var(--size);
          }
          .details .redirect {
            font-size: 1.5rem;
            text-align: center;
          }
          .details > p {
            margin: 0.5rem 0;
          }
          .details > *:first-child {
            margin-top: 0;
          }
          .details > *:last-child {
            margin-bottom: 0;
          }
          .details .created {
            margin-top: 0;
          }
          .details b {
            color: var(--primary-muted);
            font-size: 1.2em;
          }
          .redirect a {
            word-break: break-word;
            word-wrap: wrap-word;
          }
          .redirect p {
            margin-top: 0;
          }

          .explanation {
            max-width: 800px;
          }
          .explanation h2 {
            margin: 4rem auto 2rem auto;
            text-align: center;
          }
          .explanation > :last-child {
            margin-bottom: 0;
          }
          .explanation code {
            color: var(--primary);
          }
          .explanation .button {
            text-align: center;
          }

          @media screen and (min-width: 576px) {
            .details .qr {
              --size: 14rem;
            }
            .explanation p {
              font-size: 1.2rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RedirectInfo;
