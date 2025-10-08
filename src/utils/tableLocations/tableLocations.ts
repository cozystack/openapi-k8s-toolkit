export const getBackLinkToTable = ({ fullPath }: { fullPath: string }): string => {
  return encodeURIComponent(fullPath)
}

export const getLinkToBuiltinForm = ({
  cluster,
  baseprefix,
  namespace,
  syntheticProject,
  typeName,
  inside,
  fullPath,
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  typeName: string
  inside?: boolean
  fullPath: string
}): string => {
  const root = `${baseprefix}${inside ? '/inside' : ''}/${cluster}`
  const mainRoute = `${root}${namespace ? `/${namespace}` : ''}${syntheticProject ? `/${syntheticProject}` : ''}`
  const backlink = getBackLinkToTable({
    fullPath,
  })

  return `${mainRoute}/forms/builtin/v1/${typeName}?backlink=${backlink}`
}

export const getLinkToApiForm = ({
  cluster,
  baseprefix,
  namespace,
  syntheticProject,
  apiGroup,
  apiVersion,
  typeName,
  inside,
  fullPath,
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  apiGroup?: string // api
  apiVersion?: string // api
  typeName: string
  inside?: boolean
  fullPath: string
  searchMount?: boolean
}): string => {
  const root = `${baseprefix}${inside ? '/inside' : ''}/${cluster}`
  const mainRoute = `${root}${namespace ? `/${namespace}` : ''}${syntheticProject ? `/${syntheticProject}` : ''}`
  const backlink = getBackLinkToTable({
    fullPath,
  })

  return `${mainRoute}/forms/apis/${apiGroup}/${apiVersion}/${typeName}?backlink=${backlink}`
}

export const getLinkToForm = ({
  apiGroup,
  ...rest
}: {
  cluster: string
  baseprefix?: string
  namespace?: string
  syntheticProject?: string
  apiGroup?: string // api
  apiVersion?: string // api
  typeName: string
  inside?: boolean
  fullPath: string
  searchMount?: boolean
}): string => {
  return !apiGroup || apiGroup.length === 0
    ? getLinkToBuiltinForm({ ...rest })
    : getLinkToApiForm({ apiGroup, ...rest })
}
