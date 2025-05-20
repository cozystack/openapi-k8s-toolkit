import React, { FC, useState } from 'react'
import { Input, Tree, TreeDataNode, TreeProps } from 'antd'
import { Styled } from './styled'

const { Search } = Input

export type TTreeWithSearchProps = {
  treeData: TreeDataNode[]
  onSelect: TreeProps['onSelect']
}

export const TreeWithSearch: FC<TTreeWithSearchProps> = ({ treeData, onSelect }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    // Build a map from node key to parent key
    const keyToParentMap: Record<string, string | null> = {}

    const buildMap = (nodes: TreeDataNode[], parentKey: string | null) => {
      nodes.forEach(node => {
        keyToParentMap[node.key as string] = parentKey
        if (node.children) {
          buildMap(node.children, node.key as string)
        }
      })
    }

    buildMap(treeData, null)

    // Function to collect all ancestor keys of a given node
    const collectAncestors = (key: string): string[] => {
      const ancestors: string[] = []
      let currentKey = keyToParentMap[key]

      while (currentKey) {
        ancestors.push(currentKey)
        currentKey = keyToParentMap[currentKey]
      }

      return ancestors
    }

    const keys: string[] = []

    // Traverse the tree to find matches and their ancestors
    const loop = (data: TreeDataNode[]) => {
      data.forEach(item => {
        const title = item.title as string
        if (title.toLowerCase().includes(value.toLowerCase())) {
          keys.push(item.key as string)
          const ancestors = collectAncestors(item.key as string)
          keys.push(...ancestors)
        }

        if (item.children) {
          loop(item.children)
        }
      })
    }

    loop(treeData)

    const uniqueKeys = Array.from(new Set(keys)).filter(Boolean)
    setExpandedKeys(uniqueKeys)
    setSearchValue(value)
  }

  const loop = (data: TreeDataNode[]): TreeDataNode[] =>
    data.map(item => {
      const strTitle = item.title as string
      const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase())
      const beforeStr = strTitle.substring(0, index)
      const afterStr = strTitle.substring(index + searchValue.length)

      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{strTitle}</span>
        )

      if (item.children) {
        return { ...item, title, children: loop(item.children) }
      }

      return { ...item, title }
    })

  return (
    <>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Styled.CustomTreeProvider>
        <Tree
          treeData={loop(treeData)}
          expandedKeys={expandedKeys}
          onExpand={keys => {
            setExpandedKeys(keys as string[])
          }}
          onSelect={(key, info) => {
            if (onSelect) {
              onSelect(key, info)
            }
            // if (info.selected) {
            if (!expandedKeys.includes(info.node.key)) {
              setExpandedKeys([...expandedKeys, info.node.key])
            } else {
              setExpandedKeys([...expandedKeys.filter(el => el !== info.node.key)])
            }
          }}
        />
      </Styled.CustomTreeProvider>
    </>
  )
}
