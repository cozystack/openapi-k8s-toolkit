import React, { FC } from 'react'
import { Breadcrumb, Spin } from 'antd'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { TBreadcrumbResponse } from './types'
import { prepareDataForManageableBreadcrumbs } from './utils'
import { Styled } from './styled'

export type TManageableBreadcrumbsProps = {
  data: TBreadcrumbResponse
  replaceValues: Record<string, string | undefined>
  pathname: string
}

export const ManageableBreadcrumbs: FC<TManageableBreadcrumbsProps> = ({ data, replaceValues, pathname }) => {
  const parsedData = data?.items.map(({ spec }) => spec)

  if (!parsedData) {
    return null
  }

  const result = prepareDataForManageableBreadcrumbs({
    data: parsedData,
    replaceValues,
    pathname,
  })

  if (result) {
    return (
      <Styled.HeightDiv>
        <Breadcrumb separator=">" items={result.breadcrumbItems} />
      </Styled.HeightDiv>
    )
  }

  return <Styled.HeightDiv />
}

export type TManageableBreadcrumbsWithDataProviderProps = {
  uri: string
  refetchInterval?: number | false
  isEnabled?: boolean
  replaceValues: Record<string, string | undefined>
  pathname: string
}

export const ManageableBreadcrumbsWithDataProvider: FC<TManageableBreadcrumbsWithDataProviderProps> = ({
  uri,
  refetchInterval,
  isEnabled,
  replaceValues,
  pathname,
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

  return <ManageableBreadcrumbs data={rawData} replaceValues={replaceValues} pathname={pathname} />
}
