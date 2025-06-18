/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { Flex, Typography, Tooltip, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { MinusIcon } from 'components/atoms'
import { PersistedCheckbox, CustomSizeTitle } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'

type TFormArrayHeaderProps = {
  name: TFormName
  persistName?: TFormName
  required?: string[]
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
  onRemoveByMinus?: () => void
}

export const FormArrayHeader: FC<TFormArrayHeaderProps> = ({
  name,
  persistName,
  required,
  description,
  isAdditionalProperties,
  removeField,
  persistedControls,
  onRemoveByMinus,
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
    <Flex justify="space-between">
      <CustomSizeTitle $designNewLayout={designNewLayout}>
        {description ? <Tooltip title={description}>{title}</Tooltip> : title}
        <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="arr" />
      </CustomSizeTitle>
      <div>
        {isAdditionalProperties && (
          <Button size="small" type="text" onClick={() => removeField({ path: name })}>
            <MinusIcon />
          </Button>
        )}
        {onRemoveByMinus && (
          <Button size="small" type="text" onClick={onRemoveByMinus}>
            <MinusIcon />
          </Button>
        )}
      </div>
    </Flex>
  )
}
