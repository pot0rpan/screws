import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

import { blockingDisableReactDevTools } from '../utils';

class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="/site.webmanifest" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00e2bc" />
          <meta name="apple-mobile-web-app-title" content="Screws" />
          <meta name="application-name" content="Screws" />
          <meta name="msapplication-TileColor" content="#150322" />
          <meta name="theme-color" content="#00e2bc" />
        </Head>
        <body>
          {process.env.NODE_ENV === 'production' ? (
            <script
              dangerouslySetInnerHTML={{
                __html: blockingDisableReactDevTools,
              }}
            ></script>
          ) : null}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
