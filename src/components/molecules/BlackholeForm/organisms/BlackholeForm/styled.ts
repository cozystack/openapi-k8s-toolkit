import styled from 'styled-components'
import { Form } from 'antd'

type TContainerProps = {
  $designNewLayout?: boolean
  $designNewLayoutHeight?: number
}

const Container = styled.div<TContainerProps>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ $designNewLayout }) => ($designNewLayout ? '36px' : '8px')};
  height: ${({ $designNewLayoutHeight }) => ($designNewLayoutHeight ? `${$designNewLayoutHeight}px` : '75vh')};
`

const OverflowContainer = styled.div`
  overflow-x: auto;
  scrollbar-width: thin;
`

export const ResetedFormList = styled(Form.List)`
  margin-bottom: 8px;
`

type TControlsRowContainerProps = {
  $designNewLayout?: boolean
  $bgColor: string
}

const ControlsRowContainer = styled.div<TControlsRowContainerProps>`
  margin-top: 10px;
  display: flex;
  align-items: center;
  background-color: ${({ $bgColor, $designNewLayout }) => ($designNewLayout ? $bgColor : 'initial')};
  border-radius: 8px;
  padding: 4px;
`

type TDebugContainerProps = {
  $designNewLayoutHeight?: number
}

const DebugContainer = styled.div<TDebugContainerProps>`
  height: ${({ $designNewLayoutHeight }) => ($designNewLayoutHeight ? `${$designNewLayoutHeight}px` : '75vh')};
`

export const Styled = {
  ResetedFormList,
  Container,
  OverflowContainer,
  ControlsRowContainer,
  DebugContainer,
}
