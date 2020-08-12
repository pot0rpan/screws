import { useState, useEffect } from 'react';

import { UrlClientObjectType } from '../types/url';
import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../config/cookies';
import { VALIDATOR_MINLENGTH } from '../utils/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { useCookies } from '../hooks/cookie-hook';
import Input from './Input';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import RedirectInfo from './RedirectInfo';

interface Props {
  code: string;
}

const AuthorizeUrl: React.FC<Props> = ({ code }) => {
  const [url, setUrl] = useState<UrlClientObjectType>(null!);
  const { getCookie } = useCookies();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const clearErrorOnKeyDown = (e: KeyboardEvent) => {
    if (error && e.key !== 'Enter') clearError();
  };

  // Clear http error on key press
  useEffect(() => {
    if (error) {
      document.addEventListener('keydown', clearErrorOnKeyDown, {
        // once: true,
      });
    }

    return () => {
      document.removeEventListener('keydown', clearErrorOnKeyDown);
    };
  }, [error]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formState.isValid) {
      if (error) return;

      try {
        const { url } = await sendRequest(
          `/api/url/${code}`,
          'POST',
          JSON.stringify({
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );

        if (url) {
          setUrl(url);
        }
      } catch (err) {}
    }
  };

  if (url) {
    // Redirect to that url if cookie is set
    if (Boolean(getCookie(COOKIE_SKIP_REDIRECT_CONFIRMATION))) {
      window.location.href = url.longUrl;
      return null;
    }
    // Otherwise show url details
    return <RedirectInfo url={url} />;
  }

  return (
    <div className="container">
      <header>
        <h1>Password required for</h1>
        <h2>/{code}</h2>
      </header>
      <form onSubmit={submitHandler}>
        <Input
          id="password"
          element="input"
          onInput={inputHandler}
          label="Password"
          initialValidity={false}
          errorText="Please enter a password"
          validators={[VALIDATOR_MINLENGTH(1)]}
          type="password"
          autoFocus
        />
        {error && <small>{error}</small>}

        <div className="button">
          <Button type="submit" disabled={!formState.isValid || !!error}>
            View
          </Button>
        </div>

        {isLoading && <LoadingSpinner asOverlay />}
      </form>

      <style jsx>
        {`
          .container {
            padding: 0 1rem;
          }
          .container header {
            text-align: center;
          }
          .container header h2 {
            color: var(--primary);
          }
          form {
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            max-width: 400px;
            position: relative;
          }
          form small {
            color: var(--danger);
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          .button {
            padding: 1rem 0;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default AuthorizeUrl;
