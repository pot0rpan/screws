import { WEBSITE_NAME } from '../config';
import { getTrackingParamData } from '../utils/urls';
import List from './List';
import Button from './Button';

interface Props {
  url: string;
}

const TrackingParams: React.FC<Props> = ({ url }) => {
  const trackingData = getTrackingParamData(url);
  const numParams = trackingData.trackingParams.length;

  return trackingData.isDirty && numParams > 0 ? (
    <div className="tracking">
      <h3>Tracking parameters detected</h3>

      <p>
        This URL contains <strong className="danger">{numParams}</strong>{' '}
        tracking parameter
        {numParams === 1 ? '' : 's'}. These are extra pieces of data appended to
        a URL to tell a website some extra information about their visitors,
        like where they are coming from.
      </p>
      <List
        primary={false}
        items={trackingData.trackingParams.map((p) => ({
          title: p.key,
          description: p.value,
        }))}
      />
      <p>
        {WEBSITE_NAME} cleaned up the URL for you, but the choice is still
        yours. You can choose which URL to use by clicking either of the buttons
        below.
      </p>

      <div className="buttons">
        <a className="button" href={trackingData.cleanUrl}>
          <Button>No tracking</Button>
        </a>
        <a className="button" href={url}>
          <Button primary={false}>Original URL</Button>
        </a>
      </div>

      <style jsx>
        {`
          .tracking {
            border: 1px solid var(--danger);
            margin: 2rem 0;
            max-width: 600px;
            padding: 1rem;
          }
          .tracking h3 {
            color: var(--danger);
            text-align: center;
          }
          .buttons {
            align-items: center;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            font-size: 1.1em;
          }
          .button:last-child {
            margin-top: 1rem;
          }

          @media screen and (min-width: 576px) {
            .buttons {
              flex-direction: row;
              font-size: 0.9em;
              justify-content: space-around;
            }
            .button:last-child,
            .button {
              margin: 0.5rem 0;
            }
          }
        `}
      </style>
    </div>
  ) : (
    <div className="button">
      <a href={url}>
        <Button>Continue to page</Button>
      </a>

      <style jsx>
        {`
          .button {
            margin: 2rem auto;
          }
        `}
      </style>
    </div>
  );
};

export default TrackingParams;
