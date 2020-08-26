import { render } from '@testing-library/react';

import OGPreview from '../OGPreview';

describe('OGPreview Component', () => {
  const url = 'https://example.com';

  it('renders a full preview if all data is supplied', () => {
    const data = {
      title: 'Card Title',
      description: 'Card description.',
      image: {
        url: `${url}/image.png`,
        type: 'png',
      },
    };

    const { getByText } = render(<OGPreview data={data} url={url} />);

    expect(getByText(data.title)).toHaveAttribute('href', url);
    expect(getByText(data.description)).toBeInTheDocument();
  });

  it('renders title even if it is the only data supplied', () => {
    const data = {
      title: 'Card Title',
    };

    const { getByText } = render(<OGPreview data={data} url={url} />);
    expect(getByText(data.title)).toHaveAttribute('href', url);
  });

  it('renders description even if it is the only data supplied', () => {
    const data = {
      description: 'Card description.',
    };

    const { getByText } = render(<OGPreview data={data} url={url} />);
    expect(getByText(data.description)).toBeInTheDocument();
  });

  it('renders image even if it is the only data supplied', () => {
    const data = {
      image: {
        url: `${url}/image.png`,
        type: 'png',
      },
    };

    const { getByAltText } = render(<OGPreview data={data} url={url} />);
    expect(getByAltText(`Preview image of ${url}`)).toBeInTheDocument();
  });
});
