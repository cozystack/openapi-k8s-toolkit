import axios, { AxiosResponse } from 'axios'

export const checkPermission = async ({
  clusterName,
  body,
}: {
  clusterName: string
  body: {
    group?: string
    resource: string
    verb: 'get' | 'list' | 'watch' | 'create' | 'delete' | 'patch' | 'update'
    namespace?: string
    name?: string
  }
}): Promise<
  AxiosResponse<{
    status: {
      allowed?: boolean
    }
  }>
> => {
  const data = JSON.stringify({
    apiVersion: 'authorization.k8s.io/v1',
    kind: 'SelfSubjectAccessReview',
    spec: {
      resourceAttributes: {
        ...(body.group ? { group: body.group } : {}),
        resource: body.resource,
        verb: body.verb,
        ...(body.namespace ? { namespace: body.namespace } : {}),
        ...(body.name ? { name: body.name } : {}),
      },
    },
  })
  return axios.post(`/api/clusters/${clusterName}/k8s/apis/authorization.k8s.io/v1/selfsubjectaccessreviews`, data, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
