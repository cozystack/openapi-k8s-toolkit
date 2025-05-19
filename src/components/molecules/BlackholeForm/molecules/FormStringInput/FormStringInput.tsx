/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { Input, Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { CursorPointerText, PersistedCheckbox, PossibleHiddenContainer, ResetedFormItem } from '../../atoms'

type TFormStringInputProps = {
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

export const FormStringInput: FC<TFormStringInputProps> = ({
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
  const fixedName = name === 'nodeName' ? 'nodeNameBecauseOfSuddenBug' : name

  return (
    <PossibleHiddenContainer $isHidden={isHidden}>
      <Typography.Text>
        {getStringByName(name)}
        {/* <DebugNameViewer name={name} arrKey={arrKey} arrName={arrName} persistName={persistName} /> */}
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
        <Input placeholder={getStringByName(name)} />
      </ResetedFormItem>
    </PossibleHiddenContainer>
  )
}
