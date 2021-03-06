import Link from 'next/link';

import { WEBSITE_NAME } from '../../config';

const Nav: React.FC = () => {
  return (
    <div className="nav">
      <nav>
        <Link href="/">
          <a className="home-link">
            <img src="/screws.png" alt={`Logo for ${WEBSITE_NAME}`} />
          </a>
        </Link>
        <ul>
          <li>
            <Link href="/tools">
              <a>Tools</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </nav>
      <style jsx>
        {`
          .nav {
            color: var(--primary);
            display: flex;
            justify-content: center;
            margin-bottom: 0.5rem;
            padding: 1.5rem;
          }
          .nav a {
            text-decoration: none;
          }
          .nav a:hover,
          .nav a:focus {
            text-decoration: underline;
          }
          nav {
            align-items: center;
            display: flex;
            justify-content: space-between;
            max-width: 1200px;
            width: 100%;
          }
          .home-link {
            --size: 1.8rem;
          }
          .home-link img {
            height: var(--size);
            width: auto;
            display: block;
          }
          ul {
            color: var(--primary-muted);
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
          }
          li {
            margin-left: 0.75rem;
          }
          li a:hover {
            color: var(--primary);
          }
          @media screen and (min-width: 576px) {
            .home-link {
              --size: 2.4rem;
            }
            .nav {
              padding-left: 2rem;
              padding-right: 2rem;
            }
            li {
              font-size: 1.1em;
              margin-left: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Nav;
