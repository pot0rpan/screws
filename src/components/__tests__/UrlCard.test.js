import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UrlCard from '../UrlCard';
import { MILLISECONDS_PER_DAY } from '../../utils/time';

describe('UrlCard Component', () => {
  const defaultProps = {
    id: '1',
    longUrl: 'https://example.com',
    code: 'code',
    expiration: null,
    password: false,
  };

  it('renders a basic card', () => {
    const { getByText, getByTitle } = render(<UrlCard {...defaultProps} />);

    expect(getByText(`/${defaultProps.code}`)).toHaveAttribute(
      'href',
      `/${defaultProps.code}`
    );
    expect(getByText(defaultProps.longUrl)).toHaveAttribute(
      'href',
      defaultProps.longUrl
    );
    expect(getByTitle('Copy short URL')).not.toBeDisabled();
  });

  it('copies code to clipboard when button is clicked', () => {
    // Set up mocking
    const originalDocument = { ...document };
    delete document.execCommand;
    const mockedExecCommand = jest.fn();
    document.execCommand = mockedExecCommand;

    // Render and click `copy` button
    const { getByTitle } = render(<UrlCard {...defaultProps} />);
    userEvent.click(getByTitle('Copy short URL'));

    expect(mockedExecCommand).toHaveBeenCalledWith('copy');

    // Cleanup
    document = originalDocument;
  });

  it('displays icon if url has expiration', () => {
    const url = {
      ...defaultProps,
      expiration: Date.now() + MILLISECONDS_PER_DAY,
    };
    const { getByTitle } = render(<UrlCard {...url} />);

    expect(getByTitle(/expires in \w+ \w+/)).toBeInTheDocument();
  });

  it('displays icon if url is password protected', () => {
    const url = {
      ...defaultProps,
      password: true,
    };
    const { getByTitle } = render(<UrlCard {...url} />);

    expect(getByTitle('This link is password protected')).toBeInTheDocument();
  });
});
