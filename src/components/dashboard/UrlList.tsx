import { SetStateAction, Dispatch } from 'react';

import { UrlClientObjectType } from '../../types/url';
import UrlListItem from './UrlListItem';

interface Props {
  urls: UrlClientObjectType[];
  selectedCodes: string[];
  setSelectedCodes: Dispatch<SetStateAction<string[]>>;
}

const UrlList: React.FC<Props> = ({
  urls,
  selectedCodes,
  setSelectedCodes,
}) => {
  const selectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id: code, checked } = e.target;

    if (!code) {
      setSelectedCodes(checked ? urls.map((u) => u.code) : []);
    } else {
      setSelectedCodes(
        checked
          ? [...selectedCodes, code]
          : selectedCodes.filter((selectedCode) => selectedCode !== code)
      );
    }
  };

  return (
    <div className="list">
      <table>
        <thead>
          <UrlListItem
            onSelect={selectHandler}
            selected={selectedCodes.length === urls.length}
          />
        </thead>
        <tbody>
          {urls.map((u) => (
            <UrlListItem
              key={u._id}
              url={u}
              onSelect={selectHandler}
              selected={selectedCodes.includes(u.code)}
            />
          ))}
        </tbody>
      </table>

      <style jsx>
        {`
          .list {
            max-width: 100%;
            overflow-x: auto;
          }
          .list table {
            border: 1px solid var(--bg-light);
            border-collapse: collapse;
          }
        `}
      </style>
    </div>
  );
};

export default UrlList;
