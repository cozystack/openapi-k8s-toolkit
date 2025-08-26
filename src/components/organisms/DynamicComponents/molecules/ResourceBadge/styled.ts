import styled from 'styled-components'

type TRoundSpanProps = {
  $bgColor?: string
}

const RoundSpan = styled.span<TRoundSpanProps>`
  background-color: ${({ $bgColor }) => $bgColor || 'none'};
  /* border-radius: 50%; */
  border-radius: 10px;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.28rem;
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
