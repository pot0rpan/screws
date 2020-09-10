import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CleanUrl from '../CleanUrl';

const mockUrl = {
  clean: 'https://example.com/?test=ok',
  dirty: 'https://example.com/?test=ok&utm_medium=medium',
};

describe('CleanUrl Component', () => {
  it('has a URL input and nothing else', () => {
    const { getByLabelText, queryByText } = render(<CleanUrl />);

    expect(getByLabelText('URL to clean')).toBeInTheDocument();
    expect(queryByText(/tracking/i)).toBeNull();
  });

  it('renders message if valid url but no tracking params', async () => {
    const { getByLabelText, getByText, queryByText } = render(<CleanUrl />);
    const input = getByLabelText('URL to clean');

    userEvent.type(input, mockUrl.clean);

    expect(getByText('No tracking parameters detected')).toBeInTheDocument();
    expect(queryByText('Tracking parameters detected')).toBeNull();
  });

  it('renders TrackingParams if valid url with tracking params', async () => {
    const { getByLabelText, getByText, queryByText } = render(<CleanUrl />);
    const input = getByLabelText('URL to clean');

    userEvent.type(input, mockUrl.dirty);

    expect(getByText(/tracking parameters detected/i)).toBeInTheDocument();
    expect(queryByText('No tracking parameters detected')).toBeNull();
  });
});
