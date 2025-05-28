import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
import { TItemTypeMap } from 'localTypes/dynamicRender'
import { DynamicRenderer, TDynamicRendererProps } from '../DynamicRenderer'
import { PartsOfUrlProvider } from './partsOfUrlContext'

export const DynamicRendererWithProviders = <T extends TItemTypeMap>(props: TDynamicRendererProps<T>): ReactElement => {
  const location = useLocation()

  return (
    <PartsOfUrlProvider value={{ partsOfUrl: location.pathname.split('/') }}>
      <DynamicRenderer {...props} />
    </PartsOfUrlProvider>
  )
}
