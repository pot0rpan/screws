import { render } from '@testing-library/react';

import TrackingParams from '../TrackingParams';

describe('TrackingParams Component', () => {
  const defaultUrl = 'https://example.com';

  it('renders stuff if url has tracking params', () => {
    const url = `${defaultUrl}?utm_medium=test1&fbclid=test2`;

    const { getByText } = render(<TrackingParams url={url} />);

    expect(getByText('Tracking parameters detected')).toBeInTheDocument();
    expect(getByText('No tracking')).toBeInTheDocument();
    expect(getByText('Original URL')).toBeInTheDocument();
  });

  it('renders a simple button link to the normal url if no tracking params', () => {
    const { getByText } = render(<TrackingParams url={defaultUrl} />);

    expect(getByText('Continue to page')).toBeInTheDocument();
  });
});
