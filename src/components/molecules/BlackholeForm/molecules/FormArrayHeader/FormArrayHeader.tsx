/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { CursorPointerText, PersistedCheckbox, CustomSizeTitle } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'

type TFormArrayHeaderProps = {
  name: TFormName
  persistName?: TFormName
  required?: string[]
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
}

export const FormArrayHeader: FC<TFormArrayHeaderProps> = ({
  name,
  persistName,
  required,
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
    <CustomSizeTitle $designNewLayout={designNewLayout}>
      {description ? <Tooltip title={description}>{title}</Tooltip> : title}
      {isAdditionalProperties && (
        <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
          Удалить
        </CursorPointerText>
      )}
      <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="arr" />
    </CustomSizeTitle>
  )
}
