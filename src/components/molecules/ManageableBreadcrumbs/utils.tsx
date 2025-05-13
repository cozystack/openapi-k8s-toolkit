import { Link, matchPath } from 'react-router-dom'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { TLink } from './types'

const prepareUri = ({
  dirtyUri,
  clusterName,
  projectName,
  instanceName,
  namespace,
  syntheticProject,
  entryType,
  apiGroup,
  apiVersion,
  typeName,
  entryName,
  apiExtensionVersion,
  crdName,
}: {
  dirtyUri: string
  clusterName?: string
  projectName?: string
  instanceName?: string
  namespace?: string
  syntheticProject?: string
  entryType?: string
  apiGroup?: string
  apiVersion?: string
  typeName?: string
  entryName?: string
  apiExtensionVersion?: string
  crdName?: string
}): string => {
  return dirtyUri
    .replaceAll('{clusterName}', clusterName || '')
    .replaceAll('{projectName}', projectName || '')
    .replaceAll('{instanceName}', instanceName || '')
    .replaceAll('{namespace}', namespace || '')
    .replaceAll('{syntheticProject}', syntheticProject || '')
    .replaceAll('{entryType}', entryType || '')
    .replaceAll('{apiGroup}', apiGroup || '')
    .replaceAll('{apiVersion}', apiVersion || '')
    .replaceAll('{typeName}', typeName || '')
    .replaceAll('{entryName}', entryName || '')
    .replaceAll('{apiExtensionVersion}', apiExtensionVersion || '')
    .replaceAll('{crdName}', crdName || '')
}

const mapLinksFromRaw = ({
  rawLinks,
  clusterName,
  projectName,
  instanceName,
  namespace,
  syntheticProject,
  entryType,
  apiGroup,
  apiVersion,
  typeName,
  entryName,
  apiExtensionVersion,
  crdName,
}: {
  rawLinks: TLink[]
  clusterName?: string
  projectName?: string
  instanceName?: string
  namespace?: string
  syntheticProject?: string
  entryType?: string
  apiGroup?: string
  apiVersion?: string
  typeName?: string
  entryName?: string
  apiExtensionVersion?: string
  crdName?: string
}): BreadcrumbItemType[] => {
  return rawLinks.map(({ key, label, link }) => {
    return {
      key,
      title: link ? (
        <Link
          to={prepareUri({
            dirtyUri: link,
            clusterName,
            projectName,
            instanceName,
            namespace,
            syntheticProject,
            entryType,
            apiGroup,
            apiVersion,
            typeName,
            entryName,
            apiExtensionVersion,
            crdName,
          })}
        >
          {prepareUri({
            dirtyUri: label,
            clusterName,
            projectName,
            instanceName,
            namespace,
            syntheticProject,
            entryType,
            apiGroup,
            apiVersion,
            typeName,
            entryName,
            apiExtensionVersion,
            crdName,
          })}
        </Link>
      ) : (
        prepareUri({
          dirtyUri: label,
          clusterName,
          projectName,
          instanceName,
          namespace,
          syntheticProject,
          entryType,
          apiGroup,
          apiVersion,
          typeName,
          entryName,
          apiExtensionVersion,
          crdName,
        })
      ),
    }
  })
}

export const prepareDataForManageableBreadcrumbs = ({
  data,
  clusterName,
  projectName,
  instanceName,
  namespace,
  syntheticProject,
  entryType,
  apiGroup,
  apiVersion,
  typeName,
  entryName,
  apiExtensionVersion,
  crdName,
  pathname,
}: {
  data: { pathToMatch: string; breadcrumbItems: TLink[] }[]
  clusterName?: string
  projectName?: string
  instanceName?: string
  namespace?: string
  syntheticProject?: string
  entryType?: string
  apiGroup?: string
  apiVersion?: string
  typeName?: string
  entryName?: string
  apiExtensionVersion?: string
  crdName?: string
  pathname: string
}): { pathToMatch: string; breadcrumbItems: BreadcrumbItemType[] } | undefined => {
  const preparedData = data.map(({ pathToMatch, breadcrumbItems }) => ({
    pathToMatch: prepareUri({
      dirtyUri: pathToMatch,
      clusterName,
      projectName,
      instanceName,
      namespace,
      syntheticProject,
      entryType,
      apiGroup,
      apiVersion,
      typeName,
      entryName,
      apiExtensionVersion,
      crdName,
    }),
    breadcrumbItems: mapLinksFromRaw({
      rawLinks: breadcrumbItems,
      clusterName,
      projectName,
      instanceName,
      namespace,
      syntheticProject,
      entryType,
      apiGroup,
      apiVersion,
      typeName,
      entryName,
      apiExtensionVersion,
      crdName,
    }),
  }))

  return preparedData.find(({ pathToMatch }) => matchPath(pathToMatch, pathname))
}
