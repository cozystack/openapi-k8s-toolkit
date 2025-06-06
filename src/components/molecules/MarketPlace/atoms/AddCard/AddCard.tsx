import React, { FC } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Styled } from './styled'

type TAddCardProps = {
  onAddClick: () => void
}

export const AddCard: FC<TAddCardProps> = ({ onAddClick }) => {
  return (
    <Styled.CustomCard onClick={onAddClick}>
      <PlusOutlined />
    </Styled.CustomCard>
  )
}
