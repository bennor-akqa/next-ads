import { useEffect, useRef, useState } from 'react'
import createGenericContext from './context'
import { ADS_ENABLED } from './constants'

interface AdContext {
  disableAds: boolean
  initialized: boolean
}

const context = createGenericContext<'Ad', AdContext>('Ad')
export const { useAdContext } = context

interface AdContextProviderProps {
  disableAds?: boolean
  targeting?: Record<string, string>
  children: React.ReactNode
}

function AdContextProvider({ disableAds = false, targeting = {}, children }: AdContextProviderProps) {
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

  return <context.AdContextProvider value={{ disableAds, initialized }}>{children}</context.AdContextProvider>
}

export default ADS_ENABLED ? AdContextProvider : () => <></>
