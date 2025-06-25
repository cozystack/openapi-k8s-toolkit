import React from 'react'
import { Link } from 'react-router-dom'
import { ItemType } from 'antd/es/menu/interface'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TLink } from './types'

const mapLinksFromRaw = ({
  rawLinks,
  replaceValues,
}: {
  rawLinks: TLink[]
  replaceValues: Record<string, string | undefined>
}): (ItemType & { internalMetaLink?: string })[] => {
  return rawLinks.map(({ key, label, link, children }) => {
    const preparedLink = link ? prepareTemplate({ template: link, replaceValues }) : undefined
    return {
      key,
      label: preparedLink ? <Link to={preparedLink}>{label}</Link> : label,
      internalMetaLink: preparedLink,
      children: children
        ? mapLinksFromRaw({
            rawLinks: children,
            replaceValues,
          })
        : undefined,
    }
  })
}

const findMatchingItems = (items: (ItemType & { internalMetaLink?: string })[], pathname: string): React.Key[] => {
  const traverse = (nodes: (ItemType & { internalMetaLink?: string })[], parents: React.Key[]): React.Key[] =>
    nodes.flatMap(node => {
      const currentPath = [...parents, node.key ? node.key : String(node.key)]

      const cleanNodeInternalMetaLink = node.internalMetaLink?.startsWith('/')
        ? node.internalMetaLink.slice(1)
        : node.internalMetaLink
      const cleanPathname = pathname.startsWith('/') ? pathname.slice(1) : pathname
      const matched =
        cleanNodeInternalMetaLink === cleanPathname ||
        (cleanNodeInternalMetaLink && currentPath && cleanNodeInternalMetaLink.includes(cleanPathname))
          ? currentPath
          : []

      let childrenResults: React.Key[] = []

      if ('children' in node && node.children) {
        childrenResults = traverse(node.children as (ItemType & { internalMetaLink?: string })[], currentPath)
      }

      return [...matched, ...childrenResults]
    })

  return traverse(items, [])
}

export const prepareDataForManageableSidebar = ({
  data,
  replaceValues,
  pathname,
  idToCompare,
}: {
  data: { id: string; menuItems: TLink[] }[]
  replaceValues: Record<string, string | undefined>
  pathname: string
  idToCompare: string
}): { menuItems: ItemType[]; selectedKeys: string[] } | undefined => {
  const foundData = data.find(el => el.id === idToCompare)

  if (!foundData) {
    return undefined
  }

  const result = {
    menuItems: mapLinksFromRaw({
      rawLinks: foundData.menuItems,
      replaceValues,
    }),
  }

  const openedKeys: React.Key[] = result?.menuItems ? findMatchingItems(result?.menuItems, pathname) : []
  const stringedOpenedKeys = openedKeys.map(el => (typeof el === 'string' ? el : String(el)))

  return { ...result, selectedKeys: stringedOpenedKeys }
}
