import { render } from '@testing-library/react';

import { SECRET_URLS } from '../../config';
import { MILLISECONDS_PER_DAY } from '../../utils/time';
import { addUrlProtocolIfMissing } from '../../utils/urls';
import RedirectInfo from '../RedirectInfo';

describe('RedirectInfo Component', () => {
  const defaultUrl = {
    _id: '1',
    code: 'code',
    longUrl: 'https://example.com',
    password: false,
    preview: null,
    isRandomCode: false,
    date: Date.now(),
    expiration: null,
  };

  it('renders basic url info', () => {
    const { getByText } = render(<RedirectInfo url={defaultUrl} />);

    expect(getByText(`/${defaultUrl.code}`)).toBeInTheDocument();
    expect(getByText(defaultUrl.longUrl)).toHaveAttribute(
      'href',
      defaultUrl.longUrl
    );
    expect(getByText('Hide this page for 30 days')).not.toBeDisabled();
  });

  it('renders expiration warning if link has expiration date', () => {
    const url = {
      ...defaultUrl,
      expiration: defaultUrl.date + MILLISECONDS_PER_DAY,
    };

    const { getByText } = render(<RedirectInfo url={url} />);

    expect(getByText(/Expires in \w+ \w+/)).toBeInTheDocument();
  });

  it('renders nothing then redirects if sneaky redirect', () => {
    // Override window.location.href to prevent 'Not implemented' error
    const originalLocation = { ...window.location };
    delete window.location;
    window.location = { href: '' };

    const url = {
      ...defaultUrl,
      longUrl: addUrlProtocolIfMissing(SECRET_URLS[0]),
    };

    const { container } = render(<RedirectInfo url={url} />);

    expect(container).toBeEmptyDOMElement();
    expect(window.location.href).toBe(url.longUrl);

    // Cleanup
    window.location = originalLocation;
  });
});
