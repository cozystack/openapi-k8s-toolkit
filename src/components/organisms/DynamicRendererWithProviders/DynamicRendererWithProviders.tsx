import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
import { TItemTypeMap } from 'localTypes/dynamicRender'
import { prepareUrlsToFetchForDynamicRenderer } from 'utils/prepareUrlsToFetchForDynamicRenderer'
import { DynamicRenderer, TDynamicRendererProps } from '../DynamicRenderer'
import { ThemeProvider } from './themeContext'
import { FactoryConfigContextProvider } from './factoryConfigProvider'
import { PartsOfUrlProvider } from './partsOfUrlContext'
import { MultiQueryProvider } from './multiQueryProvider'

export const DynamicRendererWithProviders = <T extends TItemTypeMap>(
  props: TDynamicRendererProps<T> & {
    urlsToFetch: string[]
    dataToApplyToContext?: unknown
    theme: 'dark' | 'light'
    nodeTerminalDefaultProfile?: string
  },
): ReactElement => {
  const location = useLocation()
  const { urlsToFetch, dataToApplyToContext, theme, nodeTerminalDefaultProfile } = props

  const preparedUrlsToFetch = prepareUrlsToFetchForDynamicRenderer({
    urls: urlsToFetch,
    locationPathname: location.pathname,
  })

  return (
    <ThemeProvider theme={theme}>
      <FactoryConfigContextProvider value={{ nodeTerminalDefaultProfile }}>
        <PartsOfUrlProvider value={{ partsOfUrl: location.pathname.split('/') }}>
          <MultiQueryProvider urls={preparedUrlsToFetch} dataToApplyToContext={dataToApplyToContext}>
            <DynamicRenderer {...props} />
          </MultiQueryProvider>
        </PartsOfUrlProvider>
      </FactoryConfigContextProvider>
    </ThemeProvider>
  )
}
