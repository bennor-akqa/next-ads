/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from 'next/script'
import { AD_MANAGER_ACCOUNT_ID } from './constants'

export default function AdScript() {
  return (
    <>
      <Script src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" strategy="beforeInteractive" />
      <Script id="gpt" strategy="beforeInteractive">{`window.googletag = window.googletag || {cmd: []}`}</Script>
    </>
  )
}
