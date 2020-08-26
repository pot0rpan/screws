import { render } from '@testing-library/react';

import QRCodeGenerator from '../QRCodeGenerator';

describe('QRCodeGenerator Component', () => {
  const data = 'test data';

  it('renders a QR code image representing the given data', () => {
    const { getByTitle } = render(<QRCodeGenerator data={data} />);

    expect(getByTitle(data)).toHaveAttribute(
      'alt',
      `QR code representing ${data}`
    );
  });

  it('allows custom `alt` attribute on <img>', () => {
    const customAlt = 'Custom alternative text';

    const { getByTitle } = render(
      <QRCodeGenerator data={data} alt={customAlt} />
    );

    expect(getByTitle(data)).toHaveAttribute('alt', customAlt);
  });
});
