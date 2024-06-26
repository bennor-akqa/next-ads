import { useEffect, useRef } from 'react'
import { useAdContext } from './ad-context-provider'
import { ADS_ENABLED } from './constants'

const INTERSTITIAL_ID = 'interstitial'

export interface InterstitialAdSlotProps {
  path: string
  triggers?: googletag.config.InterstitialConfig['triggers']
  targeting?: Record<string, string | string[]>
}

interface UseInterstitialAdSlotOptions extends InterstitialAdSlotProps {
  isActive: boolean
}

function useInterstitialAdSlot({ path, triggers, targeting, isActive }: UseInterstitialAdSlotOptions) {
  const { onAdSlotUpdate } = useAdContext()
  const targetingRef = useRef(targeting)
  targetingRef.current = targeting

  const { navBar, unhideWindow } = triggers ?? {}

  useEffect(() => {
    if (!isActive) return

    console.debug('InterstitialAdSlot: mount')

    let slot: googletag.Slot | undefined
    googletag.cmd.push(() => {
      // Define an ad slot for div with id
      console.debug('InterstitialAdSlot: defining slot', path)

      slot = googletag
        .defineOutOfPageSlot(path, googletag.enums.OutOfPageFormat.INTERSTITIAL)
        ?.addService(googletag.pubads())
      if (!slot) return

      if (navBar || unhideWindow) {
        slot.setConfig({
          interstitial: {
            triggers: {
              navBar,
              unhideWindow,
            },
          },
        })
      }

      if (targetingRef.current) {
        for (const [key, value] of Object.entries(targetingRef.current)) {
          slot.setTargeting(key, value)
        }
      }

      onAdSlotUpdate({ type: 'add', id: INTERSTITIAL_ID, slot })
    })

    function destroySlot() {
      console.debug(`InterstitialAdSlot: destroying slot`)
      slot && googletag.destroySlots([slot])
    }

    return () => {
      console.debug('InterstitialAdSlot: unmount')
      onAdSlotUpdate({ type: 'remove', id: INTERSTITIAL_ID })
      googletag.cmd.push(destroySlot)
    }
  }, [isActive, navBar, onAdSlotUpdate, path, unhideWindow])
}

function InterstitialAdSlot(props: InterstitialAdSlotProps) {
  const { disableAds, initialized } = useAdContext()
  const isActive = initialized && !disableAds
  useInterstitialAdSlot({ ...props, isActive })

  return <></>
}

export default ADS_ENABLED ? InterstitialAdSlot : () => <></>
