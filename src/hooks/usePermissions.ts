import { useQuery } from '@tanstack/react-query'
import { checkPermission } from 'api/permissions'

export const usePermissions = ({
  clusterName,
  namespace,
  group,
  resource,
  verb,
  name,
  refetchInterval,
  enabler,
}: {
  clusterName: string
  group?: string
  resource: string
  namespace?: string
  name?: string
  verb: 'create' | 'delete' | 'patch' | 'update'
  refetchInterval?: number | false
  enabler?: boolean
}) => {
  return useQuery({
    queryKey: ['usePermissions', clusterName, namespace, group, resource, verb, name],
    queryFn: async () =>
      (
        await checkPermission({
          clusterName,
          body: {
            namespace,
            group,
            resource,
            verb,
          },
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
    enabled: enabler || true,
  })
}
