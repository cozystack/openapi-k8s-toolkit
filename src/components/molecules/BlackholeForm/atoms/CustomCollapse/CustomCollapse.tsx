import React, { FC, ReactNode, PropsWithChildren } from 'react'
import { Flex, Button, theme } from 'antd'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { TFormName, TExpandedControls } from 'localTypes/form'
import { DownIcon, UpIcon, MinusIcon } from 'components/atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'
import { Styled } from './styled'

type TCustomCollapseProps = PropsWithChildren<{
  title: string | ReactNode
  formName: TFormName
  expandedControls: TExpandedControls
  isAdditionalProperties?: boolean
  removeField: () => void
  onRemoveByMinus?: () => void
}>

export const CustomCollapse: FC<TCustomCollapseProps> = ({
  title,
  formName,
  expandedControls,
  isAdditionalProperties,
  removeField,
  onRemoveByMinus,
  children,
}) => {
  const { token } = theme.useToken()
  const isOpen = expandedControls.expandedKeys.some(arr => JSON.stringify(arr) === JSON.stringify(formName))
  const designNewLayout = useDesignNewLayout()

  const toggleCollapse = () => {
    if (isOpen) {
      expandedControls.onExpandClose(formName)
    } else {
      expandedControls.onExpandOpen(formName)
    }
  }

  return (
    <Styled.Container
      $designNewLayout={designNewLayout}
      $borderColor={token.colorBorder}
      $bgColor={token.colorBgContainer}
    >
      <Flex justify="space-between">
        <Styled.TitleBar onClick={() => toggleCollapse()}>
          {!designNewLayout && <div>{isOpen ? <CaretDownOutlined size={14} /> : <CaretRightOutlined size={14} />}</div>}
          <div>{title}</div>
          {designNewLayout && <div>{isOpen ? <DownIcon /> : <UpIcon />}</div>}
        </Styled.TitleBar>
        <div>
          {isAdditionalProperties && (
            <Button size="small" type="text" onClick={() => removeField()}>
              <MinusIcon />
            </Button>
          )}
          {onRemoveByMinus && (
            <Button size="small" type="text" onClick={onRemoveByMinus}>
              <MinusIcon />
            </Button>
          )}
        </div>
      </Flex>
      <Styled.Content $isOpen={isOpen} $designNewLayout={designNewLayout}>
        {children}
      </Styled.Content>
    </Styled.Container>
  )
}
