import React, { FC } from 'react'
import { Flex, Typography, Select, Button } from 'antd'
import { TFormName, TNamespaceData } from 'localTypes/form'
import { MinusIcon, feedbackIcons } from 'components/atoms'
import { CustomSizeTitle, PossibleHiddenContainer, ResetedFormItem } from '../../atoms'
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
      <Flex justify="space-between">
        <CustomSizeTitle $designNewLayout={designNewLayout}>
          namespace<Typography.Text type="danger">*</Typography.Text>
        </CustomSizeTitle>
        <Flex gap={4}>
          {isAdditionalProperties && (
            <Button size="small" type="text" onClick={() => removeField({ path: name })}>
              <MinusIcon />
            </Button>
          )}
        </Flex>
      </Flex>
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
