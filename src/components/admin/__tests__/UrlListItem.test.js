import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import UrlListItem from '../UrlListItem';

describe('UrlListItem component', () => {
  it('renders header row if no url passed', async () => {
    const { getByText } = render(
      <table>
        <thead>
          <UrlListItem onSelect={() => {}} selected={true} />
        </thead>
      </table>
    );

    expect(getByText(/flags/i)).toBeInTheDocument();
    expect(getByText(/^code$/i)).toBeInTheDocument();
    expect(getByText(/url/i)).toBeInTheDocument();
    expect(getByText(/created/i)).toBeInTheDocument();
    expect(getByText(/expires/i)).toBeInTheDocument();
    expect(getByText(/random/i)).toBeInTheDocument();
    expect(getByText(/password/i)).toBeInTheDocument();
    expect(getByText(/id/i)).toBeInTheDocument();

    expect(getByText(/flags/i).previousSibling.childNodes[0].checked).toBe(
      true
    );
  });

  it('renders normal row if url passed', () => {
    const url = {
      _id: 'id',
      longUrl: 'https://example.com',
      code: 'code',
      isRandomCode: true,
      date: Date.now(),
      expiration: null,
      password: false,
      preview: null,
    };

    const { getByText } = render(
      <table>
        <thead>
          <UrlListItem url={url} onSelect={() => {}} selected={false} />
        </thead>
      </table>
    );

    expect(getByText('0')).toHaveClass('accent');
    expect(getByText(`/${url.code}`)).toBeInTheDocument();
    expect(getByText(url.longUrl)).toBeInTheDocument();
    expect(
      getByText(new Date(url.date).toLocaleDateString())
    ).toBeInTheDocument();
    expect(getByText(/never/i)).toHaveClass('accent');
    expect(getByText(/yes/i)).toHaveClass('accent');
    expect(getByText(/no/i)).toHaveClass('danger');
    expect(getByText(/id/i)).toBeInTheDocument();
  });

  it('sends checkbox click event to parent', () => {
    const onSelect = jest.fn();

    const { getByText } = render(
      <table>
        <thead>
          <UrlListItem onSelect={onSelect} selected={false} />
        </thead>
      </table>
    );

    // Test checkbox functionality
    const checkbox = getByText(/flags/i).previousSibling.childNodes[0];
    expect(checkbox).not.toBeChecked();
    user.click(checkbox);
    expect(onSelect).toBeCalledTimes(1);
  });
});
