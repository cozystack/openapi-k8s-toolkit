import React, { FC } from 'react'
import { Button, Dropdown, Flex } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { EditIcon, DeleteIcon } from 'components/atoms'

type TDropdownActionsProps = {
  onDelete?: () => void
  onUpdate?: () => void
}

export const DropdownActions: FC<TDropdownActionsProps> = ({ onDelete, onUpdate }) => {
  const getDropdownItems = () => {
    const items = []
    if (onUpdate) {
      items.push({
        key: 'update',
        label: (
          <div
            onClick={e => {
              e.stopPropagation()
              onUpdate()
            }}
          >
            <Flex align="center" gap={8}>
              <EditIcon />
              Edit
            </Flex>
          </div>
        ),
      })
    }
    if (onDelete) {
      items.push({
        key: 'delete',
        label: (
          <div
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Flex align="center" gap={8}>
              <DeleteIcon />
              Delete
            </Flex>
          </div>
        ),
      })
    }
    return items
  }

  return (
    <Dropdown placement="bottomRight" menu={{ items: getDropdownItems() }} trigger={['click']}>
      <Button
        type="text"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <EllipsisOutlined />
      </Button>
    </Dropdown>
  )
}
