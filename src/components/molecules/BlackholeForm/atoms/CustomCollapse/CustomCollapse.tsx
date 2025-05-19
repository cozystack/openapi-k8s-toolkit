import React, { FC, ReactNode, PropsWithChildren } from 'react'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { TFormName, TExpandedControls } from 'localTypes/form'
import { Styled } from './styled'

type TCustomCollapseProps = PropsWithChildren<{
  title: string | ReactNode
  formName: TFormName
  expandedControls: TExpandedControls
}>

export const CustomCollapse: FC<TCustomCollapseProps> = ({ title, formName, expandedControls, children }) => {
  const isOpen = expandedControls.expandedKeys.some(arr => JSON.stringify(arr) === JSON.stringify(formName))

  const toggleCollapse = () => {
    if (isOpen) {
      expandedControls.onExpandClose(formName)
    } else {
      expandedControls.onExpandOpen(formName)
    }
  }

  return (
    <Styled.Container>
      <Styled.TitleBar onClick={() => toggleCollapse()}>
        <div>{isOpen ? <CaretDownOutlined size={14} /> : <CaretRightOutlined size={14} />}</div>
        <div>{title}</div>
      </Styled.TitleBar>
      <Styled.Content $isOpen={isOpen}>{children}</Styled.Content>
    </Styled.Container>
  )
}
