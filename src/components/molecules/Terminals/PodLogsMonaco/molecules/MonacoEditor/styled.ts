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

type TRightAboveContainerProps = {
  $isVisible?: boolean
}

const RightAboveContainer = styled.div<TRightAboveContainerProps>`
  margin-top: -40px;
  display: flex;
  justify-content: flex-end;
`

export const Styled = {
  FullWidthDiv,
  CustomCard,
  RightAboveContainer,
}
