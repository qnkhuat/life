import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
          <link rel="manifest" href="/site.webmanifest"></link>
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"></link>
          <meta name="msapplication-TileColor" content="#da532c"></meta>
          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
