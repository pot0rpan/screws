import { useState, useEffect } from 'react';

import { AdminUserType } from '../../types/auth';
import { UrlClientObjectType } from '../../types/url';
import { BASE_URL } from '../../config';
import { addUrlProtocolIfMissing } from '../../utils/urls';
import { VALIDATOR_REQUIRE } from '../../utils/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import Input from '../Input';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import UrlList from './UrlList';
import Backup from './Backup';
import { DbStatsResponse } from '../../pages/api/admin';

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
  const [count, setCount] = useState<number>(-1);
  const [formState, inputHandler] = useForm(
    {
      field: {
        value: queryFields[0].value,
        isValid: true,
      },
      query: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  // Fetch basic db stats on page load
  useEffect(() => {
    fetchAggregateData();
  }, []);

  const fetchAggregateData = async () => {
    try {
      const data: DbStatsResponse = await sendRequest(`${BASE_URL}/api/admin`);
      console.log(data);

      if (data?.stats) {
        setCount(data.stats.count);
      }
    } catch (err) {}
  };

  const submitQueryHandler = async (e: React.FormEvent) => {
    const query = formState.inputs.query.value;
    const field = formState.inputs.field.value;
    let fixedQuery: object | string | null = query;

    e.preventDefault();
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
    } else if (query === 'null') {
      // Fix `null` query
      fixedQuery = null;
    } else if (field === 'longUrl') {
      fixedQuery = addUrlProtocolIfMissing(query);
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

    // Confirm deletion
    if (
      !confirm(
        `Delete ${selectedCodes.length} URL${
          selectedCodes.length === 1 ? '' : 's'
        }?\nTHIS ACTION CAN NOT BE UNDONE.`
      )
    ) {
      return;
    }

    try {
      const { success, count } = await sendRequest(
        `${BASE_URL}/api/admin`,
        'DELETE',
        JSON.stringify({ codes: selectedCodes }),
        {
          'Content-Type': 'application/json',
        }
      );

      if (success) {
        setUrls((lastUrls) =>
          lastUrls.filter((u) => !selectedCodes.includes(u.code))
        );
        setSelectedCodes([]);
        fetchAggregateData();
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
            <p className="name">{user.name}</p>
            <p className="discriminator">#{user.discriminator}</p>
          </div>
        </div>
        <div id="sign-out">
          <Button onClick={signOut}>Sign out</Button>
        </div>
      </div>

      <div className="details">
        <p>
          There are <span className="accent">{count > -1 ? count : '?'}</span>{' '}
          total URLs in the database
        </p>
        <div className="button">
          <Button onClick={fetchAggregateData}>Refresh</Button>
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
          initialValue={queryFields[0].value.toString()}
        />
        <Input
          id="query"
          element="input"
          label="Search query (allows `null`, `< NOW`, `> n`)"
          onInput={inputHandler}
          type="search"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a search query"
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
              Delete
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
            padding: 1rem;
          }
          #user .content {
            align-items: center;
            display: flex;
            flex-direction: column;
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
          #user #sign-out {
            font-size: 0.5rem;
            margin-top: 1rem;
          }
          .button {
            margin: 1rem;
            text-align: center;
          }
          .details {
            display: flex;
            align-items: center;
            flex-direction: column;
          }
          .details p {
            font-size: 1.2rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 0;
          }
          .details .button {
            margin: 0.5rem;
            font-size: 0.8rem;
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
            .details {
              flex-direction: row;
              padding: 1rem 0;
            }
            .details p {
              margin: 0;
              text-align: left;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
