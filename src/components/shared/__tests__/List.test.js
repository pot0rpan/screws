import { render } from '@testing-library/react';

import List from '../List';

describe('List component', () => {
  it('renders a basic List', () => {
    const items = [
      { title: 'title1', description: 'description1' },
      { title: 'title2', description: 'description2' },
    ];
    const { getByText } = render(<List items={items} />);

    const listItem = getByText(items[0].title);
    const list = listItem.parentElement;

    expect(list.childElementCount).toBe(2);
  });
});
