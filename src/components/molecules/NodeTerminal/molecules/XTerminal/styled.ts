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
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  max-height: calc(100vh - 158px);

  /* overflow-y: auto; */

  /* background: black; */

  /* stylelint-disable declaration-no-important */

  * {
    scrollbar-width: thin;
  }

  > div > div {
    width: 100% !important;
  }

  .xterm {
    width: 100% !important;
    height: 100% !important; /* optional */
  }
`

type TShutdownContainerProps = {
  $isVisible?: boolean
}

const ShutdownContainer = styled.div<TShutdownContainerProps>`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  margin-top: -40px;
  display: flex;
  justify-content: flex-end;
`

const ProgressContainer = styled.div`
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
