import { Inter } from 'next/font/google'
import AdSlot from '@/components/ad-slot'
import AdContextProvider from '@/components/ad-context-provider'
import RequestAds from '@/components/request-ads'
import { AdSlotSize } from '@/components/ad-slot-sizes'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const path = '/6355419/Travel/Europe/France/Paris'
  const sizes: AdSlotSize[] = [
    '300x50',
    '300x250',
    '728x90',
    '320x50',
    '970x250',
    'fluid',
    '300x600',
    '320x420',
    'responsiveExample',
  ]
  return (
    <main className={inter.className}>
      <AdContextProvider>
        <h1 className="text-center text-2xl font-semibold">All Sizes</h1>
        <div className="flex flex-col items-center justify-center mt-4 gap-4">
          {sizes.map((size, index) => (
            <AdSlot key={size} id={`all-sizes-${index++}`} path={path} size={size} />
          ))}
        </div>
        <p className="mt-8 text-center">Lorem ipsum...</p>
        <RequestAds />
      </AdContextProvider>
    </main>
  )
}
