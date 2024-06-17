import AdScript from '@/components/ad-script'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AdScript />
      <nav className="flex flex-row gap-4 justify-center items-center mb-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/ad-free">Ad Free</Link>
      </nav>

      <Component {...pageProps} />
    </>
  )
}
