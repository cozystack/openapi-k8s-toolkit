import styled from 'styled-components'

type TRoundSpanProps = {
  $bgColor?: string
}

const RoundSpan = styled.span<TRoundSpanProps>`
  background-color: ${({ $bgColor }) => $bgColor || 'none'};
  border-radius: 13px;
  padding: 1px 5px;
  font-size: 13px;
  height: min-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  box-sizing: content-box;
`

export const Styled = {
  RoundSpan,
}
