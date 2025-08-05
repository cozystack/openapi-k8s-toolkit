export const getRunningContainerNames = (
  pod: unknown & {
    status: unknown & { containerStatuses: { name: string; state?: unknown & { running?: unknown } }[] }
  },
): string[] => (pod.status?.containerStatuses ?? []).filter(st => Boolean(st.state?.running)).map(st => st.name)
