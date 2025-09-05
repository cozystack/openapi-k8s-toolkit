import { TKindIndex, TVersionEntry } from 'localTypes/bff/search'
import { TKindWithVersion } from 'localTypes/search'

// Parse k8s version tokens like v1, v2beta1, v1alpha2
const parseK8sVersion = (raw: string) => {
  const m = /^v(?<major>\d+)(?:(?<stage>alpha|beta)(?<stageNum>\d+)?)?$/i.exec(raw ?? '')
  if (!m?.groups) return { rank: 0, major: -1, stageNum: -1 as number }
  const stage = (m.groups.stage ?? '').toLowerCase()
  const major = Number(m.groups.major)
  const stageNum = m.groups.stageNum ? Number(m.groups.stageNum) : 0
  // eslint-disable-next-line no-nested-ternary
  const rank = stage === '' ? 3 : stage === 'beta' ? 2 : 1 // stable>beta>alpha
  return { rank, major, stageNum }
}

// Extract the k8s version token to parse from an entry
const versionToken = (e: TVersionEntry) => e.version || (e.groupVersion?.split('/').pop() ?? '')

const compareK8sVersionDesc = (a: TVersionEntry, b: TVersionEntry) => {
  const pa = parseK8sVersion(versionToken(a))
  const pb = parseK8sVersion(versionToken(b))
  return pb.rank - pa.rank || pb.major - pa.major || pb.stageNum - pa.stageNum
}

export const getSortedKinds = (index: TKindIndex): TKindWithVersion[] => {
  const counts = index.items.reduce<Record<string, number>>(
    (acc, item) => ({ ...acc, [item.kind]: (acc[item.kind] ?? 0) + 1 }),
    {},
  )

  const pickVersion = (versions: TVersionEntry[]): TVersionEntry | undefined =>
    versions.find(v => v.preferred) ?? [...versions].sort(compareK8sVersionDesc)[0]

  return index.items
    .map(item => {
      const version = pickVersion(item.versions)
      return version
        ? {
            group: item.group,
            kind: item.kind,
            version,
            ...(counts[item.kind] > 1 ? { notUnique: true } : {}),
          }
        : undefined
    })
    .filter((x): x is TKindWithVersion => Boolean(x))
    .sort(
      (a, b) =>
        a.kind.localeCompare(b.kind, undefined, { sensitivity: 'base' }) ||
        a.group.localeCompare(b.group, undefined, { sensitivity: 'base' }),
    )
}
