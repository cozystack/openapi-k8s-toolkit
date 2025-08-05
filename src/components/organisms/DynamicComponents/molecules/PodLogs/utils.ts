export const getRunningContainerNames = (
  pod: unknown & {
    status: unknown & {
      containerStatuses: { name: string; state?: unknown & { running?: unknown } }[]
      initContainerStatuses: { name: string }[]
    }
  },
): { containers: string[]; initContainers: string[] } => {
  const containers = (pod.status?.containerStatuses ?? []).filter(st => Boolean(st.state?.running)).map(st => st.name)
  const initContainers = (pod.status?.initContainerStatuses ?? []).map(st => st.name)
  return { containers, initContainers }
}
