import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
import { TItemTypeMap } from 'localTypes/dynamicRender'
import { prepareUrlsToFetchForDynamicRenderer } from 'utils/prepareUrlsToFetchForDynamicRenderer'
import { DynamicRenderer, TDynamicRendererProps } from '../DynamicRenderer'
import { PartsOfUrlProvider } from './partsOfUrlContext'
import { MultiQueryProvider } from './multiQueryProvider'
import { ThemeProvider } from './themeContext'

export const DynamicRendererWithProviders = <T extends TItemTypeMap>(
  props: TDynamicRendererProps<T> & { urlsToFetch: string[]; theme: 'dark' | 'light' },
): ReactElement => {
  const location = useLocation()
  const { urlsToFetch, theme } = props

  const preparedUrlsToFetch = prepareUrlsToFetchForDynamicRenderer({
    urls: urlsToFetch,
    locationPathname: location.pathname,
  })

  return (
    <ThemeProvider theme={theme}>
      <PartsOfUrlProvider value={{ partsOfUrl: location.pathname.split('/') }}>
        <MultiQueryProvider urls={preparedUrlsToFetch}>
          <DynamicRenderer {...props} />
        </MultiQueryProvider>
      </PartsOfUrlProvider>
    </ThemeProvider>
  )
}
