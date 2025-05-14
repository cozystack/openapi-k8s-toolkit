/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { prepareDataForManageableBreadcrumbs, prepareTemplate } from './utils'

// Mock Link component to avoid rendering issues in Jest
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
}))

describe('prepareTemplate', () => {
  it('should replace placeholders correctly', () => {
    const template = '/users/{userId}/posts/{postId}'
    const replaceValues = { userId: '123', postId: '456' }

    expect(prepareTemplate({ template, replaceValues })).toBe('/users/123/posts/456')
  })

  it('should leave placeholders empty if value is missing', () => {
    const template = '/users/{userId}/posts/{postId}'
    const replaceValues = { userId: '123' }

    expect(prepareTemplate({ template, replaceValues })).toBe('/users/123/posts/')
  })
})

describe('prepareDataForManageableBreadcrumbs', () => {
  const mockReplaceValues = { userId: '123', postId: '789' }

  const mockData = [
    {
      pathToMatch: '/users/{userId}',
      breadcrumbItems: [
        { key: 'home', label: 'Home', link: '/' },
        { key: 'user', label: 'User {userId}', link: '/users/{userId}' },
      ],
    },
    {
      pathToMatch: '/users/{userId}/posts/{postId}',
      breadcrumbItems: [
        { key: 'home', label: 'Home', link: '/' },
        { key: 'user', label: 'User {userId}', link: '/users/{userId}' },
        { key: 'post', label: 'Post {postId}', link: '/users/{userId}/posts/{postId}' },
      ],
    },
  ]

  it('should return matched breadcrumb data with replaced values', () => {
    const result = prepareDataForManageableBreadcrumbs({
      data: mockData,
      replaceValues: mockReplaceValues,
      pathname: '/users/123/posts/789',
    })

    expect(result).toBeDefined()
    expect(result?.pathToMatch).toBe('/users/123/posts/789')

    const breadcrumbItems = result?.breadcrumbItems as BreadcrumbItemType[]
    expect(breadcrumbItems).toHaveLength(3)

    // Home
    expect(breadcrumbItems[0].key).toBe('home')
    expect((breadcrumbItems[0].title as JSX.Element).props.children).toBe('Home')

    // User
    expect(breadcrumbItems[1].key).toBe('user')
    expect((breadcrumbItems[1].title as JSX.Element).props.children).toBe('User 123')
    expect((breadcrumbItems[1].title as JSX.Element).props.to).toBe('/users/123')

    // Post
    expect(breadcrumbItems[2].key).toBe('post')
    expect((breadcrumbItems[2].title as JSX.Element).props.children).toBe('Post 789')
    expect((breadcrumbItems[2].title as JSX.Element).props.to).toBe('/users/123/posts/789')
  })

  it('should return undefined when no path matches', () => {
    const result = prepareDataForManageableBreadcrumbs({
      data: mockData,
      replaceValues: mockReplaceValues,
      pathname: '/unknown-path',
    })

    expect(result).toBeUndefined()
  })

  it('should handle case where link is undefined (non-clickable breadcrumb)', () => {
    const dataWithNoLink = [
      {
        pathToMatch: '/profile',
        breadcrumbItems: [{ key: 'profile', label: 'Profile', link: undefined }],
      },
    ]

    const result = prepareDataForManageableBreadcrumbs({
      data: dataWithNoLink,
      replaceValues: {},
      pathname: '/profile',
    })

    expect(result).toBeDefined()
    const breadcrumbItems = result?.breadcrumbItems as BreadcrumbItemType[]
    expect(breadcrumbItems[0].title).toBe('Profile')
  })
})
