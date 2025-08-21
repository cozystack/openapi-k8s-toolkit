import React, { createContext, useContext } from 'react'

type Theme = 'light' | 'dark'
type ThemeInput = Theme | { theme: Theme } | undefined

// Normalize any accepted input to a plain Theme string
const normalizeTheme = (value: ThemeInput): Theme => (typeof value === 'string' ? value : value?.theme ?? 'light')

// 🔧 Context now stores a string, not an object
const Ctx = createContext<Theme>('light')

// Accept both the old `{ theme: '...' }` shape and the new plain string
export const ThemeProvider: React.FC<React.PropsWithChildren<{ value?: ThemeInput }>> = ({
  value = 'light',
  children,
}) => <Ctx.Provider value={normalizeTheme(value)}>{children}</Ctx.Provider>

// 🔧 Hook returns the string directly
export const useTheme = () => useContext(Ctx)
