import styled from 'styled-components'
import { Form } from 'antd'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  height: 100%;
  min-height: 80vh;
`

export const ResetedFormList = styled(Form.List)`
  margin-bottom: 8px;
`

const ContainerWithRemoveButton = styled.div`
  display: grid;
  grid-template-columns: auto 45px;
  margin-left: 8px;
`

const MinusContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 5px;
`

const DebugContainer = styled.div`
  min-height: 80vh;
`

export const Styled = {
  ResetedFormList,
  ContainerWithRemoveButton,
  MinusContainer,
  Container,
  DebugContainer,
}
