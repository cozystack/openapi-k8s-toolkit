import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 16px;
  border: 1px solid #434343;
  border-radius: 8px;
`

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`

type TContentProps = {
  $isOpen?: boolean
}

const Content = styled.div<TContentProps>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding: 4px;
`

export const Styled = {
  Container,
  TitleBar,
  Content,
}
