import React, { createContext, useContext } from 'react'

type PartsOfUrlValue = {
  partsOfUrl: string[]
}

const Ctx = createContext<PartsOfUrlValue>({ partsOfUrl: [] })

export const PartsOfUrlMockProvider: React.FC<React.PropsWithChildren<{ value?: PartsOfUrlValue }>> = ({
  value = { partsOfUrl: [] },
  children,
}) => <Ctx.Provider value={value}>{children}</Ctx.Provider>

export const usePartsOfUrl = () => useContext(Ctx)
