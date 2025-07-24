import styled from 'styled-components'

const FullWidthDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

type TCustomCardProps = {
  $isVisible?: boolean
}

const CustomCard = styled.div<TCustomCardProps>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  max-height: calc(100vh - 158px);

  * {
    scrollbar-width: thin;
  }
`

type TShutdownContainerProps = {
  $isVisible?: boolean
}

const ShutdownContainer = styled.div<TShutdownContainerProps>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  margin-top: -40px;
  display: flex;
  justify-content: flex-end;
`

const ProgressContainer = styled.div`
  margin-top: -464px;
  height: 464px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`

export const Styled = {
  FullWidthDiv,
  CustomCard,
  ShutdownContainer,
  ProgressContainer,
}
