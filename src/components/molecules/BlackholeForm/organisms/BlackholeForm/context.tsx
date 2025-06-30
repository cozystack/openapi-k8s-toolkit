import React, { FC, createContext, useContext, ReactNode } from 'react'

/* designNewLayout */
const DesignNewLayoutContext = createContext<boolean | undefined>(undefined)

type TDesignNewLayoutProviderProps = {
  value?: boolean
  children: ReactNode
}

export const DesignNewLayoutProvider: FC<TDesignNewLayoutProviderProps> = ({ value, children }) => (
  <DesignNewLayoutContext.Provider value={value}>{children}</DesignNewLayoutContext.Provider>
)

export const useDesignNewLayout = (): boolean | undefined => {
  return useContext(DesignNewLayoutContext)
}

/* hidden paths */
const HiddenPathsContext = createContext<string[][] | undefined>(undefined)

type THiddenPathsProviderProps = {
  value?: string[][]
  children: ReactNode
}

export const HiddenPathsProvider: FC<THiddenPathsProviderProps> = ({ value, children }) => (
  <HiddenPathsContext.Provider value={value}>{children}</HiddenPathsContext.Provider>
)

export const useHiddenPathsLayout = (): string[][] | undefined => {
  return useContext(HiddenPathsContext)
}
