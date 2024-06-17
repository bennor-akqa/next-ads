import { CSSProperties, useEffect, useRef } from 'react'
import { useAdContext } from './ad-context-provider'
import { ADS_ENABLED } from './constants'

const AD_SLOT_SIZES = {
  fluid: 'fluid',
  leaderboard: [728, 90],
  banner: [300, 250],
} as const satisfies Record<string, googletag.SingleSize>

export type AdSlotSize = keyof typeof AD_SLOT_SIZES

const AD_SLOT_STYLES = Object.fromEntries(
  Object.entries(AD_SLOT_SIZES).map(([key, value]) => [
    key,
    value !== 'fluid' ? { width: `${value[0]}px`, height: `${value[1]}px` } : undefined,
  ]),
) as Record<AdSlotSize, CSSProperties | undefined>

export interface AdSlotProps {
  id: string
  path: string
  size: AdSlotSize
  targeting?: Record<string, string>
}

const adSlots = new Map<string, googletag.Slot>()

export function getAdSlotsInternal() {
  return Array.from(adSlots.values())
}

interface UseAdSlotOptions extends AdSlotProps {
  isActive: boolean
}

function useAdSlot({ id, path, size, targeting, isActive }: UseAdSlotOptions) {
  const targetingRef = useRef(targeting)
  targetingRef.current = targeting

  useEffect(() => {
    if (!isActive) return

    console.debug('AdSlot: mount', id)

    let slot: googletag.Slot | undefined
    googletag.cmd.push(() => {
      // Define an ad slot for div with id
      console.debug('AdSlot: defining slot', id, path, size)
      slot = googletag.defineSlot(path, AD_SLOT_SIZES[size], id)?.addService(googletag.pubads())
      if (!slot) return

      if (targetingRef.current) {
        for (const [key, value] of Object.entries(targetingRef.current)) {
          slot.setTargeting(key, value)
        }
      }

      console.debug(`AdSlot: displaying slot`, id)
      googletag.display(slot)

      adSlots.set(id, slot)
    })

    function destroySlot() {
      console.debug(`AdSlot: destroying slot`, id)
      adSlots.delete(id)
      slot && googletag.destroySlots([slot])
    }

    return () => {
      console.debug('AdSlot: unmount', id)
      googletag.cmd.push(destroySlot)
    }
  }, [id, isActive, path, size])
}

function AdSlot(props: AdSlotProps) {
  const id = `ad-slot-${props.id}`
  const { disableAds, initialized } = useAdContext()
  const isActive = initialized && !disableAds
  const renderContainer = !disableAds
  useAdSlot({ ...props, id, isActive })

  return renderContainer ? <div id={id} style={AD_SLOT_STYLES[props.size]}></div> : <></>
}

export default ADS_ENABLED ? AdSlot : () => <></>
