/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
type PathSeg = string | number

// Find the nearest list item base by taking the prefix up to (and including) the last numeric segment.
// If none, fall back to the parent object (drop last key).
export const listItemBasePath = (fullFieldPath: PathSeg[]): PathSeg[] => {
  for (let i = fullFieldPath.length - 1; i >= 0; i--) {
    if (typeof fullFieldPath[i] === 'number') {
      return fullFieldPath.slice(0, i + 1) // e.g. ["spec","hosts",0]
    }
  }
  return fullFieldPath.slice(0, -1) // no list → parent object
}

// turn "spec.hosts.0.namespace" → ["spec","hosts",0,"namespace"]
const parseDotPath = (dotPath: string): PathSeg[] =>
  dotPath
    .split('.')
    .filter(Boolean)
    .map(seg => (seg.match(/^\d+$/) ? Number(seg) : seg))

export const resolveFormPath = (
  pathInput: string | string[] | undefined,
  basePathForRelative: PathSeg[],
): PathSeg[] => {
  if (!pathInput) return []

  // if it's already an array (from old usage), just return as-is
  if (Array.isArray(pathInput)) return pathInput

  const pathStr = String(pathInput)
  const isRelative = pathStr.startsWith('./') || pathStr.startsWith('../')

  if (!isRelative) {
    // absolute (dot notation)
    return parseDotPath(pathStr)
  }

  // relative: split by "/" then interpret each segment
  let resolved: PathSeg[] = [...basePathForRelative]
  const parts = pathStr.split('/').filter(Boolean) // e.g. ["..", "..", "foo"]

  for (const part of parts) {
    if (part === '.') {
      continue
    }
    if (part === '..') {
      resolved = resolved.slice(0, -1)
      continue
    }
    resolved.push(...parseDotPath(part))
  }

  return resolved
}

// Normalize any antd name → array path
export const normalizeNameToPath = (name: unknown): PathSeg[] =>
  Array.isArray(name) ? (name as PathSeg[]) : [name as string]
