import React, { FC } from 'react'
import { Breadcrumb, Spin } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { TBreadcrumbResponse } from './types'
import { prepareDataForManageableBreadcrumbs } from './utils'
import { Styled } from './styled'

export type TManageableBreadcrumbsProps = {
  data: { breadcrumbItems: BreadcrumbItemType[] }
}

export const ManageableBreadcrumbs: FC<TManageableBreadcrumbsProps> = ({ data }) => {
  return (
    <Styled.HeightDiv>
      <Breadcrumb separator=">" items={data.breadcrumbItems} />
    </Styled.HeightDiv>
  )
}

export type TManageableBreadcrumbsWithDataProviderProps = {
  uri: string
  refetchInterval?: number | false
  isEnabled?: boolean
  replaceValues: Record<string, string | undefined>
  pathname: string
  idToCompare: string
}

export const ManageableBreadcrumbsWithDataProvider: FC<TManageableBreadcrumbsWithDataProviderProps> = ({
  uri,
  refetchInterval,
  isEnabled,
  replaceValues,
  pathname,
  idToCompare,
}) => {
  const {
    data: rawData,
    isError: rawDataError,
    isLoading: rawDataLoading,
  } = useDirectUnknownResource<TBreadcrumbResponse>({
    uri,
    refetchInterval,
    queryKey: ['breadcrumb', uri],
    isEnabled,
  })

  if (rawDataError) {
    return null
  }

  if (rawDataLoading) {
    return (
      <Styled.HeightDiv>
        <Spin />
      </Styled.HeightDiv>
    )
  }

  if (!rawData) {
    return null
  }

  const parsedData = rawData?.items.map(({ spec }) => spec)

  if (!parsedData) {
    return null
  }

  const result = prepareDataForManageableBreadcrumbs({
    data: parsedData,
    replaceValues,
    pathname,
    idToCompare,
  })

  if (!result) {
    return <Styled.HeightDiv />
  }

  return <ManageableBreadcrumbs data={result} />
}
