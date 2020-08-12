import { ImgHTMLAttributes } from 'react';
import QRCode from 'qrcode-svg';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  data: string;
}

const QRCodeGenerator: React.FC<Props> = ({ data, alt, ...rest }) => {
  const qrSvg = new QRCode({
    background: 'transparent',
    color: '#00e2bc',
    container: 'svg-viewbox',
    content: data,
    join: true,
    xmlDeclaration: false,
  }).svg();

  return (
    <div className="container">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
        title={data}
        alt={alt || `QR code representing ${data}`}
        {...rest}
      />
      <style jsx>
        {`
          .container {
            border: var(--border-width) solid var(--primary);
            height: auto;
            margin: 1.5rem;
            width: 100%;
          }
          .container img {
            display: block;
            height: 100%;
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default QRCodeGenerator;
