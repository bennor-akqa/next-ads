import { Provider, createContext, useContext } from 'react'

type UseNameContext<Name extends string> = `use${Name}Context`

type UseNameContextMap<Name extends string, Value> = {
  [key in UseNameContext<Name>]: () => Value
}

type NameContextProvider<Name extends string> = `${Name}ContextProvider`

type NameContextProviderMap<Name extends string, Value> = {
  [key in NameContextProvider<Name>]: Provider<Value>
}

type GenericContext<Name extends string, Value> = UseNameContextMap<Name, Value> & NameContextProviderMap<Name, Value>

/**
 * Generates a generic context for a given name and value.
 * Note: `Name` must be a string lieral, and `Value` must be an object. If no default value is provided,
 * an exception will be thrown by the hook unless the consumer has been wrapped in a provider.
 *
 * @param {Name} name - the name for the context
 * @param {() => Value} defaultValue - optional function to provide default value
 * @return {GenericContext<Name, Value>} an object containing context hook and provider,
 * as `use${Name}` and `${Name}Provider` respectively.
 */
export default function createGenericContext<Name extends string, Value>(
  name: Name,
  defaultValue?: () => Value,
): GenericContext<Name, Value> {
  const useNameContext = `use${name}Context`
  const nameContextProvider = `${name}ContextProvider`
  const context = createContext<Value | undefined>(defaultValue?.())

  return {
    [useNameContext]: () => {
      const value = useContext(context)
      if (!value) {
        throw new Error(`${useNameContext} must be used within a ${nameContextProvider}`)
      }
      return value
    },
    [nameContextProvider]: context.Provider,
  } as GenericContext<Name, Value>
}
