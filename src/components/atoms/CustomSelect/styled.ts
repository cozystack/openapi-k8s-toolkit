import styled from 'styled-components'
import { Select } from 'antd'

const CustomSelect = styled(Select)`
  width: 100%;
  margin: 0;
  padding: 4px;

  && .ant-select-selector {
    background: none;
  }

  && .ant-select-selector,
  && .ant-select-focused .ant-select-selector,
  && .ant-select-selector:focus,
  && .ant-select-selector:active,
  && .ant-select-open .ant-select-selector {
    align-items: flex-start;
    outline: none !important;
    outline-color: transparent !important;
    box-shadow: none !important;
    padding-inline: 4px !important;
    padding-block: 4px !important;
  }

  && .ant-select-selection-overflow {
    gap: 4px;
  }

  && .ant-select-selection-overflow-item-rest .ant-select-selection-item {
    background: 0;
  }

  && .ant-tag {
    font-size: 14px;
    line-height: 22px;
    border: 0;
    padding-inline: 8px;
  }

  && .ant-select-multiple .ant-select-selection-overflow-item-suffix {
    min-height: 22px !important;
    margin-block: 0 !important;
  }
`

export const Styled = {
  CustomSelect,
}
