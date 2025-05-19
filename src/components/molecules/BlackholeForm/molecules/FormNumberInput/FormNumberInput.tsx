/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { InputNumber, Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { CursorPointerText, PersistedCheckbox, PossibleHiddenContainer, ResetedFormItem } from '../../atoms'

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
  return (
    <PossibleHiddenContainer $isHidden={isHidden}>
      <Typography.Text>
        {getStringByName(name)}
        {required?.includes(getStringByName(name)) && <Typography.Text type="danger">*</Typography.Text>}
        {description && (
          <Tooltip title={description}>
            {' '}
            <QuestionCircleOutlined />
          </Tooltip>
        )}
        {isAdditionalProperties && (
          <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
            Удалить
          </CursorPointerText>
        )}
        <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="number" />
      </Typography.Text>
      <ResetedFormItem
        key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
        name={arrName || name}
        rules={[{ required: forceNonRequired === false && required?.includes(getStringByName(name)) }]}
        validateTrigger="onBlur"
        hasFeedback
      >
        <InputNumber placeholder={getStringByName(name)} step={isNumber ? 0.1 : 1} />
      </ResetedFormItem>
    </PossibleHiddenContainer>
  )
}
