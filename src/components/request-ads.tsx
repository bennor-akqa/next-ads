import { useEffect } from 'react'
import { useAdContext } from './ad-context-provider'

export default function RequestAds() {
  const { disableAds, initialized, adSlots } = useAdContext()
  const isActive = initialized && !disableAds
  useEffect(() => {
    googletag.cmd.push(() => {
      if (!adSlots.length) {
        console.debug('RequestAds: No ads to refresh')
        return
      }
      console.debug(
        'RequestAds: Refreshing ads',
        adSlots.map((s) => s.getSlotElementId()),
      )
      const interstitial = adSlots.find((s) => s.getSlotElementId() === 'interstitial')
      if (interstitial) {
        googletag.display(interstitial)
      }
      googletag.pubads().refresh(adSlots)
    })
  }, [isActive, adSlots])

  return <></>
}
