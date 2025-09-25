import { TKindWithVersion } from 'localTypes/search'

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
