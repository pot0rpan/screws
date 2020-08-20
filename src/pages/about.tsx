import { NextPage } from 'next';
import { useState, useEffect } from 'react';

import { WEBSITE_NAME } from '../config';
import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../config/cookies';
import { useCookies } from '../hooks/cookie-hook';
import Layout from '../components/layout/Layout';
import Button from '../components/shared/Button';
import List from '../components/shared/List';

const exampleData = [
  {
    name: 'Code',
    desc: 'The shortened URL code',
  },
  {
    name: 'Long URL',
    desc: 'The full URL to redirect to',
  },
  {
    name: 'Is Random Code',
    desc: 'Whether the code was randomly generated',
  },
  {
    name: 'Creation Date',
    desc: 'When the short URL was created',
  },
  {
    name: 'Expiration Date',
    desc: 'When the link will expire (optional)',
  },
  {
    name: 'Password',
    desc: 'Hashed password for limiting access (optional)',
  },
  {
    name: 'Preview Data',
    desc:
      'Open Graph data including title, description, and image (if available)',
  },
];

const About: NextPage = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);
  const { removeCookie, getCookie } = useCookies();

  // Update state with actual cookie value once page loads in client
  useEffect(() => {
    setCookiesEnabled(Boolean(getCookie(COOKIE_SKIP_REDIRECT_CONFIRMATION)));
  }, []);

  const handleRemoveCookie = () => {
    removeCookie(COOKIE_SKIP_REDIRECT_CONFIRMATION);
    setCookiesEnabled(false);
  };

  return (
    <Layout title="/about">
      <article>
        <section>
          <h1>About {WEBSITE_NAME}</h1>
          <p>
            Screws is an open source URL shortening service centered around link
            clickers instead of the link creators. Most URL shortening services
            exist for their detailed analytics. This is great for marketing
            teams, but not for the users who click on the links. They also
            redirect you without giving you a chance to see what the final URL
            is. If you don't know where a URL leads, how can you know it's safe?
          </p>
          <p>
            {WEBSITE_NAME} does things a bit differently. Rather than
            immediately getting redirected when you click on a shortened link,
            you are instead shown a confirmation page with details about the
            full URL. On that page you get to see the exact same details
            everyone gets to see, no special treatment for link creators.
            Instead of seeing things like page referrer, devices, browsers,
            systems, and geo location of people who click on the links, you only
            get basic information about the full URL.
          </p>
        </section>

        <section>
          <a href="#privacy">
            <h2>What information does {WEBSITE_NAME} collect?</h2>
          </a>
          <p>
            None! Well, almost. {WEBSITE_NAME} never keeps track of anything
            that can be linked back to you in any way. Below is a full list of
            the information that gets saved in the database for each URL
            created.{' '}
            <span className="accent">
              No personal information is ever saved.
            </span>
          </p>
          <p>
            Website administrators have the ability to see entire URL objects
            saved in the database except the password field, which is replaced
            with a simple <span className="accent">yes</span> or{' '}
            <span className="accent">no</span> value to show whether or not the
            URL is password protected. This allows for basic moderation like
            removing blatantly malicious URLs. By using this webiste you agree
            to let {WEBSITE_NAME} staff view and remove any URL for any reason,
            without notice.
          </p>
          <List
            items={exampleData.map((d) => ({
              title: d.name,
              description: d.desc,
            }))}
          />
        </section>

        <section className="cookies">
          <a href="#cookies">
            <h2>Cookies</h2>
          </a>
          <p>
            Screws will never save any tracking or personal data in cookies. A
            single cookie is stored if you choose to opt out of seeing the
            redirect confirmation page. It only contains the value{' '}
            <span className="accent">true</span>, nothing about you.
          </p>
          <p>
            This cookie is automatically deleted 30 days after it is set or when
            you clear your browser's cookies.{' '}
            {cookiesEnabled
              ? 'If you would like to delete this cookie now, you may click the button below.'
              : 'There are no cookies currently set for you.'}
          </p>

          {cookiesEnabled ? (
            <div className="button">
              <Button onClick={handleRemoveCookie}>Clear Cookie Data</Button>
            </div>
          ) : null}
        </section>

        <section className="github">
          <a href="#github">
            <h2>Souce Code</h2>
          </a>
          <p>
            The full source code for this website is{' '}
            <span className="accent">
              <a href="https://github.com/pot0rpan/screws">
                available on GitHub
              </a>
            </span>
            . This allows you to look over the code as well as host your own
            version of {WEBSITE_NAME}. The README file has detailed instructions
            on how to set up the project to run on your own machine or a server.
            Feel free to star, fork, or make a pull request to the repository,
            it would all be greatly appreciated!
          </p>
        </section>
      </article>
      <style jsx>
        {`
          article {
            padding: 0 1rem;
            margin: 0 auto;
            max-width: 800px;
          }
          article h1,
          article h2 {
            text-align: center;
          }
          article h2 {
            margin: 3rem auto 1rem auto;
          }
          section > a {
            cursor: text;
            text-decoration: none;
          }
          article ul {
            display: flex;
            flex-direction: column;
            list-style: none;
            margin: 0;
            margin-top: 1rem;
            padding: 0;
          }
          article li {
            display: flex;
            flex-direction: column;
            margin-left: 2rem;
            margin-top: 1rem;
            position: relative;
          }
          article li::before {
            background: var(--primary-muted);
            content: '';
            height: 100%;
            left: -1rem;
            position: absolute;
            width: 0.2rem;
          }
          article li b {
            margin-bottom: 0.25rem;
          }
          .cookies .button {
            text-align: center;
          }
        `}
      </style>
    </Layout>
  );
};

export default About;
