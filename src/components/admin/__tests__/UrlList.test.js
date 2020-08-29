import { render, act } from '@testing-library/react';
import user from '@testing-library/user-event';

import UrlList from '../UrlList';

const mockUrls = [
  {
    _id: '1',
    longUrl: 'https://example.com/one',
    code: 'one',
    isRandomCode: true,
    date: Date.now(),
    expiration: null,
    password: false,
    preview: null,
  },
  {
    _id: '2',
    longUrl: 'https://example.com/two',
    code: 'two',
    isRandomCode: false,
    date: Date.now(),
    expiration: null,
    password: true,
    preview: null,
  },
];

describe('UrlList component', () => {
  it('renders list of urls supplied', async () => {
    const { container } = render(
      <UrlList
        urls={mockUrls}
        selectedCodes={[mockUrls[0].code]}
        setSelectedCodes={() => {}}
      />
    );

    const table = container.firstChild.firstChild;
    expect(table).toBeInTheDocument();

    const thead = table.firstChild;
    expect(thead.childNodes.length).toBe(1);

    const tbody = table.lastChild;
    expect(tbody.childNodes.length).toBe(2);
  });

  it('handles checkbox clicks', async () => {
    const urls = [...mockUrls];
    const setSelectedCodes = jest.fn();

    const { container } = render(
      <UrlList
        urls={urls}
        selectedCodes={['one']}
        setSelectedCodes={setSelectedCodes}
      />
    );

    const table = container.firstChild.firstChild;
    const tbody = table.lastChild;
    expect(tbody.childNodes.length).toBe(2);

    const firstRow = tbody.firstChild;
    const firstCheckbox = firstRow.firstChild.firstChild;

    // Deselect the single checked item
    act(() => {
      user.click(firstCheckbox);
    });
    expect(setSelectedCodes).toBeCalledWith([]);

    // Select all items
    const thead = table.firstChild;
    const headRow = thead.firstChild;
    const headCheckbox = headRow.firstChild.firstChild;

    act(() => {
      user.click(headCheckbox);
    });
    expect(setSelectedCodes).toBeCalledWith(['one', 'two']);
  });
});
