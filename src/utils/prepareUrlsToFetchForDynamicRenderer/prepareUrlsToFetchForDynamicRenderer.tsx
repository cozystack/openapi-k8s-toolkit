import { prepareTemplate } from 'utils/prepareTemplate'

export const prepareUrlsToFetchForDynamicRenderer = ({
  urls,
  locationPathname,
}: {
  urls: string[]
  locationPathname: string
}): string[] => {
  const replaceValues = locationPathname.split('/').reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  return urls.map(url =>
    prepareTemplate({
      template: url,
      replaceValues,
    }),
  )
}
