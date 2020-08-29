import { render, act } from '@testing-library/react';

import Dashboard from '../Dashboard';

const user = {
  name: 'name#0000',
  discriminator: 'actually-id?',
  image: 'https://example.com/image.png',
};

const urls = [
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

const stats = {
  ok: true,
  name: 'database.collection',
  count: 1234,
  size: 12345,
  allocatedSize: 23456,
  avgObjSize: 123,
};

beforeEach(() => {
  fetch.resetMocks();
});

describe('Dashboard component', () => {
  it('fetches and displays data on component mount', async () => {
    // Mock response for both api calls done in useEffect
    fetch.mockResponse(JSON.stringify({ stats, urls }));

    let utils;

    // Wait for useEffects to finish
    await act(async () => {
      utils = render(<Dashboard user={user} signOut={() => {}} />);
    });

    expect(fetch).toBeCalledTimes(2);

    // User details
    expect(utils.getByText(user.name.split('#')[0])).toBeInTheDocument();
    expect(utils.getByText(`#${user.name.split('#')[1]}`)).toBeInTheDocument();
    expect(utils.getByAltText(/avatar/i)).toHaveAttribute('src', user.image);

    // Button only renders once queried urls have loaded
    expect(utils.getByText(/flag for deletion/i)).toBeDisabled();
  });
});
