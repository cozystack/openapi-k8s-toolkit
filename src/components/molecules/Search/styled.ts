import { Tag } from 'antd'
import styled from 'styled-components'

export const CatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  margin: auto;
`

const SelectTag = styled(Tag)`
  margin-inline-end: 4px;
  padding: 4px 6px;
  display: inline-flex;
  align-items: center;
  white-space: normal;
  line-height: 1.1;
  max-width: 240px;
`

const SelectTagSpan = styled.span`
  display: inline-flex;
  flex-direction: column;
`

const FormContainer = styled.div`
  width: 450px;
`

type THideableContainerProps = {
  $isHidden?: boolean
}

const HideableContainer = styled.div<THideableContainerProps>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'initial')};
`

export const Styled = {
  CatContainer,
  SelectTag,
  SelectTagSpan,
  FormContainer,
  HideableContainer,
}
