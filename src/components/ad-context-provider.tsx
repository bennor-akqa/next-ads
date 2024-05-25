import { useEffect, useRef, useState } from 'react'
import createGenericContext from './context'
import { AD_MANAGER_ACCOUNT_ID } from './constants'

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
    if (!AD_MANAGER_ACCOUNT_ID) {
      return
    }
    console.debug(`AdContextProvider: configuring`)
    googletag.cmd.push(() => {
      if (targetingRef.current) {
        for (const [key, value] of Object.entries(targetingRef.current)) {
          googletag.pubads().setTargeting(key, value)
        }
      }
      googletag.enableServices()
    })

    function cleanup() {
      console.debug(`AdContextProvider: cleaning up`)
      googletag.pubads().clearTargeting()
      setInitialized(false)
    }

    setInitialized(true)

    return () => {
      googletag.cmd.push(cleanup)
    }
  }, [])

  return <context.AdContextProvider value={{ disableAds, initialized }}>{children}</context.AdContextProvider>
}

export default AdContextProvider
