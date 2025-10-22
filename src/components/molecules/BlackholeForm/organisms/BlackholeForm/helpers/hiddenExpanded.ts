/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFormName } from 'localTypes/form'
import { wdbg, wgroup, wend, prettyPath } from './debugs'

// --- expanded and hidden paths wildcards

// Turn weird segments (numbers, numeric strings, objects) into '*' wildcards
export const sanitizeWildcardPath = (p: (string | number | unknown)[]) => {
  const out = p.map(seg => {
    if (seg === '*') return '*' // keep explicit wildcard as-is
    if (typeof seg === 'number') return '*'
    if (typeof seg === 'string') return /^\d+$/.test(seg) ? '*' : seg
    return '*'
  })
  wdbg('sanitize →', p, '=>', out)
  return out
}
const isPlainObj = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

// Expand a single wildcard template against a subtree of values
const expandOneTemplate = (
  tpl: (string | number)[],
  node: unknown,
  base: (string | number)[] = [],
  out: (string | number)[][] = [],
) => {
  wgroup(`expand tpl=${prettyPath(tpl)} from base=${prettyPath(base)}`)

  const step = (i: number, curr: unknown, path: (string | number)[]) => {
    wdbg('step', {
      i,
      seg: tpl[i],
      path,
      nodeType: Array.isArray(curr)
        ? 'array'
        : isPlainObj(curr)
        ? 'object'
        : curr === undefined
        ? 'undefined'
        : typeof curr,
    })

    if (i === tpl.length) {
      wdbg('✔ hit', prettyPath(path))
      out.push(path)
      return
    }
    const seg = tpl[i]

    if (seg === '*') {
      if (Array.isArray(curr)) {
        wdbg('  wildcard over array indices 0..', curr.length - 1)
        for (let idx = 0; idx < curr.length; idx++) {
          step(i + 1, curr[idx], [...path, idx])
        }
      } else if (isPlainObj(curr)) {
        const keys = Object.keys(curr)
        wdbg('  wildcard over object keys', keys)
        for (const k of keys) {
          step(i + 1, (curr as any)[k], [...path, k])
        }
      } else {
        wdbg('  wildcard dead-end (not array/object)')
      }
      return
    }

    // concrete key
    if (isPlainObj(curr) && seg in (curr as any)) {
      wdbg('  descend object key', seg)
      step(i + 1, (curr as any)[seg as any], [...path, seg])
    } else if (Array.isArray(curr) && typeof seg === 'number' && curr[seg] !== undefined) {
      wdbg('  descend array index', seg)
      step(i + 1, curr[seg], [...path, seg])
    } else {
      wdbg('  dead-end at concrete seg', seg)
    }
  }

  step(0, node, base)
  wend()
  return out
}

// Expand many templates, ensure uniqueness (by JSON stringified key)
export const expandWildcardTemplates = (
  templates: (string | number)[][],
  values: Record<string, unknown>,
  opts?: { includeMissingExact?: boolean }, // NEW (default undefined/false)
): (string | number)[][] => {
  wgroup('expand templates')
  templates.forEach((t, i) => wdbg(`#${i}`, prettyPath(t)))

  const acc: (string | number)[][] = []
  const seen = new Set<string>()

  for (const tpl of templates) {
    const hits = expandOneTemplate(tpl, values)

    // push all normal matches first (old behavior)
    for (const p of hits) {
      const k = JSON.stringify(p)
      if (!seen.has(k)) {
        seen.add(k)
        acc.push(p)
      }
    }

    // only for HIDDEN (when caller opts in):
    if (!hits.length && opts?.includeMissingExact && !tpl.some(seg => seg === '*')) {
      const k = JSON.stringify(tpl)
      if (!seen.has(k)) {
        wdbg('no hits; include exact (no "*") →', prettyPath(tpl))
        seen.add(k)
        acc.push(tpl)
      }
    }
  }

  wdbg('expanded →', acc.map(prettyPath))
  wend()
  return acc
}

// narrow to the array case
const isPathArray = (p: TFormName): p is (string | number)[] => Array.isArray(p)

export const toStringPath = (p: TFormName): string[] =>
  isPathArray(p) ? (p as (string | number)[]).map(String) : [String(p)]
