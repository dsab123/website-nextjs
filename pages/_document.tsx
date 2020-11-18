import Document, {Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
    // analytics script goes here too
    render() {
        return (
            <Html>
                <Head>
                    <meta property="custom" content="yolo yolo yolo" />
                </Head>
                <body>
                    <Main />
                </body>

                <NextScript />
            </Html>
        )
    }
}