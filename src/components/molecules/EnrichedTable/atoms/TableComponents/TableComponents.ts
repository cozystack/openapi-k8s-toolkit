import styled from 'styled-components'

type TTableContainerProps = {
  $isDark?: boolean
  $isCursorPointer?: boolean
}

const TableContainer = styled.div<TTableContainerProps>`
  td {
    cursor: ${({ $isCursorPointer }) => $isCursorPointer && 'pointer'};
  }

  && .ant-table-container {
    border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.10)' : '#EAEAEC')};
    border-bottom: 0;
  }

  && .ant-table-cell {
    font-size: 14px;
    line-height: 22px;
    padding: 10px 16px;
  }

  && thead .ant-table-cell {
    padding: 10px 16px;
  }

  && .controls {
    padding: 9px 12px;
  }

  && .ant-table-pagination {
    border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.10)' : '#EAEAEC')};
    border-radius: 0 0 8px 8px;
    border-top: 0;
    margin: 0;
    padding: 8px 16px;
  }

  && .ant-pagination-total-text {
    position: absolute;
    right: 16px;
  }

  && .ant-table-expanded-row-fixed {
    width: auto !important;
  }
`

const HideableControls = styled.div`
  && .ant-table-row .hideable {
    display: none;
  }

  && .ant-table-row:hover .hideable {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 4px;
  }
`

export const TableComponents = {
  TableContainer,
  HideableControls,
}
