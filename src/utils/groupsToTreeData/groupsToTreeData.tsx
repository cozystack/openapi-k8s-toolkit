import type { DataNode } from 'antd/es/tree'

// export const toAntdTreeData = ({ apis }: { apis: string[] }): DataNode[] => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const domainTree: Record<string, any> = {}

//   apis.forEach(api => {
//     const [fullDomain, version] = api.split('/')
//     const parts = fullDomain.split('.')

//     if (parts.length < 2) return // skip invalid

//     const rootDomain = parts.slice(-2).join('.') // e.g. "zalan.do"
//     const subdomains = parts.slice(0, -2).reverse() // ['acid', 'baz', 'bar', ...]

//     // eslint-disable-next-line no-multi-assign
//     let current = (domainTree[rootDomain] = domainTree[rootDomain] || {})

//     // eslint-disable-next-line no-restricted-syntax
//     for (const sub of subdomains) {
//       current[sub] = current[sub] || {}
//       current = current[sub]
//     }

//     current[version] = api // leaf value is full string
//   })

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const buildTree = (node: any, prefix = ''): DataNode[] =>
//     Object.entries(node).map(([key, value]) => {
//       const fullKey = prefix ? `${prefix}.${key}` : key
//       if (typeof value === 'string') {
//         return { title: value, key: value, isLeaf: true }
//       }
//       const children = buildTree(value, fullKey)
//       return {
//         title: key,
//         key: fullKey,
//         children,
//         isLeaf: children.length === 0,
//       }
//     })

//   return Object.entries(domainTree).map(([rootDomain, children]) => ({
//     title: rootDomain,
//     key: rootDomain,
//     children: buildTree(children, rootDomain),
//     isLeaf: false,
//   }))
// }

export type TGroupsToTreeDataProps = { apis: string[]; highlightString: string }[]

type TLeafNodeData = {
  value: string
  highlight: boolean
}

// This is a recursive object with possible LeafNodeData at the leaves
type TTreeNode = {
  [key: string]: TTreeNode | TLeafNodeData
}

// Type guard to narrow TreeNode to LeafNodeData
const isLeafNode = (value: TTreeNode | TLeafNodeData): value is TLeafNodeData => {
  return typeof value === 'object' && 'value' in value && 'highlight' in value
}

export const groupsToTreeData = (entries: TGroupsToTreeDataProps): DataNode[] => {
  const domainTree: Record<string, TTreeNode> = {}

  entries.forEach(({ apis, highlightString }) => {
    apis.forEach(api => {
      const [fullDomain, version] = api.split('/')
      const parts = fullDomain.split('.')

      if (parts.length < 2) return

      const rootDomain = parts.slice(-2).join('.')
      const subdomains = parts.slice(0, -2).reverse()

      // eslint-disable-next-line no-multi-assign
      let current: TTreeNode = (domainTree[rootDomain] = domainTree[rootDomain] || {})

      // eslint-disable-next-line no-restricted-syntax
      for (const sub of subdomains) {
        current[sub] = current[sub] || {}
        current = current[sub] as TTreeNode
      }

      current[version] = {
        value: api,
        // highlight: api.includes(highlightString),
        highlight: api === highlightString,
      }
    })
  })

  const buildTree = (node: TTreeNode, prefix = ''): DataNode[] =>
    Object.entries(node).map(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (isLeafNode(value)) {
        return {
          // title: value.highlight ? <span style={{ color: 'red' }}>{value.value}</span> : value.value,
          title: value.highlight ? `${value.value} (pref)` : value.value,
          key: value.value,
          isLeaf: true,
        }
      }

      const children = buildTree(value, fullKey)

      return {
        title: key,
        key: fullKey,
        children,
        isLeaf: children.length === 0,
      }
    })

  return Object.entries(domainTree).map(([rootDomain, children]) => ({
    title: rootDomain,
    key: rootDomain,
    children: buildTree(children, rootDomain),
    isLeaf: false,
  }))
}

export const getBuiltinTreeData = (apis: string[]): DataNode[] => {
  return apis.map(api => ({
    title: `${api} (pref)`,
    key: api,
    isLeaf: true,
  }))
}
