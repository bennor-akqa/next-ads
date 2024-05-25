import AdScript from '@/components/ad-script'
import { AD_MANAGER_ACCOUNT_ID } from '@/components/constants'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {AD_MANAGER_ACCOUNT_ID ? (
          <>
            <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
            <script>{`window.googletag = window.googletag || {cmd: []}`}</script>
          </>
        ) : (
          <></>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
