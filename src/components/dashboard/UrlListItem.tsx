import Link from 'next/link';

import { UrlClientObjectType } from '../../types/url';

interface Props {
  url?: UrlClientObjectType;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
}

const UrlListItem: React.FC<Props> = ({ url, onSelect, selected }) => {
  return (
    <tr className={`row ${selected ? 'selected' : ''}`}>
      {!url ? (
        <>
          <th>
            <input type="checkbox" checked={selected} onChange={onSelect} />
          </th>
          <th>Code</th>
          <th>Long URL</th>
          <th>Created at</th>
          <th>Expires at</th>
          <th>Random code</th>
          <th>Password</th>
          <th>ID</th>
        </>
      ) : (
        <>
          <td>
            <input
              id={url.code}
              type="checkbox"
              checked={selected}
              onChange={onSelect}
            />
          </td>
          <td>
            <Link href={`/${url.code}`}>
              <a>/{url.code}</a>
            </Link>
          </td>
          <td>
            <Link href={url.longUrl}>
              <a>{url.longUrl}</a>
            </Link>
          </td>
          <td>{new Date(url.date).toLocaleDateString()}</td>
          <td
            className={
              url.expiration && url.expiration < new Date().getTime()
                ? 'danger'
                : ''
            }
          >
            {url.expiration
              ? new Date(url.expiration).toLocaleDateString()
              : 'Never'}
          </td>
          <td className={url.isRandomCode ? 'accent' : 'danger'}>
            {url.isRandomCode ? 'Yes' : 'No'}
          </td>
          <td className={url.password ? 'accent' : 'danger'}>
            {url.password ? 'Yes' : 'No'}
          </td>
          <td>{url._id}</td>
        </>
      )}

      <style jsx>
        {`
          .row:hover {
            background-color: var(--bg-light);
          }
          .row.selected {
            background-color: var(--bg-lighter);
          }
          .row.selected:hover {
            background-color: var(--bg-light);
          }
          .row th {
            background-color: var(--primary-muted);
            border-right: 1px solid var(--bg);
            color: var(--bg);
            font-size: 1.1em;
          }
          .row td,
          .row th {
            border-bottom: 1px solid var(--bg-light);
            max-width: 14rem;
            overflow: hidden;
            padding: 0.5rem 0.75rem;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .row td.danger {
            color: var(--danger);
          }
        `}
      </style>
    </tr>
  );
};

export default UrlListItem;
