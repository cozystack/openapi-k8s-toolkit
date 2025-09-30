import styled from 'styled-components'
import { Form, Tag, Select, Input } from 'antd'

const SelectTag = styled(Tag)`
  margin-inline-end: 4px;
  padding: 4px 6px;
  display: inline-flex;
  align-items: center;
  white-space: normal;
  line-height: 1.1;
`

const SelectTagSpan = styled.span`
  display: inline-flex;
  flex-direction: column;
`

const MaxTagPlacheolder = styled.div`
  padding-left: 16px;
`

type TMaxTagPlaceholderLengthProps = {
  $colorBorder: string
}

const MaxTagPlacheolderLength = styled.span<TMaxTagPlaceholderLengthProps>`
  min-height: 20px;
  padding-right: 4px;
  padding-left: 4px;
  border: 1px solid ${({ $colorBorder }) => $colorBorder};
  border-radius: 20px;
`

const OptionLabelKind = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`

const OptionLabelVersion = styled.div`
  font-size: 10px;
  font-style: italic;
  font-weight: 400;
  line-height: 14px; /* 140% */
`

type TBackgroundContainerProps = {
  $colorBorder: string
  $colorBgLayout: string
}

const BackgroundContainer = styled.div<TBackgroundContainerProps>`
  width: 100%;
  gap: 8px;
  border: 1px solid ${({ $colorBorder }) => $colorBorder};
  border-radius: 6px;
  background: ${({ $colorBgLayout }) => $colorBgLayout};
  padding: 8px;
`

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 8px;
`

const ResetedFormItem = styled(Form.Item)`
  margin-bottom: 0;
`

type THideableContainerProps = {
  $isHidden?: boolean
}

const HideableContainer = styled.div<THideableContainerProps>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'initial')};
`

const CompoundItem = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
`

const LeftSideSelect = styled(Select)`
  /* stylelint-disable declaration-no-important */

  .ant-select-selector {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right-width: 0 !important;
    height: 32px !important;
  }
`

const RightSideInput = styled(Input)`
  &&&.ant-input-outlined {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left-width: 0 !important;
    height: 32px !important;
  }
`

const RightSideSelect = styled(Select)`
  .ant-select-selector {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left-width: 0 !important;
    height: 32px !important;
  }
`

const BottomTagsHolder = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 8px;
`

const CustomTag = styled(Tag)`
  font-size: 14px;
  height: 22px;
  margin-inline-end: 0 !important;
`

type TAbbrProps = {
  $bgColor: string
}

const Abbr = styled.span<TAbbrProps>`
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 13px;
  padding: 2px 5px;
  height: min-content;
`

const ClearButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`

export const Styled = {
  SelectTag,
  SelectTagSpan,
  MaxTagPlacheolder,
  MaxTagPlacheolderLength,
  OptionLabelKind,
  OptionLabelVersion,
  BackgroundContainer,
  FormContainer,
  ResetedFormItem,
  HideableContainer,
  CompoundItem,
  LeftSideSelect,
  RightSideInput,
  RightSideSelect,
  BottomTagsHolder,
  CustomTag,
  Abbr,
  ClearButtonHolder,
}
