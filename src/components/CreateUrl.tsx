import { useContext, useState } from 'react';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_URL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SAFECODE,
} from '../utils/validators';
import { addUrlProtocolIfMissing } from '../utils/urls';
import UrlsContext from '../context/urls-context';
import { useHttpClient } from '../hooks/http-hook';
import { useForm } from '../hooks/form-hook';
import Input from './shared/Input';
import Button from './shared/Button';
import LoadingSpinner from './shared/LoadingSpinner';
import UrlCard from './UrlCard';

export const expirationOptions = [
  {
    value: -1,
    label: 'Never',
  },
  {
    value: 1,
    label: '1 Hour',
  },
  {
    value: 6,
    label: '6 Hours',
  },
  {
    value: 24,
    label: '1 Day',
  },
  {
    value: 24 * 7,
    label: '1 Week',
  },
];

const CreateUrl: React.FC = () => {
  const { urls, addUrl } = useContext(UrlsContext);
  const [userError, setUserError] = useState<string | null>(null);
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const {
    sendRequest,
    isLoading,
    error: httpError,
    clearError: clearHttpError,
  } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      url: {
        value: '',
        isValid: false,
      },
      code: {
        value: '',
        isValid: true,
      },
      expiration: {
        value: '-1',
        isValid: true,
      },
      password: {
        value: '',
        isValid: true,
      },
    },
    false
  );

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.isValid) return;
    if (httpError) clearHttpError();
    if (userError) setUserError(null);

    const formData = {
      longUrl: formState.inputs.url.value.trim(),
      code: formState.inputs.code.value.trim(),
      expirationHours: parseInt(formState.inputs.expiration.value),
      password: formState.inputs.password.value,
    };

    // Make sure it isn't a duplicate before making request
    const isRandomCode = formData.code.trim() === '';

    const isDuplicate = !!urls.filter((url) => {
      const isDuplicateCode = formData.code === url.code;

      const isDuplicateUrl =
        addUrlProtocolIfMissing(formData.longUrl) === url.longUrl;

      // If no expiration, make sure there isn't already one stored with no expiration
      // Otherwise new expiration date warrants new Url object
      const hasNoExpiration =
        formData.expirationHours === -1 && url.expiration === null;

      // If no password supplied, make sure there isn't already a no password
      const hasNoPassword = formData.password === '' && url.password === false;

      return (
        isDuplicateCode ||
        (isRandomCode &&
          url.isRandomCode &&
          isDuplicateUrl &&
          hasNoExpiration &&
          hasNoPassword)
      );
    }).length;

    if (isDuplicate) {
      return setUserError('You already created that URL');
    }

    try {
      const responseData = await sendRequest(
        '/api/url/create',
        'POST',
        JSON.stringify(formData),
        {
          'Content-Type': 'application/json',
        }
      );

      if (responseData?.url) {
        // Only add to list if not a duplicate
        const isDuplicate = !!urls.filter(
          (url) => url._id === responseData.url._id
        ).length;
        if (isDuplicate) return;

        // Update urls list
        addUrl(responseData.url);
      }
    } catch (err) {}
  };

  const handleToggleAdvancedOptions = () => {
    setOptionsExpanded((current) => !current);
  };

  return (
    <div className="container">
      <div className="shortener">
        <h2>Shorten a URL</h2>
        <form onSubmit={submitHandler}>
          <div className="inputs">
            <div>
              <Input
                id="url"
                element="input"
                onInput={inputHandler}
                label="URL to shorten"
                placeholder="example.com/long-url"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_URL()]}
                errorText="Please enter a valid URL"
                inputMode="url"
                autoCorrect="off"
                autoCapitalize="none"
              />
              <Input
                id="code"
                element="input"
                onInput={inputHandler}
                label="Code (optional)"
                placeholder="my-cool-url"
                validators={[
                  VALIDATOR_MINLENGTH(4),
                  VALIDATOR_MAXLENGTH(32),
                  VALIDATOR_SAFECODE(),
                ]}
                errorText="Must be 4-32 characters, and `-` is the only symbol allowed"
                initialValidity={true}
                autoCorrect="off"
                autoCapitalize="none"
              />

              {httpError && <small>{httpError}</small>}
              {userError && <small>{userError}</small>}
            </div>

            <div className="advanced">
              <p className="control accent">
                <button
                  type="button"
                  onClick={handleToggleAdvancedOptions}
                  aria-expanded={optionsExpanded}
                >
                  {optionsExpanded ? 'Hide' : 'Show'} advanced options
                </button>
              </p>
              <div className={`content ${optionsExpanded ? 'show' : ''}`}>
                <Input
                  id="expiration"
                  element="select"
                  onInput={inputHandler}
                  label="Expiration (optional)"
                  initialValidity={true}
                  initialValue={expirationOptions[0].value.toString()}
                  options={expirationOptions}
                />
                <Input
                  id="password"
                  element="input"
                  onInput={inputHandler}
                  label="Password (optional)"
                  initialValidity={true}
                  type="password"
                />
              </div>
            </div>
          </div>

          <div className="button">
            <Button type="submit" disabled={!formState.isValid}>
              Shorten
            </Button>
          </div>

          {isLoading && <LoadingSpinner asOverlay />}
        </form>

        <div className="url-list">
          <ul>
            {urls.map((url) => (
              <li key={url._id}>
                <UrlCard
                  longUrl={url.longUrl}
                  code={url.code}
                  id={url._id}
                  expiration={url.expiration}
                  password={url.password}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            align-items: center;
            display: flex;
            flex-direction: column;
          }
          .shortener {
            align-items: center;
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          .shortener h2 {
            text-align: center;
          }
          .shortener form {
            max-width: 400px;
            padding: 0 1rem;
            position: relative;
            width: 100%;
          }
          .shortener form small {
            color: var(--danger);
            font-weight: bold;
          }
          .shortener form .inputs {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .shortener form .inputs > div {
            width: 100%;
          }
          .advanced .control {
            margin: 0;
            margin-bottom: 0.25rem;
          }
          .advanced button {
            all: inherit;
            cursor: pointer;
          }
          .advanced button:focus,
          .advanced button:hover {
            text-decoration: underline;
          }
          .advanced .content {
            display: none;
          }
          .advanced .content.show {
            display: block;
          }
          .expiration {
            --size: 2.5rem;
            align-items: flex-end;
            display: flex;
            justify-content: space-between;
          }
          .expiration select {
            height: var(--size);
          }
          .button {
            padding: 1rem 0;
            text-align: center;
          }
          .url-list {
            border-top: 1px solid var(--bg-light);
            margin-top: 3rem;
            padding: 0 0.5rem;
            width: 100%;
          }
          .url-list ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            list-style: none;
            margin: 0 auto;
            margin-top: -1.5rem;
            max-width: 80rem;
            padding: 0;
            width: 100%;
          }
          .url-list ul li {
            background-color: var(--bg);
            margin: 0.5rem;
            max-width: 100%;
            width: 22rem;
          }

          @media screen and (min-width: 768px) {
            .shortener form {
              max-width: 800px;
            }
            .shortener form .inputs {
              flex-direction: row;
            }
            .advanced {
              margin-left: 1.5rem;
            }
            .advanced .control {
              display: none;
            }
            .advanced .content {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CreateUrl;
