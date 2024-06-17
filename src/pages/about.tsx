import { Inter } from 'next/font/google'
import AdSlot from '@/components/ad-slot'
import AdContextProvider from '@/components/ad-context-provider'
import RequestAds from '@/components/request-ads'

const inter = Inter({ subsets: ['latin'] })

export default function About() {
  return (
    <main className={inter.className}>
      <AdContextProvider>
        <h1 className="text-center text-2xl font-semibold">About</h1>
        <div className="flex flex-row justify-center mt-4">
          <AdSlot id="about-1" path="/6355419/Travel/Europe/France/Paris" size="300x250" />
        </div>
        <div className="flex flex-row justify-center mt-4">
          <AdSlot id="about-2" path="/6355419/Travel/Europe/France/Paris" size="300x250" />
        </div>
        <p className="mt-8 text-center">Lorem ipsum dolor sit amet...</p>
        <RequestAds />
      </AdContextProvider>
    </main>
  )
}
