import { useState } from 'react';
import { MdArrowDownward } from 'react-icons/md';

import { UnscrewUrlResponse } from '../pages/api/url/unscrew';
import { addUrlProtocolIfMissing } from '../utils/urls';
import { VALIDATOR_URL } from '../utils/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import Input from './shared/Input';
import Button from './shared/Button';
import LoadingSpinner from './shared/LoadingSpinner';
import OGPreview from './OGPreview';

const UnscrewUrl: React.FC = () => {
  const [lastUrl, setLastUrl] = useState('');
  const [urlData, setUrlData] = useState<UnscrewUrlResponse | null>(null);
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      url: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const isInputSameAsLastRequest = lastUrl
    ? lastUrl === addUrlProtocolIfMissing(formState.inputs.url.value)
    : false;

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.isValid || isInputSameAsLastRequest) return;
    if (error) clearError();

    const url = addUrlProtocolIfMissing(formState.inputs.url.value);
    setLastUrl(url);

    try {
      const urlData: UnscrewUrlResponse = await sendRequest(
        '/api/url/unscrew',
        'POST',
        JSON.stringify({
          url,
        }),
        { 'Content-Type': 'application/json' }
      );

      setUrlData(urlData);
    } catch (err) {
      setUrlData(null);
    }
  };

  return (
    <div className="lookup">
      <h2>Preview a URL</h2>
      <form onSubmit={submitHandler}>
        <Input
          id="url"
          label="URL to lookup"
          element="input"
          onInput={inputHandler}
          validators={[VALIDATOR_URL()]}
          errorText="Please enter a valid URL"
        />

        {error ? <small>{error}</small> : null}

        <div className="button">
          <Button
            type="submit"
            disabled={!formState.isValid || isInputSameAsLastRequest}
          >
            Unscrew
          </Button>
        </div>

        {isLoading ? <LoadingSpinner asOverlay /> : null}
      </form>

      {urlData?.redirected ? (
        <div className="redirect">
          <h3>Request was redirected</h3>
          <div className="redirect-info">
            <a href={urlData.requestUrl} className="accent">
              {urlData.requestUrl}
            </a>
            <span className="icon">
              <MdArrowDownward />
            </span>
            <a href={urlData.responseUrl} className="accent">
              {urlData.responseUrl}
            </a>
          </div>
        </div>
      ) : null}

      {/* Show clickable url if no title or description for preview */}
      {urlData && !urlData.preview?.title && !urlData.preview?.description ? (
        <a className="response-url accent" href={urlData.responseUrl}>
          {urlData.responseUrl}
        </a>
      ) : null}

      {urlData?.preview ? (
        <div className="preview">
          <OGPreview url={urlData.responseUrl} data={urlData.preview} />
        </div>
      ) : urlData ? (
        <p className="danger">
          <strong>No preview available</strong>
        </p>
      ) : null}

      <style jsx>
        {`
          .lookup {
            align-items: center;
            display: flex;
            flex-direction: column;
            padding: 0 1rem;
          }
          .lookup h2 {
            text-align: center;
          }
          .lookup form {
            margin: 0 auto;
            max-width: 100%;
            position: relative;
            width: 400px;
          }
          form .button {
            padding: 1rem;
            text-align: center;
          }
          form small {
            color: var(--danger);
            font-weight: bold;
          }
          .redirect {
            border: 1px solid var(--danger);
            margin: 1rem 0;
            padding: 1rem;
            text-align: center;
          }
          .redirect-info {
            align-items: center;
            display: flex;
            flex-direction: column;
          }
          .redirect-info a {
            font-size: 1.1em;
            margin: 0;
            word-break: break-word;
            word-wrap: wrap-word;
          }
          .redirect-info .icon {
            color: var(--danger);
            font-size: 2rem;
            line-height: 1rem;
            margin: 0.5rem auto;
          }
          a.response-url {
            font-size: 1.4rem;
            margin: 1rem auto;
            word-break: break-word;
            word-wrap: wrap-word;
          }
          .preview {
            border: 1px solid var(--bg-light);
            margin-top: 1rem;
            max-width: 700px;
            padding: 1rem;
          }
        `}
      </style>
    </div>
  );
};

export default UnscrewUrl;
