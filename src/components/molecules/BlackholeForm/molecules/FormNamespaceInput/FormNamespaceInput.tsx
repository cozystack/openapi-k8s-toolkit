import React, { FC } from 'react'
import { Typography, Select } from 'antd'
import { TFormName, TNamespaceData } from 'localTypes/form'
import { feedbackIcons } from 'components/atoms'
import { CursorPointerText, CustomSizeTitle, PossibleHiddenContainer, ResetedFormItem } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'

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
  const designNewLayout = useDesignNewLayout()

  if (!namespaceData) {
    return null
  }

  return (
    <PossibleHiddenContainer $isHidden={isHidden}>
      <CustomSizeTitle $designNewLayout={designNewLayout}>
        namespace<Typography.Text type="danger">*</Typography.Text>
        {isAdditionalProperties && (
          <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
            Удалить
          </CursorPointerText>
        )}
      </CustomSizeTitle>
      <ResetedFormItem
        name={name}
        rules={[{ required: true }]}
        validateTrigger="onBlur"
        hasFeedback={designNewLayout ? { icons: feedbackIcons } : true}
      >
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
