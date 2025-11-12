import styled from 'styled-components'

type TCustomCardProps = {
  $isVisible?: boolean
  $substractHeight: number
}

const CustomCard = styled.div<TCustomCardProps>`
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  height: calc(100vh - ${({ $substractHeight }) => $substractHeight}px);
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;

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
  align-items: center;
  width: 100%;
  flex: 1;
  overflow: hidden;
`

const StatusBar = styled.div`
  background-color: #2d2d2d;
  color: #ffffff;
  padding: 8px 16px;
  font-size: 12px;
  border-bottom: 1px solid #3d3d3d;
  display: flex;
  align-items: center;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #ffffff;
`

export const Styled = {
  FullWidthDiv,
  CustomCard,
  StatusBar,
  LoadingContainer,
}

