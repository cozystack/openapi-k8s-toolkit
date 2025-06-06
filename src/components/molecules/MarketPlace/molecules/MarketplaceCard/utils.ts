export const getPathToNav = ({
  clusterName,
  namespace,
  type,
  pathToNav,
  typeName,
  apiGroup,
  apiVersion,
  baseprefix,
}: {
  clusterName: string
  namespace: string
  type: string
  pathToNav?: string
  typeName?: string
  apiGroup?: string
  apiVersion?: string
  baseprefix?: string
}): string => {
  const apiExtensionVersion = 'v1'

  if (type === 'direct' && pathToNav) {
    return pathToNav
  }

  if (type === 'crd') {
    return `/${baseprefix}/${clusterName}/${namespace}/crd-table/${apiGroup}/${apiVersion}/${apiExtensionVersion}/${typeName}`
  }

  if (type === 'nonCrd') {
    return `/${baseprefix}/${clusterName}/${namespace}/api-table/${apiGroup}/${apiVersion}/${typeName}`
  }

  return `/${baseprefix}/${clusterName}/${namespace}/builtin-table/${typeName}`
}

export const getListPath = ({
  clusterName,
  namespace,
  type,
  typeName,
  apiGroup,
  apiVersion,
}: {
  clusterName: string
  namespace: string
  type: string
  typeName?: string
  apiGroup?: string
  apiVersion?: string
}): string | undefined => {
  if (type === 'crd') {
    return `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${typeName}`
  }

  if (type === 'nonCrd') {
    return `/api/clusters/${clusterName}/k8s/apis/${apiGroup}/${apiVersion}${
      namespace ? `/namespaces/${namespace}` : ''
    }/${typeName}`
  }

  return `/api/clusters/${clusterName}/k8s/api/v1${namespace ? `/namespaces/${namespace}` : ''}/${typeName}`
}
