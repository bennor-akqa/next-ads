import { Inter } from 'next/font/google'
import AdSlot from '@/components/ad-slot'
import AdContextProvider from '@/components/ad-context-provider'
import RequestAds from '@/components/request-ads'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={inter.className}>
      <AdContextProvider>
        <h1 className="text-center text-2xl font-semibold">Home</h1>
        <div className="flex flex-row justify-center mt-4">
          <AdSlot id="home-1" path="/6355419/Travel/Europe/France/Paris" size="banner" />
        </div>
        <p className="mt-8 text-center">Homepage content</p>
        <RequestAds />
      </AdContextProvider>
    </main>
  )
}
