import { render } from '@testing-library/react';

import Layout from '../Layout';

describe('Layout component', () => {
  it('renders basic layout with Nav, children, Footer', () => {
    const { getByText } = render(
      <Layout>
        <p>children</p>
      </Layout>
    );

    const children = getByText('children');

    expect(children.parentElement.childElementCount).toBe(3);
  });
});
