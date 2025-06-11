import React, { FC, createContext, useContext, ReactNode } from 'react'

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
