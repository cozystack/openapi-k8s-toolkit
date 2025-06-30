/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC } from 'react'
import { Flex, Typography, Tooltip, Select, Form, Button } from 'antd'
import _ from 'lodash'
import { TFormName, TPersistedControls, TUrlParams } from 'localTypes/form'
import { TListInputCustomProps } from 'localTypes/formExtensions'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { getStringByName } from 'utils/getStringByName'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { prepareTemplate } from 'utils/prepareTemplate'
import { MinusIcon, feedbackIcons } from 'components/atoms'
import { PersistedCheckbox, HiddenContainer, ResetedFormItem, CustomSizeTitle } from '../../atoms'
import { useDesignNewLayout } from '../../organisms/BlackholeForm/context'

type TFormListInputProps = {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  description?: string
  isAdditionalProperties?: boolean
  removeField: ({ path }: { path: TFormName }) => void
  persistedControls: TPersistedControls
  customProps: TListInputCustomProps
  urlParams: TUrlParams
  onRemoveByMinus?: () => void
}

export const FormListInput: FC<TFormListInputProps> = ({
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  description,
  isAdditionalProperties,
  removeField,
  persistedControls,
  customProps,
  urlParams,
  onRemoveByMinus,
}) => {
  const designNewLayout = useDesignNewLayout()

  const { clusterName, namespace, syntheticProject, entryName } = urlParams
  const form = Form.useFormInstance()
  const fieldValue = Form.useWatch(name === 'nodeName' ? 'nodeNameBecauseOfSuddenBug' : name, form)

  const uri = prepareTemplate({
    template: customProps.valueUri,
    replaceValues: { clusterName, namespace, syntheticProject, entryName },
  })

  const {
    data: optionsObj,
    isError: isErrorOptionsObj,
    isLoading: isLoadingOptionsObj,
  } = useDirectUnknownResource({
    uri,
    refetchInterval: false,
    queryKey: [uri || '', JSON.stringify(name)],
    isEnabled: !!uri,
  })

  if (isLoadingOptionsObj) {
    return <div>Loading</div>
  }

  if (isErrorOptionsObj) {
    return <div>Error</div>
  }

  const items = _.get(optionsObj, ['items'])
  const filteredItems = customProps.criteria
    ? items.filter((item: object) => {
        const objValue = _.get(item, customProps.criteria?.keysToValue || [])
        if (customProps.criteria?.type === 'equals') {
          return objValue === customProps.criteria?.value
        }
        return objValue !== customProps.criteria?.value
      })
    : items
  const itemForPrefilledValue =
    customProps.criteria?.keepPrefilled !== false
      ? items.find((item: object) => _.get(item, customProps.keysToValue) === fieldValue)
      : undefined
  const filteredItemsAndPrefilledValue = itemForPrefilledValue
    ? [itemForPrefilledValue, ...filteredItems]
    : filteredItems
  const options = Array.isArray(filteredItemsAndPrefilledValue)
    ? filteredItemsAndPrefilledValue
        .map((item: object) => ({
          value: _.get(item, customProps.keysToValue),
          label: customProps.keysToLabel ? _.get(item, customProps.keysToLabel) : _.get(item, customProps.keysToValue),
        }))
        .map(({ value, label }: { value: unknown; label: unknown }) => ({
          label: typeof label === 'string' ? label : JSON.stringify(label),
          value: typeof value === 'string' ? value : JSON.stringify(value),
        }))
    : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uniqueOptions = options.reduce<{ value: any; label: any }[]>((acc, current) => {
    const exists = acc.some(item => item.value === current.value)
    if (!exists) {
      acc.push(current)
    }
    return acc
  }, [])

  const fixedName = name === 'nodeName' ? 'nodeNameBecauseOfSuddenBug' : name

  const title = (
    <>
      {getStringByName(name)}
      {required?.includes(getStringByName(name)) && <Typography.Text type="danger">*</Typography.Text>}
    </>
  )

  return (
    <HiddenContainer name={name}>
      <Flex justify="space-between">
        <CustomSizeTitle $designNewLayout={designNewLayout}>
          {description ? <Tooltip title={description}>{title}</Tooltip> : title}
        </CustomSizeTitle>
        <Flex gap={4}>
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
          <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="arr" />
        </Flex>
      </Flex>
      <ResetedFormItem
        key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
        name={arrName || fixedName}
        rules={[{ required: forceNonRequired === false && required?.includes(getStringByName(name)) }]}
        validateTrigger="onBlur"
        hasFeedback={designNewLayout ? { icons: feedbackIcons } : true}
      >
        <Select
          mode={customProps.mode}
          placeholder="Select"
          options={uniqueOptions}
          filterOption={filterSelectOptions}
          allowClear
          showSearch
        />
      </ResetedFormItem>
    </HiddenContainer>
  )
}
