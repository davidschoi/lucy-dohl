import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="See photos from Lucy's Dohl." />
          <meta property="og:site_name" content="lucysolchoi.com" />
          <meta property="og:description" content="See photos from Lucy's Dohl." />
          <meta property="og:title" content="Lucy's Dohl photos" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Lucy's Dohl photos" />
          <meta name="twitter:description" content="See photos from Lucy's Dohl." />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
