import React, { FC } from 'react'
import { Select } from 'antd'

type TSearchTextInputProps = {
  uniqueTags: string[]
  onSelectedTags: (tags: string[]) => void
  selectedTags: string[]
}

export const SearchTextInput: FC<TSearchTextInputProps> = ({ uniqueTags, selectedTags, onSelectedTags }) => {
  const options = uniqueTags.map(el => ({ key: el, value: el }))

  return (
    <Select<string[]>
      mode="tags"
      placeholder="Search"
      tokenSeparators={[',', ' ', '	']}
      allowClear
      options={options}
      onClear={() => {
        onSelectedTags([])
      }}
      value={selectedTags}
      onChange={tags => onSelectedTags(tags)}
      style={{ width: '240px' }}
    />
  )
}
