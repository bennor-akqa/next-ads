import Script from 'next/script'
import { ADS_ENABLED } from './constants'
import Head from 'next/head'

if (ADS_ENABLED && typeof window !== 'undefined') {
  // Ensure we can interact with the GPT command array.
  window.googletag = window.googletag || { cmd: [] }

  // Prepare GPT to display ads.
  googletag.cmd.push(() => {
    // Disable initial load, to precisely control when ads are requested.
    googletag.pubads().disableInitialLoad()

    // Enable SRA and services.
    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  })
}

export default function AdScript() {
  return ADS_ENABLED ? (
    <>
      <Head>
        <link key="gpt-preload" rel="preload" href="https://securepubads.g.doubleclick.net/tag/js/gpt.js" as="script" />
      </Head>
      <Script strategy="afterInteractive" src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
    </>
  ) : (
    <></>
  )
}
