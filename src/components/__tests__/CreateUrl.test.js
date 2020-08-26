import { render } from '@testing-library/react';

import CreateUrl from '../CreateUrl';

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

  //TODO: Add form submission tests
});
