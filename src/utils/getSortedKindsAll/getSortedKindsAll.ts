import { TKindIndex, TVersionEntry } from 'localTypes/bff/search'
import { TKindWithVersion } from 'localTypes/search'

// --- helpers ---
const parseK8sVersion = (raw: string) => {
  const m = /^v(?<major>\d+)(?:(?<stage>alpha|beta)(?<stageNum>\d+)?)?$/i.exec(raw ?? '')
  if (!m?.groups) return { rank: 0, major: -1, stageNum: -1 as number }
  const stage = (m.groups.stage ?? '').toLowerCase()
  const major = Number(m.groups.major)
  const stageNum = m.groups.stageNum ? Number(m.groups.stageNum) : 0
  // stable > beta > alpha
  // eslint-disable-next-line no-nested-ternary
  const rank = stage === '' ? 3 : stage === 'beta' ? 2 : 1
  return { rank, major, stageNum }
}

const versionToken = (e: TVersionEntry) => e.version || (e.groupVersion?.split('/').pop() ?? '')

const compareK8sVersionDesc = (a: TVersionEntry, b: TVersionEntry) => {
  const pa = parseK8sVersion(versionToken(a))
  const pb = parseK8sVersion(versionToken(b))
  return pb.rank - pa.rank || pb.major - pa.major || pb.stageNum - pa.stageNum
}

/**
 * Order versions so that:
 * - If a preferred exists -> it's first
 * - Then all the others by k8s order (stable > beta > alpha; then newer majors; then higher stageNum)
 * No mutation of the original entries.
 */
const orderVersions = (versions: ReadonlyArray<TVersionEntry>): TVersionEntry[] => {
  const preferredIdx = versions.findIndex(v => v.preferred === true)
  if (preferredIdx >= 0) {
    const preferred = versions[preferredIdx]
    const rest = versions
      .filter((_, i) => i !== preferredIdx)
      .slice()
      .sort(compareK8sVersionDesc)
    return [preferred, ...rest]
  }
  return versions.slice().sort(compareK8sVersionDesc)
}

/**
 * RETURNS ALL VERSIONS (one row per version).
 * The first row for each {group, kind} will be the preferred (if any),
 * otherwise the best-sorted version. Others follow right after.
 */
export const getSortedKindsAll = (index: TKindIndex): TKindWithVersion[] => {
  const counts = index.items.reduce<Record<string, number>>(
    (acc, item) => ({ ...acc, [item.kind]: (acc[item.kind] ?? 0) + 1 }),
    {},
  )

  const rows: TKindWithVersion[] = index.items.flatMap(item => {
    const ordered = orderVersions(item.versions)
    return ordered.map(v => ({
      group: item.group,
      kind: item.kind,
      // clone to drop Readonly<> without changing fields (incl. preferred)
      version: { ...v },
      ...(counts[item.kind] > 1 ? { notUnique: true as const } : {}),
    }))
  })

  // Keep kinds & groups alpha; within a given kind, we keep the order we just created.
  return rows.sort(
    (a, b) =>
      a.kind.localeCompare(b.kind, undefined, { sensitivity: 'base' }) ||
      a.group.localeCompare(b.group, undefined, { sensitivity: 'base' }),
  )
}
