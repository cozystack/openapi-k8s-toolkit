import { useQuery } from '@tanstack/react-query'
import { getDirectUnknownResource } from 'api/getDirectUnknownResource'

export const useDirectUnknownResource = <T>({
  uri,
  queryKey,
  refetchInterval,
  isEnabled,
}: {
  uri: string
  queryKey: string[]
  refetchInterval?: number | false
  isEnabled?: boolean
}) => {
  return useQuery({
    queryKey,
    queryFn: async () =>
      (
        await getDirectUnknownResource<T>({
          uri,
        })
      ).data,
    refetchInterval: refetchInterval !== undefined ? refetchInterval : 5000,
    enabled: isEnabled,
  })
}
