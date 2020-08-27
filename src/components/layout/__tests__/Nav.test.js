import { render } from '@testing-library/react';

import Nav from '../Nav';

describe('Nav component', () => {
  it('renders Nav bar with links', () => {
    const { getByAltText, getByText } = render(<Nav />);

    expect(getByAltText(/logo/i).parentElement).toHaveAttribute('href', '/');
    expect(getByText(/about/i)).toHaveAttribute('href', '/about');
  });
});
