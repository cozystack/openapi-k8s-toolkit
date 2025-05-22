/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useMemo } from 'react'

export const createContextFactory = <TContextValue extends Record<string, unknown>>() => {
  const Context = createContext<TContextValue | null>(null)

  const useTypedContext = () => {
    const context = useContext(Context)
    if (!context) {
      throw new Error('useTypedContext must be used within a Provider')
    }
    return context
  }

  const Provider = ({ children, value }: React.PropsWithChildren<{ value: TContextValue }>) => {
    const memoizedValue = useMemo(() => value, Object.values(value))

    return <Context.Provider value={memoizedValue}>{children}</Context.Provider>
  }

  return {
    Provider,
    useTypedContext,
  }
}
