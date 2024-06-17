import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* {AD_MANAGER_ACCOUNT_ID ? (
          <>
            <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
            <script>{`window.googletag = window.googletag || {cmd: []}`}</script>
          </>
        ) : (
          <></>
        )} */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
