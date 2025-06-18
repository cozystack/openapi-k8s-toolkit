import styled from 'styled-components'
import { Form } from 'antd'

type TContainerProps = {
  $designNewLayout?: boolean
}

const Container = styled.div<TContainerProps>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ $designNewLayout }) => ($designNewLayout ? '36px' : '8px')};
  height: 100%;
  min-height: 80vh;
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

const DebugContainer = styled.div`
  min-height: 80vh;
`

export const Styled = {
  ResetedFormList,
  Container,
  ControlsRowContainer,
  DebugContainer,
}
