import { useState, useEffect } from 'react';

import { AdminUserType } from '../../types/auth';
import { UrlClientObjectType } from '../../types/url';
import {
  DbStatsResponse,
  DbStatsType,
  DeleteResponse,
} from '../../pages/api/admin';
import { BASE_URL, DELETE_FLAG_THRESHOLD } from '../../config';
import { addUrlProtocolIfMissing } from '../../utils/urls';
import { VALIDATOR_REQUIRE } from '../../utils/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import Input from '../shared/Input';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import UrlList from './UrlList';
import Backup from './Backup';
import DbStats from './DbStats';

const queryFields = [
  {
    value: 'code',
    label: 'Code',
  },
  {
    value: 'longUrl',
    label: 'Long URL',
  },
  {
    value: 'date',
    label: 'Creation date',
  },
  {
    value: 'expiration',
    label: 'Expiration date',
  },
  {
    value: 'flags',
    label: 'Number of flags',
  },
  {
    value: 'id',
    label: 'ID',
  },
];

interface Props {
  user: AdminUserType;
  signOut: () => void;
}

const Dashboard: React.FC<Props> = ({ user, signOut }) => {
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [urls, setUrls] = useState<UrlClientObjectType[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [dbStats, setDbStats] = useState<DbStatsType>({
    ok: false,
    name: '?.?',
    count: -1,
    size: -1,
    allocatedSize: -1,
    avgObjSize: -1,
  });
  const [formState, inputHandler] = useForm(
    {
      field: {
        value: 'date',
        isValid: true,
      },
      query: {
        value: '> 0',
        isValid: true,
      },
    },
    true
  );

  const userName = user.name.split('#')[0];
  const userDiscriminator = user.name.split('#')[1];

  // Fetch basic db stats and query on page load
  useEffect(() => {
    fetchAggregateData();
    submitQueryHandler();
  }, []);

  const fetchAggregateData = async () => {
    try {
      const data: DbStatsResponse = await sendRequest(`${BASE_URL}/api/admin`);

      if (data?.stats) {
        setDbStats(data.stats);
      }
    } catch (err) {}
  };

  const submitQueryHandler = async (e?: React.FormEvent) => {
    const query = formState.inputs.query.value;
    const field = formState.inputs.field.value;
    let fixedQuery: object | string | null = query.trim();

    e?.preventDefault();
    clearError();
    if (!formState.isValid) return;

    // Clean up/modify inputs
    if (
      ['date', 'expiration'].includes(field) &&
      (query.startsWith('<') || query.startsWith('>'))
    ) {
      // Handle < and > queries as well as NOW when querying date field
      const operator = query[0];
      const _query = query.substr(1).trim();

      // Allow `NOW` to use current time
      const num = _query === 'NOW' ? new Date().getTime() : parseInt(_query);

      if (operator === '<') {
        fixedQuery = { $lt: num };
      } else {
        fixedQuery = { $gt: num };
      }
    } else if (['expiration'].includes(field) && query === 'null') {
      fixedQuery = null;
    } else if (field === 'longUrl') {
      fixedQuery = addUrlProtocolIfMissing(query);
    } else if (field === 'flags') {
      if (query === '0') {
        fixedQuery = { $not: { $exists: 'flags' } };
      } else {
        fixedQuery = { $size: parseInt(query) };
      }
    }

    const reqBody = {
      field,
      query: fixedQuery,
    };

    try {
      const data: {
        urls?: UrlClientObjectType[];
        message?: string;
      } = await sendRequest(
        `${BASE_URL}/api/admin`,
        'POST',
        JSON.stringify(reqBody),
        {
          'Content-Type': 'application/json',
        }
      );
      if (data?.urls) {
        setUrls(data.urls);
      }
    } catch (err) {
      if (urls.length) setUrls([]);
    }
  };

  const handleDelete = async () => {
    if (!selectedCodes.length) return;
    if (error) clearError();

    // Confirm deletion
    if (
      !confirm(
        `Flag ${selectedCodes.length} URL${
          selectedCodes.length === 1 ? '' : 's'
        } for deletion?
URLs will be deleted after accumulating ${DELETE_FLAG_THRESHOLD} flags.
THIS ACTION CAN NOT BE UNDONE.`
      )
    ) {
      return;
    }

    try {
      const { success, flagged, deleted }: DeleteResponse = await sendRequest(
        `${BASE_URL}/api/admin`,
        'DELETE',
        JSON.stringify({ codes: selectedCodes }),
        {
          'Content-Type': 'application/json',
        }
      );

      // Reset stuff if successful
      if (success && (flagged.length || deleted.length)) {
        setSelectedCodes([]);

        // Fetch updated stats and query results
        fetchAggregateData();
        submitQueryHandler();
      }
    } catch (err) {}
  };

  return (
    <div className="dashboard">
      <h2>Welcome,</h2>
      <div id="user">
        <div className="content">
          <img
            width={96}
            height={96}
            src={user.image}
            alt="Your Discord user avatar"
          />
          <div>
            <p className="name">{userName}</p>
            <p className="discriminator">#{userDiscriminator}</p>
          </div>
        </div>
        <DbStats stats={dbStats} />
        <div className="buttons">
          <Button onClick={fetchAggregateData}>Refresh</Button>
          <Button primary={false} onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <form onSubmit={submitQueryHandler}>
        <Input
          id="field"
          element="select"
          label="Query field"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please select a valid query type"
          options={queryFields}
          initialValidity={true}
          initialValue={formState.inputs.field.value}
        />
        <Input
          id="query"
          element="input"
          label="Search query (allows `null`, `< NOW`, `> n`)"
          onInput={inputHandler}
          type="search"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a search query"
          initialValidity={true}
          initialValue={formState.inputs.query.value}
        />

        {error ? (
          <div>
            <small>{error}</small>
          </div>
        ) : null}

        <div className="button">
          <Button type="submit" disabled={isLoading || !formState.isValid}>
            Search
          </Button>
        </div>

        {isLoading && <LoadingSpinner asOverlay />}
      </form>

      {urls.length ? (
        <>
          <div
            className={`controls ${selectedCodes.length < 1 ? 'disabled' : ''}`}
          >
            <Button onClick={handleDelete} disabled={selectedCodes.length < 1}>
              Flag for deletion
            </Button>
          </div>
          <UrlList
            urls={urls}
            selectedCodes={selectedCodes}
            setSelectedCodes={setSelectedCodes}
          />
        </>
      ) : null}

      <div className="dangerous">
        <Backup />
      </div>

      <style jsx>
        {`
          .dashboard {
            align-items: center;
            display: flex;
            flex-direction: column;
            padding: 0 1rem;
          }
          #user {
            align-items: center;
            border: 1px solid var(--bg-light);
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 1rem;
            max-width: 20rem;
            padding: 1rem;
            width: 100%;
          }
          #user .content {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
          }
          #user img {
            border: calc(var(--border-width) / 2) solid var(--bg-light);
            border-radius: 50%;
            height: 96px;
            margin-bottom: 1rem;
            width: 96px;
          }
          #user .name {
            font-size: 1.2rem;
            font-weight: bold;
            margin: 0;
          }
          #user .discriminator {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin: 0;
            margin-top: 0.25rem;
          }
          #user .buttons {
            display: flex;
            font-size: 0.5rem;
            justify-content: space-between;
            margin-top: 1rem;
            width: 100%;
          }
          .button {
            margin: 1rem;
            text-align: center;
          }
          .dashboard form {
            max-width: 100%;
            position: relative;
            width: 400px;
          }
          .dashboard form small {
            color: var(--danger);
            font-weight: bold;
          }
          .controls {
            border: 1px solid var(--primary);
            display: flex;
            justify-content: center;
            margin: 1rem 0;
            padding: 1rem;
          }
          .controls.disabled {
            border-color: var(--danger);
          }
          .dangerous {
            border: 1px solid var(--danger);
            margin-top: 2rem;
          }

          @media screen and (min-width: 576px) {
            #user .content {
              align-items: center;
              flex-direction: row;
              flex-wrap: wrap;
            }
            #user img {
              margin: 0;
              margin-right: 1rem;
            }
            #user h3 {
              margin: 1rem 0;
            }
            #user #sign-out {
              margin-left: auto;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
