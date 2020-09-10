import Link from 'next/link';

import Layout from '../../components/layout/Layout';

const ToolsPage: React.FC = () => {
  return (
    <Layout title="/ URL tools">
      <h2>URL Tools</h2>
      <div className="links">
        <Link href="/tools/unscrew">
          <a>Preview a URL</a>
        </Link>
        <Link href="/tools/clean">
          <a>View URL tracking data</a>
        </Link>
      </div>

      <style jsx>
        {`
          h2 {
            margin-left 1rem;
            margin-right: 1rem;
            text-align: center;
          }
          .links {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            list-style: none;
            margin: 2rem auto;
            max-width: 100%;
            padding: 0 1rem;
            width: 60rem;
          }
          .links a {
            border: var(--border-width) solid var(--primary-muted);
            display: grid;
            font-size: 1.2rem;
            font-weight: bold;
            margin: 0.5rem;
            max-width: 24rem;
            padding: 2rem;
            place-items: center;
            text-align: center;
            text-decoration: none;
            width: 100%;
          }
          .links a:hover,
          .links a:focus,
          .links a:active {
            background-color: var(--bg-light);
            border-color: var(--primary);
          }

          @media screen and (min-width: 576px) {
            .links {
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default ToolsPage;
