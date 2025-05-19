/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { Typography, Tooltip, Select } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { CursorPointerText, PersistedCheckbox, PossibleHiddenContainer, ResetedFormItem } from '../../atoms'

type TFormEnumStringInputProps = {
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
  options: string[]
  persistedControls: TPersistedControls
}

export const FormEnumStringInput: FC<TFormEnumStringInputProps> = ({
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
  options,
  persistedControls,
}) => {
  const fixedName = name === 'nodeName' ? 'nodeNameBecauseOfSuddenBug' : name

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
        <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="str" />
      </Typography.Text>
      <ResetedFormItem
        key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
        name={arrName || fixedName}
        rules={[{ required: forceNonRequired === false && required?.includes(getStringByName(name)) }]}
        validateTrigger="onBlur"
        hasFeedback
      >
        <Select options={options.map(el => ({ value: el, label: el }))} placeholder={getStringByName(name)} />
      </ResetedFormItem>
    </PossibleHiddenContainer>
  )
}
