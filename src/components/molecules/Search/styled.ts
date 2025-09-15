import { Tag } from 'antd'
import styled from 'styled-components'

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
  display: grid;
  grid-template-columns: 300px 100px 1fr;
  gap: 16px;
`

type THideableContainerProps = {
  $isHidden?: boolean
}

const HideableContainer = styled.div<THideableContainerProps>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'initial')};
`

export const Styled = {
  SelectTag,
  SelectTagSpan,
  FormContainer,
  HideableContainer,
}
