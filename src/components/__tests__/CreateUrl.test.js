import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateUrl from '../CreateUrl';

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

describe('CreateUrl Component', () => {
  it('has necessary inputs for shortening a URL', () => {
    const { getByLabelText, getByText } = render(<CreateUrl />);

    expect(getByLabelText('URL to shorten')).toBeInTheDocument();
    expect(getByLabelText('Code (optional)')).toBeInTheDocument();
    expect(getByLabelText('Expiration (optional)')).toBeInTheDocument();
    expect(getByLabelText('Password (optional)')).toBeInTheDocument();
    expect(getByText('Shorten')).toBeInTheDocument();
  });

  it('has the submit button disabled until form is filled out', () => {
    const { getByText } = render(<CreateUrl />);
    expect(getByText('Shorten')).toBeDisabled();
  });

  it('enables submit button once form is valid', () => {
    const { getByLabelText, getByText } = render(<CreateUrl />);

    userEvent.type(getByLabelText('URL to shorten'), 'example.com');
    expect(getByText('Shorten')).not.toBeDisabled();
  });

  it('posts url data to api upon form submission', async () => {
    fetch.mockResponseOnce(JSON.stringify({ url: mockUrlObject }));

    const { getByLabelText, getByText } = render(<CreateUrl />);

    userEvent.type(getByLabelText('URL to shorten'), 'example.com');
    await act(async () => {
      await userEvent.click(getByText('Shorten'));
    });

    expect(fetch).toBeCalledTimes(1);
  });

  it('shows error message if custom code is taken', async () => {
    const errorMessage = 'URL code is already taken';
    fetch.mockResponseOnce(JSON.stringify({ message: errorMessage }), {
      status: 402,
    });

    const { getByLabelText, getByText } = render(<CreateUrl />);

    userEvent.type(getByLabelText('URL to shorten'), 'example.com');
    await act(async () => {
      await userEvent.click(getByText('Shorten'));
    });

    expect(getByText(errorMessage)).toBeInTheDocument();
  });
});
