import { render } from '@testing-library/react';

import DbStats from '../DbStats';

const defaultStats = {
  ok: false,
  name: '?.?',
  count: -1,
  size: -1,
  allocatedSize: -1,
  avgObjSize: -1,
};

describe('DbStats component', () => {
  it('renders list of placeholder `?` if stats are set to initial state', async () => {
    const { getAllByText } = render(<DbStats stats={defaultStats} />);

    expect(getAllByText(/\?/).length).toBe(6);
  });

  it('renders actual stat data if provided', () => {
    const stats = {
      ok: true,
      name: 'database.collection',
      count: 1234,
      size: 12345,
      allocatedSize: 23456,
      avgObjSize: 123,
    };

    const { getByText } = render(<DbStats stats={stats} />);

    expect(getByText(/number of urls/i).nextSibling.textContent).toBe(
      '' + stats.count
    );
    expect(getByText(/database name/i).nextSibling.textContent).toBe(
      stats.name.split('.')[0]
    );
    expect(getByText(/collection name/i).nextSibling.textContent).toBe(
      stats.name.split('.')[1]
    );
    expect(getByText(/collection usage/i).nextSibling.textContent).toBe(
      `${stats.size} B`
    );
    expect(getByText(/allocated size/i).nextSibling.textContent).toBe(
      `${stats.allocatedSize} B`
    );
    expect(getByText(/object size/i).nextSibling.textContent).toBe(
      `${stats.avgObjSize} B`
    );
  });
});
