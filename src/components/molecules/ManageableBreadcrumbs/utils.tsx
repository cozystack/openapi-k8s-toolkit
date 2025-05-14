import { Link, matchPath } from 'react-router-dom'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { TLink } from './types'

export const prepareTemplate = ({
  template,
  replaceValues,
}: {
  template: string
  replaceValues: Record<string, string | undefined>
}): string => {
  return template.replaceAll(/{(.*?)}/g, (_, key) => replaceValues[key] || '')
}

const mapLinksFromRaw = ({
  rawLinks,
  replaceValues,
  ReactRouterLink,
}: {
  rawLinks: TLink[]
  replaceValues: Record<string, string | undefined>
  ReactRouterLink: typeof Link
}): BreadcrumbItemType[] => {
  return rawLinks.map(({ key, label, link }) => {
    return {
      key,
      title: link ? (
        <ReactRouterLink
          to={prepareTemplate({
            template: link,
            replaceValues,
          })}
        >
          {prepareTemplate({
            template: label,
            replaceValues,
          })}
        </ReactRouterLink>
      ) : (
        prepareTemplate({
          template: label,
          replaceValues,
        })
      ),
    }
  })
}

export const prepareDataForManageableBreadcrumbs = ({
  data,
  replaceValues,
  pathname,
  ReactRouterLink,
  reactRouterMatchPath,
}: {
  data: { pathToMatch: string; breadcrumbItems: TLink[] }[]
  replaceValues: Record<string, string | undefined>
  pathname: string
  ReactRouterLink: typeof Link
  reactRouterMatchPath: typeof matchPath
}): { pathToMatch: string; breadcrumbItems: BreadcrumbItemType[] } | undefined => {
  const preparedData = data.map(({ pathToMatch, breadcrumbItems }) => ({
    pathToMatch: prepareTemplate({
      template: pathToMatch,
      replaceValues,
    }),
    breadcrumbItems: mapLinksFromRaw({
      rawLinks: breadcrumbItems,
      replaceValues,
      ReactRouterLink,
    }),
  }))

  return preparedData.find(({ pathToMatch }) => reactRouterMatchPath(pathToMatch, pathname))
}
