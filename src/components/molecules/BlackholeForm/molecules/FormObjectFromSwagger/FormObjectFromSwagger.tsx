import React, { FC, useState } from 'react'
import { OpenAPIV2, IJsonSchema } from 'openapi-types'
import { Typography, Tooltip, Input, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getStringByName } from 'utils/getStringByName'
import { TFormName, TExpandedControls, TPersistedControls } from 'localTypes/form'
import { PlusIcon } from 'components/atoms'
import { CustomCollapse, PersistedCheckbox, PossibleHiddenContainer, CustomSizeTitle } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'

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
  onRemoveByMinus?: () => void
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
  onRemoveByMinus,
}) => {
  const designNewLayout = useDesignNewLayout()
  const [additionalPropValue, setAddditionalPropValue] = useState<string>()

  const additionalPropCreate = () => {
    if (additionalPropValue && additionalPropValue.length > 0) {
      const addProps = inputProps?.additionalProperties as {
        type: string
        items?: { type: string }
        properties?: OpenAPIV2.SchemaObject['properties']
        required?: string
      }
      inputProps?.addField({
        path: Array.isArray(name) ? [...name, String(collapseTitle)] : [name, String(collapseTitle)],
        name: additionalPropValue,
        type: addProps.type,
        items: addProps.items,
        nestedProperties: addProps.properties || {},
        required: addProps.required,
      })
      setAddditionalPropValue(undefined)
    }
  }

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
          <CustomSizeTitle $designNewLayout={designNewLayout}>
            {description ? <Tooltip title={description}>{title}</Tooltip> : title}
            <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="obj" />
          </CustomSizeTitle>
        }
        formName={collapseFormName}
        expandedControls={expandedControls}
        isAdditionalProperties={isAdditionalProperties}
        removeField={() => removeField({ path: name })}
        onRemoveByMinus={onRemoveByMinus}
        key={Array.isArray(name) ? name.join('-') : name}
      >
        {data}
        {inputProps && (
          <Input
            placeholder="Enter field name"
            allowClear
            value={additionalPropValue}
            onChange={e => setAddditionalPropValue(e.target.value)}
            suffix={
              <Button size="small" type="text" onClick={additionalPropCreate}>
                <PlusIcon />
              </Button>
            }
          />
        )}
      </CustomCollapse>
    </PossibleHiddenContainer>
  )
}
