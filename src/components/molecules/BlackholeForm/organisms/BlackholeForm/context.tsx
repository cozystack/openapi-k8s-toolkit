import React, { FC, createContext, useContext, ReactNode, useState } from 'react'

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

/* onValuesChangeCallbackProvider */
const OnValuesChangeCallbackContext = createContext<(() => void) | undefined>(undefined)

type TOnValuesChangeCallbackProviderProps = {
  value?: () => void
  children: ReactNode
}

export const OnValuesChangeCallbackProvider: FC<TOnValuesChangeCallbackProviderProps> = ({ value, children }) => (
  <OnValuesChangeCallbackContext.Provider value={value}>{children}</OnValuesChangeCallbackContext.Provider>
)

export const useOnValuesChangeCallback = (): (() => void) | undefined => {
  return useContext(OnValuesChangeCallbackContext)
}

/* is touched but peristed */
const IsTouchedPersistedContext = createContext<Record<string, boolean>>({})

const IsTouchedPersistedDispatchContext = createContext<
  React.Dispatch<React.SetStateAction<Record<string, boolean>>> | undefined
>(undefined)

type TIsTouchedPersistedProviderProps = {
  value: Record<string, boolean>
  children: ReactNode
}

export const IsTouchedPersistedProvider: FC<TIsTouchedPersistedProviderProps> = ({ value, children }) => {
  const [state, setState] = useState<Record<string, boolean>>(value)

  return (
    <IsTouchedPersistedContext.Provider value={state}>
      <IsTouchedPersistedDispatchContext.Provider value={setState}>
        {children}
      </IsTouchedPersistedDispatchContext.Provider>
    </IsTouchedPersistedContext.Provider>
  )
}

export const useIsTouchedPersisted = (): Record<string, boolean> => {
  return useContext(IsTouchedPersistedContext)
}

export const useUpdateIsTouchedPersisted = (): React.Dispatch<React.SetStateAction<Record<string, boolean>>> => {
  const dispatch = useContext(IsTouchedPersistedDispatchContext)

  if (!dispatch) {
    throw new Error('useUpdateIsTouchedPersisted must be used within a IsTouchedPersistedProvider')
  }
  return dispatch
}
