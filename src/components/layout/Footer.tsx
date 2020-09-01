import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/unscrew">
            <a>Unscrew</a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>
        <li>
          <a href="https://discord.gg/ck2QCqH" target="_blank" rel="noopener">
            Support
          </a>
        </li>
        <li>
          <Link href="/about#privacy">
            <a>Privacy Policy</a>
          </Link>
        </li>
      </ul>
      <style jsx>
        {`
          footer {
            margin-top: auto;
            padding-top: 3rem;
            text-align: center;
          }
          footer ul {
            align-items: flex-start;
            background-color: var(--primary-muted);
            color: var(--bg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            list-style: none;
            margin: 0;
            padding: 1.25rem 2rem;
          }
          footer li {
            margin: 0.5rem 0;
          }

          @media screen and (min-width: 576px) {
            footer ul {
              flex-wrap: wrap;
              flex-direction: row;
            }
            footer li {
              margin: 0 0.75rem;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
