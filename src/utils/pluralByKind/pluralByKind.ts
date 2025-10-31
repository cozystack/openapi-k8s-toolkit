import { TKindWithVersion } from 'localTypes/search'

type ApiVersion = string // "group/version" or "v1" for core

// Parse "apps/v1" -> { group: "apps", version: "v1" }
// Parse "v1"      -> { group: "",     version: "v1" }  (core)
const parseApiVersion = (apiVersion: ApiVersion) => {
  const parts = apiVersion.trim().split('/')
  return parts.length === 1 ? { group: '', version: parts[0] } : { group: parts[0], version: parts[1] }
}

/**
 * Build a lookup function: given (kind, apiVersion?) return the plural resource.
 * - apiVersion can be "group/version" or just "v1" for core.
 * - If apiVersion is omitted, we return the plural for the preferred version of that kind.
 * - Returns undefined if not uniquely determined.
 */
export const pluralByKind =
  (entries: readonly TKindWithVersion[]) =>
  (kind: string, apiVersion?: ApiVersion): string | undefined => {
    const norm = (s: string) => s.trim()
    const kindNorm = norm(kind)

    // If apiVersion is provided, use it; otherwise we’ll consider all versions and prefer `preferred:true`.
    const gv = apiVersion ? parseApiVersion(apiVersion) : undefined

    const candidates = entries.filter(e => norm(e.kind) === kindNorm)

    if (candidates.length === 0) return undefined

    const filtered = gv
      ? candidates.filter(e => norm(e.group) === norm(gv.group) && e.version.version === gv.version)
      : candidates

    if (filtered.length === 0) return undefined

    // If version wasn’t specified, prefer entries where the version is marked preferred.
    const preferredFirst = gv
      ? filtered
      : [...filtered.filter(e => e.version.preferred), ...filtered.filter(e => !e.version.preferred)]

    // Collect plural resource names
    const resources = preferredFirst.map(e => e.version.resource).filter(Boolean)
    const uniq = Array.from(new Set(resources))

    // If we didn’t specify a version and multiple distinct resources remain,
    // try to collapse by taking the first (preferred) only.
    if (!gv && uniq.length > 1) {
      const first = preferredFirst[0]?.version.resource
      return first ?? undefined
    }

    return uniq.length === 1 ? uniq[0] : undefined
  }
