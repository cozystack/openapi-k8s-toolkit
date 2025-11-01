import { TEventsV1Event } from '../../types'

// Prefer modern `note`, fallback to legacy `message`
export const eventText = (e: TEventsV1Event) => e.note || e.message || ''

// Friendly relative time formatter; returns locale string for >24h
export const timeAgo = (iso?: string) => {
  if (!iso) {
    return ''
  }
  const dt = new Date(iso).getTime()

  const diff = Date.now() - dt

  if (diff < 60_000) {
    return `${Math.max(0, Math.floor(diff / 1000))}s ago`
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`
  }
  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h ago`
  }

  return new Date(iso).toLocaleString()
}

export const getResourceLink = ({
  baseprefix,
  cluster,
  namespace,
  apiGroupVersion,
  pluralName,
  name,
  baseFactoryNamespacedAPIKey,
  baseFactoryClusterSceopedAPIKey,
  baseFactoryNamespacedBuiltinKey,
  baseFactoryClusterSceopedBuiltinKey,
}: {
  baseprefix?: string
  cluster: string
  namespace?: string
  apiGroupVersion: string
  pluralName?: string
  name?: string
  baseFactoryNamespacedAPIKey: string
  baseFactoryClusterSceopedAPIKey: string
  baseFactoryNamespacedBuiltinKey: string
  baseFactoryClusterSceopedBuiltinKey: string
}): string | undefined => {
  if (!pluralName || !name) {
    return undefined
  }

  if (apiGroupVersion === 'v1') {
    return `${baseprefix}/${cluster}${namespace ? `/${namespace}` : ''}/factory/${
      namespace ? baseFactoryNamespacedBuiltinKey : baseFactoryClusterSceopedBuiltinKey
    }/${apiGroupVersion}/${pluralName}/${name}`
  }

  return `${baseprefix}/${cluster}${namespace ? `/${namespace}` : ''}/factory/${
    namespace ? baseFactoryNamespacedAPIKey : baseFactoryClusterSceopedAPIKey
  }/${apiGroupVersion}/${pluralName}/${name}`
}

export const getNamespaceLink = ({
  baseprefix,
  cluster,
  apiGroupVersion,
  pluralName,
  namespace,
  baseNamespaceFactoryKey,
}: {
  baseprefix?: string
  cluster: string
  pluralName: string
  apiGroupVersion: string
  namespace?: string
  baseNamespaceFactoryKey: string
}): string | undefined => {
  if (!namespace) {
    return undefined
  }

  return `${baseprefix}/${cluster}/factory/${baseNamespaceFactoryKey}/${apiGroupVersion}/${pluralName}/${namespace}`
}

export const formatEventSummary = (event: TEventsV1Event): string | undefined => {
  if (!event.deprecatedCount || !event.deprecatedFirstTimestamp) {
    return undefined
  }

  const now = new Date()
  const first = new Date(event.deprecatedFirstTimestamp)
  const days = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))

  return `${event.deprecatedCount} times ${days === 0 ? 'today' : `in the last ${days} days`}`
}
