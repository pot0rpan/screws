import { DbStatsType } from '../../pages/api/admin';

interface Props {
  stats: DbStatsType;
}

const DbStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="stats">
      <p className="row">
        <span>Total number of URLs:</span>
        <span className="accent">{stats.count > -1 ? stats?.count : '?'}</span>
      </p>

      <p className="row">
        <span>Database name:</span>
        <span className="accent">{stats.name.split('.')[0]}</span>
      </p>
      <p className="row">
        <span>Collection name:</span>
        <span className="accent">{stats.name.split('.')[1]}</span>
      </p>
      <p className="row">
        <span>Collection usage:</span>
        <span className="accent">{stats.size > -1 ? stats.size : '?'} B</span>
      </p>
      <p className="row">
        <span>Collection allocated size:</span>
        <span className="accent">
          {stats.allocatedSize > -1 ? stats.allocatedSize : '?'} B
        </span>
      </p>
      <p className="row">
        <span>Average object size:</span>
        <span className="accent">
          {stats.avgObjSize > -1 ? stats.avgObjSize : '?'} B
        </span>
      </p>

      <style jsx>
        {`
          .stats {
            margin: 1rem auto;
            max-width: 500px;
            width: 100%;
          }
          .row {
            align-items: center;
            display: flex;
            font-weight: bold;
            justify-content: space-between;
            margin: 0.5rem 0;
          }
          .row:first-child {
            margin-top: 0;
          }
          .row span:last-child {
            margin-left: 1rem;
            text-align: right;
            white-space: nowrap;
          }
          .refresh {
            font-size: 0.8rem;
            margin-top: 1rem;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default DbStats;
