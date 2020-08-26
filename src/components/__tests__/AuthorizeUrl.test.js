import { render } from '@testing-library/react';

import AuthorizeUrl from '../AuthorizeUrl';

describe('AuthorizeUrl Component', () => {
  it('has a password input and submit button', () => {
    const { getByLabelText, getByText } = render(<AuthorizeUrl code="code" />);

    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('View')).toBeInTheDocument();
  });

  it('has the submit button disabled until password is entered', () => {
    const { getByText } = render(<AuthorizeUrl code="code" />);
    expect(getByText('View')).toBeDisabled();
  });

  //TODO: Add form submission tests
});
