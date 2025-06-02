import React, { FC, useContext, createContext, useMemo, ReactNode } from 'react'
import axios from 'axios'
import { useQueries } from '@tanstack/react-query'

type TDataMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface MultiQueryContextType {
  data: TDataMap
  isLoading: boolean
  isError: boolean
  errors: (Error | null)[]
}

const MultiQueryContext = createContext<MultiQueryContextType | undefined>(undefined)

type TMultiQueryProviderProps = {
  urls: string[]
  children: ReactNode
}

export const MultiQueryProvider: FC<TMultiQueryProviderProps> = ({ urls, children }) => {
  const queries = useQueries({
    queries: urls.map((url, index) => ({
      queryKey: ['multi', index, url],
      queryFn: async () => {
        const response = await axios.get(url)
        return response.data
      },
    })),
  })

  const data: TDataMap = {}
  const errors: (Error | null)[] = []

  queries.forEach((q, i) => {
    data[`req${i}`] = q.data
    errors[i] = q.error ?? null
  })

  const isLoading = queries.some(q => q.isLoading)
  const isError = queries.some(q => q.isError)
  const value = useMemo(
    () => ({ data, isLoading, isError, errors }),
    /*
      We use JSON.stringify(data) and JSON.stringify(errors) as dependencies to safely memoize when values deeply change (since data is a new object every render).
      Alternatively, you could use a deep comparison hook or lodash.isEqual if needed.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(data), isLoading, isError, JSON.stringify(errors)],
  )

  return <MultiQueryContext.Provider value={value}>{children}</MultiQueryContext.Provider>
}

export const useMultiQuery = () => {
  const context = useContext(MultiQueryContext)
  if (!context) {
    throw new Error('useMultiQuery must be used within a MultiQueryProvider')
  }
  return context
}
