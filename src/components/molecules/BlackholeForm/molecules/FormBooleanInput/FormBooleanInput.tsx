/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { Switch, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName } from 'localTypes/form'
import { BackToDefaultIcon } from 'components/atoms'
import { CursorPointerText, PossibleHiddenContainer, ResetedFormItem, CustomSizeTitle } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'
import { Styled } from './styled'

type TFormBooleanInputProps = {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  isHidden?: boolean
  description?: string
  makeValueUndefined?: (path: TFormName) => void
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
}

export const FormBooleanInput: FC<TFormBooleanInputProps> = ({
  name,
  arrKey,
  arrName,
  isHidden,
  description,
  makeValueUndefined,
  isAdditionalProperties,
  removeField,
}) => {
  const designNewLayout = useDesignNewLayout()

  const title = (
    <>
      {getStringByName(name)}
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
      </CustomSizeTitle>
      <Styled.SwitchAndCrossContainer>
        <ResetedFormItem
          key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
          name={arrName || name}
        >
          <Switch size="small" />
        </ResetedFormItem>
        <Styled.CrossContainer
          onClick={() => {
            if (makeValueUndefined) {
              makeValueUndefined(name)
            }
          }}
        >
          <BackToDefaultIcon />
        </Styled.CrossContainer>
      </Styled.SwitchAndCrossContainer>
    </PossibleHiddenContainer>
  )
}
