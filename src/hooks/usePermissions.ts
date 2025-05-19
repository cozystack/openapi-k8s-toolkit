import { useQuery } from '@tanstack/react-query'
import { checkPermission } from 'api/permissions'

export const usePermissions = ({
  clusterName,
  namespace,
  apiGroup,
  typeName,
  verb,
  refetchInterval,
  enabler,
}: {
  clusterName: string
  apiGroup: string
  typeName: string
  namespace: string
  verb: 'create' | 'delete' | 'patch' | 'update'
  refetchInterval?: number | false
  enabler?: boolean
}) => {
  return useQuery({
    queryKey: ['apiCheckPermissions', clusterName, namespace, apiGroup, typeName, verb],
    queryFn: async () =>
      (
        await checkPermission({
          clusterName,
          body: {
            namespace,
            group: apiGroup,
            resource: typeName,
            verb,
          },
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
    enabled: enabler || true,
  })
}
