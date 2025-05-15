import React, { FC } from 'react'
import { Tooltip, Tag, Flex } from 'antd'

type TTrimmedTagsProps = {
  tags: string[]
  trimLength?: number
}

export const TrimmedTags: FC<TTrimmedTagsProps> = ({ tags, trimLength }) => {
  const renderTags = (tags: string[]) =>
    tags.map(tag => (
      <Tag key={tag} style={{ margin: 0, flexShrink: 0 }}>
        {tag}
      </Tag>
    ))

  if (trimLength && trimLength < tags.length) {
    return (
      <Flex wrap="nowrap" gap="4px">
        {renderTags(tags.slice(0, trimLength))}
        <Tooltip title={<>{renderTags(tags.slice(trimLength))}</>}>
          <Tag key="more">+{tags.length - trimLength}</Tag>
        </Tooltip>
      </Flex>
    )
  }

  return (
    <Flex wrap="nowrap" gap="4px">
      {renderTags(tags)}
    </Flex>
  )
}
