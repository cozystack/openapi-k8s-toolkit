import { useRef } from 'react'
import { TKindWithVersion } from 'localTypes/search'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <T extends (...args: any[]) => void>(fn: T, delay = 300) => {
  const timer = useRef<number | undefined>(undefined)
  return (...args: Parameters<T>) => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => fn(...args), delay)
  }
}

// Convert between array<string> and a single comma-separated query param.
export const getArrayParam = (sp: URLSearchParams, key: string): string[] => {
  const raw = sp.get(key)
  if (!raw) return []
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

export const setArrayParam = (sp: URLSearchParams, key: string, values: string[] | undefined | null) => {
  const next = new URLSearchParams(sp) // preserve other params
  if (!values || values.length === 0) {
    next.delete(key)
  } else {
    next.set(key, values.join(','))
  }
  return next
}

export const getStringParam = (sp: URLSearchParams, key: string): string => {
  return sp.get(key) ?? ''
}

export const setStringParam = (sp: URLSearchParams, key: string, value: string | undefined | null) => {
  const next = new URLSearchParams(sp) // preserve other params
  const v = (value ?? '').trim()
  if (!v) next.delete(key)
  else next.set(key, v)
  return next
}

/**
 * Build a lookup function: given "group~version~resource" return the unique kind.
 * Functional, side-effect free, and tolerant of empty group (e.g. "~v1~bindings").
 */
export const kindByGvr =
  (entries: readonly TKindWithVersion[]) =>
  (gvr: string): string | undefined => {
    const [group = '', v = '', resource = ''] = gvr.split('~', 3)

    // normalize core-group as empty string for consistent matching
    const norm = (s: string) => s.trim()

    const kinds = entries
      .filter(e => norm(e.group) === norm(group) && e.version.version === v && e.version.resource === resource)
      .map(e => e.kind)

    // ensure uniqueness of kind result
    const uniq = Array.from(new Set(kinds))
    return uniq.length === 1 ? uniq[0] : undefined
  }
