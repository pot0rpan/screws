import { useState, useEffect } from 'react';
import { getTrackingData } from 'tracking-params';

import { addUrlProtocolIfMissing } from '../utils/urls';
import { VALIDATOR_URL, validate } from '../utils/validators';
import { useForm } from '../hooks/form-hook';
import Input from './shared/Input';
import TrackingParams from './TrackingParams';

const CleanUrl: React.FC = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [currentValidUrl, setCurrentValidUrl] = useState('');
  const [formState, inputHandler] = useForm(
    {
      url: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  // Check for tracking params on input change since client side
  useEffect(() => {
    const url = addUrlProtocolIfMissing(formState.inputs.url.value);
    if (!validate(url, [VALIDATOR_URL()])) return;

    const urlIsDirty = getTrackingData(url).isDirty;
    setCurrentValidUrl(url);
    setIsDirty(urlIsDirty);
  }, [formState.inputs.url.value]);

  return (
    <div className="clean">
      <h2>Clean a URL</h2>
      <div className="input">
        <Input
          id="url"
          label="URL to clean"
          onInput={inputHandler}
          element="input"
          validators={[VALIDATOR_URL()]}
          errorText="Please enter a valid URL"
          inputMode="url"
          autoCorrect="off"
          autoCapitalize="none"
          autoFocus
        />
      </div>

      {isDirty ? (
        <TrackingParams url={currentValidUrl} />
      ) : currentValidUrl ? (
        <p className="message">No tracking parameters detected</p>
      ) : null}

      <style jsx>
        {`
          .clean {
            margin: 0 auto;
            max-width: 100%;
            padding: 0 1rem;
          }
          .clean h2 {
            margin-left: 1rem;
            margin-right: 1rem;
            text-align: center;
          }
          .input {
            margin: 0 auto;
            max-width: 100%;
            width: calc(400px - 2rem);
          }
          .message {
            color: var(--primary-muted);
            font-size: 1.2rem;
            font-weight: bold;
            margin: 2rem auto;
            max-width: 40ch;
          }
        `}
      </style>
    </div>
  );
};

export default CleanUrl;
