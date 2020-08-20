import Link from 'next/link';

const NotFound404: React.FC = () => {
  return (
    <>
      <div className="container">
        <h1>404</h1>
        <h2>That url does not exist</h2>
        <p>
          Double check the URL code, or{' '}
          <Link href="/">
            <a>go back to the home page.</a>
          </Link>
        </p>
      </div>
      <style jsx>
        {`
          .container {
            padding: 0 1rem;
            text-align: center;
          }
          a {
            color: var(--primary);
          }
        `}
      </style>
    </>
  );
};

export default NotFound404;
