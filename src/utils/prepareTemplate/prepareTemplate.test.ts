import { prepareTemplate } from './prepareTemplate'

describe('prepareTemplate', () => {
  it('replaces all placeholders with provided values', () => {
    const template = '/api/{clusterName}/{namespace}/{entryType}'
    const values = {
      clusterName: 'cluster-01',
      namespace: 'default',
      entryType: 'pods',
    }

    expect(prepareTemplate({ template, replaceValues: values })).toBe('/api/cluster-01/default/pods')
  })

  it('replaces repeated placeholders correctly', () => {
    const template = '/{name}/details/{name}/logs/{name}'
    const values = { name: 'node-123' }

    expect(prepareTemplate({ template, replaceValues: values })).toBe('/node-123/details/node-123/logs/node-123')
  })

  it('replaces missing values with empty strings', () => {
    const template = '/api/{clusterName}/{namespace}/{entryType}'
    const values = {
      clusterName: 'cluster-01',
      entryType: 'pods',
      // namespace is undefined
    }

    expect(prepareTemplate({ template, replaceValues: values })).toBe('/api/cluster-01//pods')
  })

  it('returns the template unchanged if no placeholders match', () => {
    const template = '/static/uri'
    const values = { unusedKey: 'value' }

    expect(prepareTemplate({ template, replaceValues: values })).toBe('/static/uri')
  })

  it('ignores extra keys in the values object', () => {
    const template = '/api/{entryType}'
    const values = {
      entryType: 'services',
      extraKey: 'notUsed',
    }

    expect(prepareTemplate({ template, replaceValues: values })).toBe('/api/services')
  })

  it('handles empty values object gracefully', () => {
    const template = '/api/{clusterName}/{entryType}'
    expect(prepareTemplate({ template, replaceValues: {} })).toBe('/api//')
  })
})
