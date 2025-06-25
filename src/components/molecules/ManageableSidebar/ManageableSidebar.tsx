import React, { FC } from 'react'
import { Spin } from 'antd'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { TSidebarResponse } from './types'
import { prepareDataForManageableSidebar } from './utils'
import { Styled } from './styled'

export type TManageableSidebarProps = {
  data: TSidebarResponse
  replaceValues: Record<string, string | undefined>
  pathname: string
  idToCompare: string
  noMarginTop?: boolean
}

export const ManageableSidebar: FC<TManageableSidebarProps> = ({
  data,
  replaceValues,
  pathname,
  idToCompare,
  noMarginTop,
}) => {
  const parsedData = data?.items.map(({ spec }) => spec)

  if (!parsedData) {
    return null
  }

  const result = prepareDataForManageableSidebar({
    data: parsedData,
    replaceValues,
    pathname,
    idToCompare,
  })

  if (result) {
    return (
      <Styled.CustomMenu
        selectedKeys={result.selectedKeys}
        onSelect={() => {}}
        onDeselect={() => {}}
        mode="inline"
        items={result.menuItems}
        $noMarginTop={noMarginTop}
      />
    )
  }

  return null
}

export type TManageableSidebarWithDataProviderProps = {
  uri: string
  refetchInterval?: number | false
  isEnabled?: boolean
  replaceValues: Record<string, string | undefined>
  pathname: string
  idToCompare: string
  hidden?: boolean
  noMarginTop?: boolean
}

export const ManageableSidebarWithDataProvider: FC<TManageableSidebarWithDataProviderProps> = ({
  uri,
  refetchInterval,
  isEnabled,
  replaceValues,
  pathname,
  idToCompare,
  hidden,
  noMarginTop,
}) => {
  const {
    data: rawData,
    isError: rawDataError,
    isLoading: rawDataLoading,
  } = useDirectUnknownResource<TSidebarResponse>({
    uri,
    refetchInterval,
    queryKey: ['sidebar', uri],
    isEnabled,
  })

  if (rawDataError) {
    return null
  }

  if (rawDataLoading) {
    return <Spin />
  }

  if (!rawData) {
    return null
  }

  if (hidden) {
    return null
  }

  return (
    <ManageableSidebar
      data={rawData}
      replaceValues={replaceValues}
      pathname={pathname}
      idToCompare={idToCompare}
      noMarginTop={noMarginTop}
    />
  )
}
