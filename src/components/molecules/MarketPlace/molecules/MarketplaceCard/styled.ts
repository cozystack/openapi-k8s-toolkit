import styled from 'styled-components'
import { Card, Tag } from 'antd'

type TCustomCardProps = {
  $hoverColor: string
  $isDisabled?: boolean
}

const CustomCard = styled(Card)<TCustomCardProps>`
  position: relative;
  width: 238px;
  overflow-x: auto;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  box-shadow:
    0 6px 16px 0 #00000014,
    0 3px 6px -4px #0000001f,
    0 9px 28px 8px #0000000d;

  &:hover {
    border-color: ${({ $hoverColor, $isDisabled }) => !$isDisabled && $hoverColor};
  }

  .ant-card-body {
    height: 238px;
    overflow-x: auto;
    padding: 8px;
  }
`

const ImageContainer = styled.div`
  min-width: 45px;
  min-height: 45px;
  padding: 6px;

  svg {
    width: 45px;
    height: 45px;
  }
`

const OverflowContainer = styled.div`
  overflow-x: auto;
  scrollbar-width: thin;
  margin-bottom: 20px;
`

const TitleContainer = styled.div`
  padding-left: 6px;
  padding-right: 6px;
  font-size: 16px;
  line-height: 24px;

  span {
    font-weight: 700;
  }
`

const TagsContainer = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
  padding-left: 6px;
  padding-right: 6px;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
`

const CustomTag = styled(Tag)`
  margin-right: 4px;
  margin-bottom: 4px;

  &:last-child {
    margin-right: 0;
  }
`

const DescriptionContainer = styled.div`
  padding-left: 6px;
  padding-right: 6px;
`

const EditButtonContainer = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
`

export const Styled = {
  CustomCard,
  ImageContainer,
  OverflowContainer,
  TitleContainer,
  TagsContainer,
  CustomTag,
  DescriptionContainer,
  EditButtonContainer,
}
