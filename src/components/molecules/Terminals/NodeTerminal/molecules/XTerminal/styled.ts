import styled from 'styled-components'

type TCustomCardProps = {
  $isVisible?: boolean
  $substractHeight: number
}

const CustomCard = styled.div<TCustomCardProps>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  height: calc(100vh - ${({ $substractHeight }) => $substractHeight}px);

  * {
    scrollbar-width: thin;
  }
`

type TFullWidthDivProps = {
  $substractHeight: number
}

const FullWidthDiv = styled.div<TFullWidthDivProps>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100vh - ${({ $substractHeight }) => $substractHeight}px);
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
