import React, { FC } from 'react'
import { Button, Dropdown } from 'antd'

export const DropdownAccessGroups: FC = () => {
  const getDropdownItems = () => {
    return [
      'g-advanced-credit-factory',
      'g-advanced-credit-factory',
      'g-advanced-credit-factory',
      'g-advanced-credit-factory',
    ].map((item, i) => ({
      key: `${item}-${i}`,
      label: (
        <div
          onClick={e => {
            e.stopPropagation()
          }}
        >
          {item}
        </div>
      ),
    }))
  }

  return (
    <Dropdown placement="bottomRight" menu={{ items: getDropdownItems() }} trigger={['click']}>
      <Button
        type="link"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        Access Groups
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.8127 3H11.6408C11.5611 3 11.4861 3.03906 11.4393 3.10313L7.0002 9.22188L2.56114 3.10313C2.51426 3.03906 2.43926 3 2.35957 3H1.1877C1.08614 3 1.02676 3.11563 1.08614 3.19844L6.59551 10.7937C6.79551 11.0687 7.20489 11.0687 7.40332 10.7937L12.9127 3.19844C12.9736 3.11563 12.9143 3 12.8127 3Z"
            fill="currentColor"
          />
        </svg>
      </Button>
    </Dropdown>
  )
}
