import { useEffect, useRef } from 'react'
import { useAdContext } from './ad-context-provider'
import { ADS_ENABLED } from './constants'
import { getAdSlotSize, AdSlotSize, getAdSlotStyle } from './ad-slot-sizes'

export interface AdSlotProps {
  id: string
  path: string
  size: AdSlotSize
  targeting?: Record<string, string | string[]>
}

interface UseAdSlotOptions extends AdSlotProps {
  isActive: boolean
}

function useAdSlot({ id, path, size, targeting, isActive }: UseAdSlotOptions) {
  const { onAdSlotUpdate } = useAdContext()
  const targetingRef = useRef(targeting)
  targetingRef.current = targeting

  useEffect(() => {
    if (!isActive) return

    console.debug('AdSlot: mount', id)

    let slot: googletag.Slot | undefined
    googletag.cmd.push(() => {
      // Define an ad slot for div with id
      console.debug('AdSlot: defining slot', id, path, size)

      const { size: generalSize, sizeMapping } = getAdSlotSize(size)
      console.log(path, generalSize, id)
      slot = googletag.defineSlot(path, generalSize, id)?.addService(googletag.pubads())
      if (!slot) return

      if (sizeMapping) {
        slot.defineSizeMapping(sizeMapping)
      }

      if (targetingRef.current) {
        for (const [key, value] of Object.entries(targetingRef.current)) {
          slot.setTargeting(key, value)
        }
      }

      console.debug(`AdSlot: displaying slot`, id)
      googletag.display(slot)

      onAdSlotUpdate({ type: 'add', id, slot })
    })

    function destroySlot() {
      console.debug(`AdSlot: destroying slot`, id)
      slot && googletag.destroySlots([slot])
    }

    return () => {
      console.debug('AdSlot: unmount', id)
      onAdSlotUpdate({ type: 'remove', id })
      googletag.cmd.push(destroySlot)
    }
  }, [id, isActive, onAdSlotUpdate, path, size])
}

function AdSlot(props: AdSlotProps) {
  const id = `ad-slot-${props.id}`
  const { disableAds, initialized } = useAdContext()
  const isActive = initialized && !disableAds
  const renderContainer = !disableAds
  useAdSlot({ ...props, id, isActive })

  return renderContainer ? (
    <div id={id} className="relative" style={getAdSlotStyle(props.size)}>
      <AdPlaceholder />
    </div>
  ) : (
    <></>
  )
}

export default ADS_ENABLED ? AdSlot : () => <></>

function AdPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 select-none text-xs">
      Ad
    </div>
  )
}
