/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { InputNumber, Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { feedbackIcons } from 'components/atoms'
import {
  CursorPointerText,
  PersistedCheckbox,
  PossibleHiddenContainer,
  ResetedFormItem,
  CustomSizeTitle,
} from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'

type TFormNumberItemProps = {
  isNumber?: boolean
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
}

export const FormNumberInput: FC<TFormNumberItemProps> = ({
  isNumber,
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  description,
  isAdditionalProperties,
  removeField,
  persistedControls,
}) => {
  const designNewLayout = useDesignNewLayout()

  const title = (
    <>
      {getStringByName(name)}
      {required?.includes(getStringByName(name)) && <Typography.Text type="danger">*</Typography.Text>}
      {!designNewLayout && description && (
        <Tooltip title={description}>
          {' '}
          <QuestionCircleOutlined />
        </Tooltip>
      )}
    </>
  )

  return (
    <PossibleHiddenContainer $isHidden={isHidden}>
      <CustomSizeTitle $designNewLayout={designNewLayout}>
        {description ? <Tooltip title={description}>{title}</Tooltip> : title}
        {isAdditionalProperties && (
          <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
            Удалить
          </CursorPointerText>
        )}
        <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="number" />
      </CustomSizeTitle>
      <ResetedFormItem
        key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
        name={arrName || name}
        rules={[{ required: forceNonRequired === false && required?.includes(getStringByName(name)) }]}
        validateTrigger="onBlur"
        hasFeedback={designNewLayout ? { icons: feedbackIcons } : true}
      >
        <InputNumber placeholder={getStringByName(name)} step={isNumber ? 0.1 : 1} />
      </ResetedFormItem>
    </PossibleHiddenContainer>
  )
}
