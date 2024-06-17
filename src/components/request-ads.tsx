import { useEffect } from 'react'
import { useAdContext } from './ad-context-provider'
import { getAdSlots } from './ad-slots-cache'

export default function RequestAds() {
  const { disableAds, initialized } = useAdContext()
  const isActive = initialized && !disableAds
  useEffect(() => {
    googletag.cmd.push(() => {
      // Request ads for all ad slots defined up to this point.
      //
      // In many real world scenarios, requesting ads for *all*
      // slots is not optimal. Instead, care should be taken to
      // only refresh newly added/updated slots.
      const adSlots = getAdSlots()
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
  }, [isActive])

  return <></>
}
