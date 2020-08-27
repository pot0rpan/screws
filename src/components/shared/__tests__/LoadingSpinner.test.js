import { render } from '@testing-library/react';

import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner component', () => {
  it('renders a basic spinner element', () => {
    const { getByTestId } = render(<LoadingSpinner />);

    const spinner = getByTestId('loading-spinner');
    const container = spinner.parentElement;

    expect(container).not.toHaveClass('overlay');
    expect(container).not.toHaveClass('dim-background');
  });

  it('renders an overlay spinner element', () => {
    const { getByTestId } = render(<LoadingSpinner asOverlay />);

    const spinner = getByTestId('loading-spinner');
    const overlay = spinner.parentElement;
    expect(overlay).toHaveClass('overlay');
    expect(overlay).toHaveStyle('position: absolute');
  });

  it('renders an overlay spinner element with dim background', () => {
    const { getByTestId } = render(<LoadingSpinner asOverlay dimBackground />);

    const spinner = getByTestId('loading-spinner');
    const overlay = spinner.parentElement;

    expect(overlay).toHaveClass('overlay');
    expect(overlay).toHaveClass('dim-background');

    expect(overlay).toHaveStyle('position: absolute');
    expect(overlay).toHaveStyle('background: rgba(0, 0, 0, 0.4)');
  });
});
