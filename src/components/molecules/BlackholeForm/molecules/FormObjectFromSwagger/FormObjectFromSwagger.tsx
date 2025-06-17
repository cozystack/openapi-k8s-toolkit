import React, { FC } from 'react'
import { OpenAPIV2, IJsonSchema } from 'openapi-types'
import { Typography, Tooltip, Input } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TExpandedControls, TPersistedControls } from 'localTypes/form'
import { CursorPointerText, CustomCollapse, PersistedCheckbox, PossibleHiddenContainer } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'
import { Styled } from './styled'

type TFormObjectFromSwaggerProps = {
  name: TFormName
  persistName?: TFormName
  selfRequired?: boolean
  isHidden?: boolean
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  expandedControls: TExpandedControls
  persistedControls: TPersistedControls
  collapseTitle: TFormName
  collapseFormName: TFormName
  data?: JSX.Element
  inputProps?: {
    addField: ({
      path,
      name,
      type,
      items,
      nestedProperties,
      required,
    }: {
      path: TFormName
      name: string
      type: string
      items?: { type: string }
      nestedProperties?: OpenAPIV2.SchemaObject['properties']
      required?: string
    }) => void
    additionalProperties: boolean | IJsonSchema | undefined
  }
}

export const FormObjectFromSwagger: FC<TFormObjectFromSwaggerProps> = ({
  name,
  persistName,
  selfRequired,
  isHidden,
  description,
  isAdditionalProperties,
  removeField,
  expandedControls,
  persistedControls,
  collapseTitle,
  collapseFormName,
  data,
  inputProps,
}) => {
  const designNewLayout = useDesignNewLayout()

  const title = (
    <>
      {getStringByName(collapseTitle)}
      {selfRequired && <Typography.Text type="danger">*</Typography.Text>}
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
      <CustomCollapse
        title={
          <Styled.Title $designNewLayout={designNewLayout}>
            {description ? <Tooltip title={description}>{title}</Tooltip> : title}
            {isAdditionalProperties && (
              <CursorPointerText type="secondary" onClick={() => removeField({ path: name })}>
                Удалить
              </CursorPointerText>
            )}
            <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="obj" />
          </Styled.Title>
        }
        formName={collapseFormName}
        expandedControls={expandedControls}
        key={Array.isArray(name) ? name.join('-') : name}
      >
        {inputProps && (
          <Input.Search
            placeholder="Введите имя поля"
            allowClear
            enterButton="Добавить"
            onSearch={value => {
              if (value.length > 0) {
                const addProps = inputProps.additionalProperties as {
                  type: string
                  items?: { type: string }
                  properties?: OpenAPIV2.SchemaObject['properties']
                  required?: string
                }
                inputProps.addField({
                  path: Array.isArray(name) ? [...name, String(collapseTitle)] : [name, String(collapseTitle)],
                  name: value,
                  type: addProps.type,
                  items: addProps.items,
                  nestedProperties: addProps.properties || {},
                  required: addProps.required,
                })
              }
            }}
          />
        )}
        {data}
      </CustomCollapse>
    </PossibleHiddenContainer>
  )
}
