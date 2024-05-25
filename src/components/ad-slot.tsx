import { CSSProperties, useEffect, useRef } from 'react'
import { useAdContext } from './ad-context-provider'
import { AD_MANAGER_ACCOUNT_ID } from './constants'

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

function AdSlot({ id, path, size, targeting }: AdSlotProps) {
  const slotRef = useRef<googletag.Slot | null>()
  const targetingRef = useRef(targeting)

  useEffect(() => {
    console.debug(`AdSlot: creating slot \`${id}\``)
    googletag.cmd.push(() => {
      // Define an ad slot for div with id "banner-ad".
      slotRef.current = googletag
        .defineSlot(`/${AD_MANAGER_ACCOUNT_ID}/${path.replace(/^\//, '')}`, AD_SLOT_SIZES[size], id)
        ?.addService(googletag.pubads())

      if (targetingRef.current) {
        for (const [key, value] of Object.entries(targetingRef.current)) {
          slotRef.current?.setTargeting(key, value)
        }
      }

      googletag.cmd.push(() => {
        console.debug(`AdSlot: displaying slot \`${id}\``)
        slotRef.current && googletag.display(slotRef.current)
      })
    })

    function destroySlot() {
      console.debug(`AdSlot: destroying slot \`${id}\``)
      slotRef.current && googletag.destroySlots([slotRef.current])
    }

    return () => {
      slotRef.current && googletag.cmd.push(destroySlot)
    }
  }, [id, path, size])

  return <div id={id} style={AD_SLOT_STYLES[size]}></div>
}

function AdSlotWrapper(props: AdSlotProps) {
  const { disableAds, initialized } = useAdContext()
  console.debug('AdSlot: ads', disableAds ? 'disabled' : 'enabled', initialized ? 'initialized' : 'not initialized')
  const renderAds = !disableAds && initialized && !!AD_MANAGER_ACCOUNT_ID
  return renderAds ? <AdSlot {...props} /> : <></>
}

export default AdSlotWrapper
