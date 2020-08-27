import { render } from '@testing-library/react';

import NotFound404 from '../NotFound404';

describe('NotFound404 component', () => {
  it('renders 404 content with link to home page', () => {
    const { getByText } = render(<NotFound404 />);

    expect(getByText(/404/)).toBeInTheDocument();
    expect(getByText(/go back/)).toHaveAttribute('href', '/');
  });
});
