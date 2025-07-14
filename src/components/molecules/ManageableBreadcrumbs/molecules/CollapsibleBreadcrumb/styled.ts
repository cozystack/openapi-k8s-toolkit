import styled from 'styled-components'

const PositionRelativeContainer = styled.div`
  position: relative;
`

const FullWidthContainer = styled.div`
  width: 100%;

  .ant-dropdown-trigger svg {
    display: none;
  }
`

const NoWrapContainer = styled.div`
  position: absolute;
  visibility: hidden;
  pointer-events: none;

  /* stylelint-disable declaration-no-important */

  * {
    white-space: nowrap !important;
  }

  ol {
    flex-wrap: nowrap !important;
  }
`

export const Styled = {
  PositionRelativeContainer,
  FullWidthContainer,
  NoWrapContainer,
}
