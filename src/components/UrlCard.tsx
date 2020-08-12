import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { MdContentCopy, MdLockOutline } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { IoMdStopwatch } from 'react-icons/io';

import { formatTime } from '../utils/time';
import UrlsContext from '../context/urls-context';

interface Props {
  id: string;
  longUrl: string;
  code: string;
  expiration: number | null;
  password: boolean;
}

const UrlCard: React.FC<Props> = ({
  id,
  longUrl,
  code,
  expiration,
  password,
}) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const { removeUrl } = useContext(UrlsContext);

  const expirationMilliseconds = expiration
    ? expiration - new Date().getTime()
    : -1;

  // Remove link from application state if it expires
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!expiration) return;

    timeout = setTimeout(() => {
      removeUrl(id);
    }, expiration - new Date().getTime());

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const copyCodeToClipboard = () => {
    if (copyState !== 'idle') return;

    // Copy to clipboard
    const el = document.createElement('textarea');
    el.value = `${window.location.origin}/${code}`;
    document.body.append(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopyState('copied');
    setTimeout(() => setCopyState('idle'), 2000);
  };

  return (
    <div className="card">
      <div className="short-url">
        <Link href={`/${code}`} prefetch={false}>
          <a>/{code}</a>
        </Link>
        <div className="icons">
          {expiration && (
            <div className="icon">
              <IoMdStopwatch
                title={`This link expires in ${formatTime(
                  expirationMilliseconds
                )}`}
              />
            </div>
          )}
          {password && (
            <div className="icon">
              <MdLockOutline title="This link is password protected" />
            </div>
          )}
          <button
            title="Copy short URL"
            onClick={copyCodeToClipboard}
            disabled={copyState !== 'idle'}
            className="icon copy"
          >
            {copyState === 'copied' ? (
              <AiOutlineCheckCircle />
            ) : (
              <MdContentCopy />
            )}
          </button>
        </div>
      </div>
      <p className="long-url">
        <a target="_blank" rel="noopener noreferrer" href={longUrl}>
          {longUrl}
        </a>
      </p>

      <style jsx>
        {`
          .card {
            color: var(--text);
            border: 2px solid var(--primary-muted);
            padding: 1rem;
          }
          .short-url a,
          .long-url {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .short-url {
            display: flex;
            font-weight: bold;
            justify-content: space-between;
            margin-top: 0;
          }
          .short-url .icons {
            display: flex;
            font-size: 1.4rem;
            align-items: center;
            color: var(--primary-muted);
          }
          .short-url .icon {
            align-items: center;
            display: flex;
            justify-content: center;
            margin-left: 0.25rem;
          }
          .short-url a {
            font-size: 1.2em;
            letter-spacing: 1px;
            margin-right: 0.5rem;
          }
          button.copy {
            align-items: center;
            background: none;
            border: none;
            color: var(--primary);
            cursor: pointer;
            display: flex;
            font-size: inherit;
            height: 2rem;
            justify-content: center;
            padding: 0;
            width: 2rem;
          }
          button.copy:hover,
          button.copy:focus {
            color: var(--primary-muted);
          }
          button.copy:disabled {
            cursor: default;
          }
          .long-url {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  );
};

export default UrlCard;
