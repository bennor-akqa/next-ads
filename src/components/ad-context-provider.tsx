import { Dispatch, useEffect, useReducer, useRef, useState } from 'react'
import createGenericContext from './context'
import { ADS_ENABLED } from './constants'

interface AdContext {
  disableAds: boolean
  initialized: boolean
  /** Current ad slots */
  adSlots: googletag.Slot[]
  /** On slot change handler */
  onAdSlotUpdate: Dispatch<AdSlotAction>
}

const context = createGenericContext<'Ad', AdContext>('Ad')
export const { useAdContext } = context

interface AdSlotsState {
  slotMap: Record<string, googletag.Slot>
  slots: googletag.Slot[]
}

type AddSlotAction = {
  type: 'add'
  id: string
  slot: googletag.Slot
}

type RemoveSlotAction = {
  type: 'remove'
  id: string
}

export type AdSlotAction = AddSlotAction | RemoveSlotAction

function adSlotReducer(previous: AdSlotsState, action: AdSlotAction): AdSlotsState {
  switch (action.type) {
    case 'add': {
      const slotMap = { ...previous.slotMap, [action.id]: action.slot }
      return {
        slotMap,
        slots: Array.from(Object.values(slotMap)),
      }
    }
    case 'remove': {
      const slotMap = { ...previous.slotMap }
      delete slotMap[action.id]
      return {
        slotMap,
        slots: Array.from(Object.values(slotMap)),
      }
    }
  }
}

interface AdContextProviderProps {
  disableAds?: boolean
  targeting?: Record<string, string>
  children: React.ReactNode
}

function AdContextProvider({ disableAds = false, targeting = {}, children }: AdContextProviderProps) {
  const [{ slots }, onAdSlotUpdate] = useReducer(adSlotReducer, {
    slotMap: {},
    slots: [],
  })
  const targetingRef = useRef(targeting)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    console.debug(`AdContextProvider: configuring`)
    googletag.cmd.push(() => {
      if (targetingRef.current) {
        for (const [key, value] of Object.entries(targetingRef.current)) {
          googletag.pubads().setTargeting(key, value)
        }
      }
    })

    function cleanup() {
      console.debug('AdContextProvider: clearing targeting')
      googletag.pubads().clearTargeting()
    }

    setInitialized(true)

    return () => {
      console.debug(`AdContextProvider: cleaning up`)
      setInitialized(false)
      googletag.cmd.push(cleanup)
    }
  }, [])

  return (
    <context.AdContextProvider value={{ disableAds, initialized, adSlots: slots, onAdSlotUpdate }}>
      {children}
    </context.AdContextProvider>
  )
}

export default ADS_ENABLED ? AdContextProvider : () => <></>
