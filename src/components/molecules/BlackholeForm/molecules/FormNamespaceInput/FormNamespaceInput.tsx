import React, { FC } from 'react'
import { Typography, Select } from 'antd'
import { TFormName, TNamespaceData } from 'localTypes/form'
import { CursorPointerText, PossibleHiddenContainer, ResetedFormItem } from '../../atoms'

type TFormNamespaceInputProps = {
  name: TFormName
  isHidden?: boolean
  namespaceData: TNamespaceData
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
}

export const FormNamespaceInput: FC<TFormNamespaceInputProps> = ({
  name,
  isHidden,
  namespaceData,
  isAdditionalProperties,
  removeField,
}) => {
  if (!namespaceData) {
    return null
  }

  return (
    <PossibleHiddenContainer $isHidden={isHidden}>
      <Typography.Text>
        namespace<Typography.Text type="danger">*</Typography.Text>
        {isAdditionalProperties && (
          <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
            Удалить
          </CursorPointerText>
        )}
      </Typography.Text>
      <ResetedFormItem name={name} rules={[{ required: true }]} validateTrigger="onBlur" hasFeedback>
        <Select
          placeholder="Select namespace"
          options={namespaceData.selectValues}
          filterOption={namespaceData.filterSelectOptions}
          allowClear
          disabled={namespaceData.disabled}
          showSearch
        />
      </ResetedFormItem>
    </PossibleHiddenContainer>
  )
}
