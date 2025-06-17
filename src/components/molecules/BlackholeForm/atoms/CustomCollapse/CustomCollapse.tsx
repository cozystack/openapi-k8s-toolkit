import React, { FC, ReactNode, PropsWithChildren } from 'react'
import { theme } from 'antd'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { TFormName, TExpandedControls } from 'localTypes/form'
import { DownIcon, UpIcon } from 'components/atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'
import { Styled } from './styled'

type TCustomCollapseProps = PropsWithChildren<{
  title: string | ReactNode
  formName: TFormName
  expandedControls: TExpandedControls
}>

export const CustomCollapse: FC<TCustomCollapseProps> = ({ title, formName, expandedControls, children }) => {
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
      <Styled.TitleBar onClick={() => toggleCollapse()}>
        {!designNewLayout && <div>{isOpen ? <CaretDownOutlined size={14} /> : <CaretRightOutlined size={14} />}</div>}
        <div>{title}</div>
        {designNewLayout && <div>{isOpen ? <DownIcon /> : <UpIcon />}</div>}
      </Styled.TitleBar>
      <Styled.Content $isOpen={isOpen} $designNewLayout={designNewLayout}>
        {children}
      </Styled.Content>
    </Styled.Container>
  )
}
