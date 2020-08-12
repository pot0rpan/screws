import React from 'react';
import Link from 'next/link';

import { PreviewDataType } from '../types/url';

interface Props {
  data: PreviewDataType;
  url: string;
}

const OGPreview: React.FC<Props> = ({ data, url }) => {
  const { title, description, image } = data;

  return (
    <div className="preview">
      {image?.url ? (
        <div className="image">
          <img src={image.url} alt={`Preview image of ${url}`} />
        </div>
      ) : null}

      {title || description ? (
        <div className="text">
          {title ? (
            <h3 className="accent">
              <Link href={url}>
                <a>{title}</a>
              </Link>
            </h3>
          ) : null}

          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      <style jsx>
        {`
          .preview {
            margin: 0 auto;
            overflow: hidden;
            width: 100%;
          }
          .preview h3 {
            margin-bottom: 0;
          }
          .image img {
            display: block;
            height: auto;
            width: 100%;
          }
          .text {
            padding: 1rem;
            padding-bottom: 0;
          }
          .text > p:last-child {
            margin-bottom: 0;
          }
        `}
      </style>
    </div>
  );
};

export default OGPreview;
