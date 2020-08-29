import { render, act } from '@testing-library/react';
import user from '@testing-library/user-event';

import Backup from '../Backup';

const mockUrlObjects = [
  {
    _id: '1',
    longUrl: 'https://example.com',
    code: 'code',
    isRandomCode: true,
    date: Date.now(),
    expiration: null,
    password: null,
    preview: null,
  },
];

beforeEach(() => {
  fetch.resetMocks();
});

describe('Backup component', () => {
  it('renders clickable `Backup` button', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ date: new Date().toISOString(), urls: mockUrlObjects })
    );

    const { getByText, container } = render(<Backup />);

    const button = getByText(/download/i);

    container.addEventListener('click', (e) => {
      //! `Not implemented` error if this event isn't stopped,
      // but I can't figure out how to properly mock it.
      // Mocking `window.location` doesn't seem to stop the error
      //* Tests only pass if the event is allowed, but with an error
      // // if (!e.isTrusted) e.stopPropagation();
    });

    await act(async () => {
      await user.click(button);
    });

    expect(fetch).toBeCalledTimes(1);
  });
});
