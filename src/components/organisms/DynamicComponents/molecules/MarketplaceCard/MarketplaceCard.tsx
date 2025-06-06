/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import { MarketPlace as Card } from 'components/molecules'
import { prepareTemplate } from 'utils/prepareTemplate'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'

export const MarketplaceCard: FC<{ data: TDynamicComponentsAppTypeMap['MarketplaceCard']; children?: any }> = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, clusterNamePartOfUrl, namespacePartOfUrl, ...props } = data

  const partsOfUrl = usePartsOfUrl()

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const clusterName = prepareTemplate({
    template: clusterNamePartOfUrl,
    replaceValues,
  })

  const namespace = prepareTemplate({
    template: namespacePartOfUrl,
    replaceValues,
  })

  return <Card clusterName={clusterName} namespace={namespace} {...props} />
}
