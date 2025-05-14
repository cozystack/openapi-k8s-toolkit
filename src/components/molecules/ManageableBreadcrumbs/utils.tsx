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
}: {
  rawLinks: TLink[]
  replaceValues: Record<string, string | undefined>
}): BreadcrumbItemType[] => {
  return rawLinks.map(({ key, label, link }) => {
    return {
      key,
      title: link ? (
        <Link
          to={prepareTemplate({
            template: link,
            replaceValues,
          })}
        >
          {prepareTemplate({
            template: label,
            replaceValues,
          })}
        </Link>
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
}: {
  data: { pathToMatch: string; breadcrumbItems: TLink[] }[]
  replaceValues: Record<string, string | undefined>
  pathname: string
}): { pathToMatch: string; breadcrumbItems: BreadcrumbItemType[] } | undefined => {
  const preparedData = data.map(({ pathToMatch, breadcrumbItems }) => ({
    pathToMatch: prepareTemplate({
      template: pathToMatch,
      replaceValues,
    }),
    breadcrumbItems: mapLinksFromRaw({
      rawLinks: breadcrumbItems,
      replaceValues,
    }),
  }))

  return preparedData.find(({ pathToMatch }) => matchPath(pathToMatch, pathname))
}
