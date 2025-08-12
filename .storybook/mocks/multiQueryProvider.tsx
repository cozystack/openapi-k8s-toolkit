import React, { createContext, useContext } from 'react'

type ErrorLike = { message: string }
type MultiQueryValue = {
  data: Record<string, unknown> | null
  isLoading: boolean
  isError: boolean
  errors: (ErrorLike | null | undefined)[]
}

const Ctx = createContext<MultiQueryValue>({
  data: null,
  isLoading: false,
  isError: false,
  errors: [],
})

export const MultiQueryMockProvider: React.FC<React.PropsWithChildren<{ value: Partial<MultiQueryValue> }>> = ({
  value,
  children,
}) => {
  const merged: MultiQueryValue = {
    data: null,
    isLoading: false,
    isError: false,
    errors: [],
    ...value,
  }
  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>
}

export const useMultiQuery = () => useContext(Ctx)
