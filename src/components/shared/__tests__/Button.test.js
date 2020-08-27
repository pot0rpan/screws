import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import Button from '../Button';

describe('Button component', () => {
  it('renders a basic button using defaults', () => {
    const { getByText } = render(<Button>Test</Button>);
    expect(getByText('Test')).toHaveClass('primary');
  });

  it('renders non-primary button if primary=false', () => {
    const { getByText } = render(<Button primary={false}>Test</Button>);
    expect(getByText('Test')).not.toHaveClass('primary');
  });

  it('successfully passes ButtonHTMLAttributes along', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button onClick={onClick} type="submit">
        Test
      </Button>
    );
    const button = getByText('Test');

    expect(button).toHaveAttribute('type', 'submit');

    user.click(button);

    expect(onClick).toBeCalledTimes(1);
  });
});
