import { Inter } from 'next/font/google'
import AdSlot from '@/components/ad-slot'
import AdContextProvider from '@/components/ad-context-provider'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={inter.className}>
      <AdContextProvider>
        <h1 className="text-center text-2xl font-semibold">Home</h1>
        <div className="flex flex-row justify-center mt-4">
          <AdSlot id="banner-ad" path="/Travel/Europe/France/Paris" size="banner" />
        </div>
        <p className="mt-8 text-center">Homepage content</p>
      </AdContextProvider>
    </main>
  )
}
