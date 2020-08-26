import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AuthorizeUrl from '../AuthorizeUrl';
import { COOKIE_SKIP_REDIRECT_CONFIRMATION } from '../../config/cookies';
import { setCookie, removeCookie } from '../../hooks/cookie-hook';

const mockUrlObject = {
  id: '1',
  longUrl: 'https://example.com',
  code: 'code',
  expiration: null,
  password: true,
};

beforeEach(() => {
  fetch.resetMocks();
});

describe('AuthorizeUrl Component', () => {
  it('has a password input and submit button', () => {
    const { getByLabelText, getByText } = render(<AuthorizeUrl code="code" />);

    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('View')).toBeInTheDocument();
  });

  it('has submit button disabled until password is entered', () => {
    const { getByText } = render(<AuthorizeUrl code="code" />);
    expect(getByText('View')).toBeDisabled();
  });

  it('fetches url from api on submit and displays url info', async () => {
    fetch.mockResponseOnce(JSON.stringify({ url: mockUrlObject }));

    const { getByLabelText, getByText, queryByLabelText } = render(
      <AuthorizeUrl code="code" />
    );
    const passInput = getByLabelText('Password');
    const fakePassword = 'password';

    // Enter password in input
    userEvent.type(passInput, fakePassword);
    expect(passInput.value).toBe(fakePassword);

    // Submit form
    const submitBtn = getByText('View');
    expect(submitBtn).not.toBeDisabled();

    await act(async () => {
      //? This await is needed for setState actions to finish up
      await userEvent.click(submitBtn);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Should now be rendering <RedirectInfo />
    // instead of password form
    expect(queryByLabelText('Password')).not.toBeInTheDocument();
  });

  it('immediately redirects upon correct password if cookie is set', async () => {
    // Setup
    fetch.mockResponseOnce(JSON.stringify({ url: mockUrlObject }));
    const originalLocation = { ...window.location };
    delete window.location;
    window.location = { href: '' };
    setCookie(COOKIE_SKIP_REDIRECT_CONFIRMATION, 'true');

    const { getByLabelText, getByText } = render(<AuthorizeUrl code="code" />);
    const passInput = getByLabelText('Password');

    // Enter password and submit
    userEvent.type(passInput, 'password');
    const submitBtn = getByText('View');

    await act(async () => {
      //? This await is needed for setState actions to finish up
      await userEvent.click(submitBtn);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Should automatically redirect
    expect(window.location.href).toBe(mockUrlObject.longUrl);

    // Cleanup
    window.location = originalLocation;
    removeCookie(COOKIE_SKIP_REDIRECT_CONFIRMATION);
  });

  it('shows error message if wrong password, hides it after typing', async () => {
    const mockResponseData = {
      message: 'Incorrect password',
      passwordProtected: true,
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponseData), { status: 401 });

    const { getByLabelText, getByText, queryByText } = render(
      <AuthorizeUrl code="code" />
    );
    const passInput = getByLabelText('Password');
    const fakePassword = 'password';

    // Enter pass and submit form
    userEvent.type(passInput, fakePassword);
    const submitBtn = getByText('View');

    await act(async () => {
      //? This await is needed for setState actions to finish up
      await userEvent.click(submitBtn);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(getByText(mockResponseData.message)).toBeInTheDocument;

    // Clear error message on user input
    userEvent.type(passInput, 'p');
    expect(queryByText(mockResponseData.message)).not.toBeInTheDocument();
  });
});
