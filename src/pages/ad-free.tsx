import { Inter } from 'next/font/google'
import AdSlot from '@/components/ad-slot'
import AdContextProvider from '@/components/ad-context-provider'
import RequestAds from '@/components/request-ads'

const inter = Inter({ subsets: ['latin'] })

export default function AdFree() {
  return (
    <main className={inter.className}>
      <AdContextProvider>
        <h1 className="text-center text-2xl font-semibold">Just Kidding!</h1>
        <div className="flex flex-row justify-center mt-4">
          <AdSlot id="ad-free-1" path="/6355419/Travel" size="728x90" targeting={{ test: 'event' }} />
        </div>
        <p className="mt-8 text-center">Lorem ipsum dolor sit amet...</p>
        <RequestAds />
      </AdContextProvider>
    </main>
  )
}
