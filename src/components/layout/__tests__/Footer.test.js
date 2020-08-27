import { render } from '@testing-library/react';

import Footer from '../Footer';

describe('Footer component', () => {
  it('renders footer links', () => {
    const { getByText } = render(<Footer />);

    expect(getByText(/home/i)).toHaveAttribute('href', '/');
    expect(getByText(/about/i)).toHaveAttribute('href', '/about');
    expect(getByText(/support/i)).toHaveAttribute(
      'href',
      expect.stringMatching(/discord\.gg\/\S+/)
    );
    expect(getByText(/privacy/i)).toHaveAttribute('href', '/about#privacy');
  });
});
