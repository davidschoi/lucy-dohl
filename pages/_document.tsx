import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link rel="icon" href="/favicon/favicon.ico" />
          <meta name="description" content="See photos from Lucy's Dohl 5/20/23." />
          <meta property="og:site_name" content="lucysolchoi.com" />
          <meta property="og:description" content="See photos from Lucy's Dohl 5/20/23." />
          <meta property="og:title" content="Lucy's Dohl 5/20/23 photos" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Lucy's Dohl 5/20/23 photos" />
          <meta name="twitter:description" content="See photos from Lucy's Dohl 5/20/23." />
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
