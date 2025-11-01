import styled from 'styled-components'

type TRootProps = {
  $substractHeight: number
}

const Root = styled.div<TRootProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - ${({ $substractHeight }) => $substractHeight}px);

  /* border-radius: 12px; */
  overflow: hidden;
  position: relative;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  margin-bottom: 16px;
  padding-left: 19px;
`

const HeaderLeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
`

const CursorPointerDiv = styled.div`
  cursor: pointer;
  user-select: none;
`

const StatusText = styled.div`
  font-size: 16px;
  line-height: 24px; /* 150% */
`

type THeaderRightSideProps = {
  $colorTextDescription: string
}

const HeaderRightSide = styled.div<THeaderRightSideProps>`
  display: flex;
  gap: 4px;
  text-align: right;
  color: ${({ $colorTextDescription }) => $colorTextDescription};
`

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 8px 8px 72px;
  z-index: 2;
`

type TTimelineProps = {
  $colorText: string
  $substractHeight: number
}

const Timeline = styled.div<TTimelineProps>`
  width: 100%;
  height: calc(100vh - ${({ $substractHeight }) => $substractHeight}px);
  position: absolute;
  top: 40px;
  left: 36px;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    width: 1px;
    background: ${({ $colorText }) => $colorText};
    pointer-events: none;
    height: 100%;
  }
`

const Sentinel = styled.div`
  height: 1px;
`

export const Styled = {
  Root,
  Header,
  HeaderLeftSide,
  CursorPointerDiv,
  StatusText,
  HeaderRightSide,
  Timeline,
  List,
  Sentinel,
}
