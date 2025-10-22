/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const DEBUG_PREFILLS = false

export const dbg = (...args: any[]) => {
  if (DEBUG_PREFILLS) console.log('[prefill]', ...args)
}
export const group = (label: string) => DEBUG_PREFILLS && console.groupCollapsed('[prefill]', label)
export const end = () => DEBUG_PREFILLS && console.groupEnd()

const DEBUG_WILDCARDS = false

export const wdbg = (...args: any[]) => {
  if (DEBUG_WILDCARDS) console.log('[wildcards]', ...args)
}
export const wgroup = (label: string) => DEBUG_WILDCARDS && console.groupCollapsed('[wildcards]', label)
export const wend = () => DEBUG_WILDCARDS && console.groupEnd()

export const prettyPath = (arr: (string | number)[]) => arr.map(s => (s === '*' ? '*' : String(s))).join('.')
