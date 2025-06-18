/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect } from 'react'
import { Flex, InputNumber, Typography, Tooltip, Row, Col, Slider, Button } from 'antd'
import { SliderBaseProps } from 'antd/es/slider'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { getStringByName } from 'utils/getStringByName'
import { MinusIcon, feedbackIcons } from 'components/atoms'
import { PersistedCheckbox, PossibleHiddenContainer, ResetedFormItem, CustomSizeTitle } from '../../../../atoms'
import { useDesignNewLayout } from '../../../../organisms/BlackholeForm/context'

export type TRangeInputProps = {
  name: TFormName
  arrKey?: number
  arrName?: TFormName
  persistName?: TFormName
  required?: string[]
  forceNonRequired?: boolean
  isHidden?: boolean
  persistedControls: TPersistedControls
  description?: string
  onRemoveByMinus?: () => void
  max: number
  min: number
  step?: number
  initialValue?: number
} & SliderBaseProps

export const RangeInput: FC<TRangeInputProps> = ({
  name,
  arrKey,
  arrName,
  persistName,
  required,
  forceNonRequired,
  isHidden,
  persistedControls,
  description,
  onRemoveByMinus,
  initialValue,
  max,
  min,
  step = 1,
  ...props
}) => {
  const designNewLayout = useDesignNewLayout()

  const [value, setValue] = useState<number>(initialValue || min)

  useEffect(() => {
    if (Number.isNaN(value) || value < min) {
      setValue(min)
    }
    if (value > max) {
      setValue(max)
    }

    setValue(value)
  }, [value, min, max])

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
      <Flex justify="space-between">
        <CustomSizeTitle $designNewLayout={designNewLayout}>
          {description ? <Tooltip title={description}>{title}</Tooltip> : title}
          <PersistedCheckbox formName={persistName || name} persistedControls={persistedControls} type="number" />
        </CustomSizeTitle>
        <div>
          {onRemoveByMinus && (
            <Button size="small" type="text" onClick={onRemoveByMinus}>
              <MinusIcon />
            </Button>
          )}
        </div>
      </Flex>
      <Row>
        <Col span={12}>
          <ResetedFormItem
            key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
            name={arrName || name}
            rules={[{ required: forceNonRequired === false && required?.includes(getStringByName(name)) }]}
            validateTrigger="onBlur"
            hasFeedback={designNewLayout ? { icons: feedbackIcons } : true}
          >
            <Slider min={min} max={max} step={step} {...props} />
          </ResetedFormItem>
          <Typography.Text>
            <Flex justify="space-between">
              <span>{min}</span>
              <span>{max}</span>
            </Flex>
          </Typography.Text>
        </Col>
        <Col span={4}>
          <ResetedFormItem
            key={arrKey !== undefined ? arrKey : Array.isArray(name) ? name.slice(-1)[0] : name}
            name={arrName || name}
            rules={[{ required: forceNonRequired === false && required?.includes(getStringByName(name)) }]}
            validateTrigger="onBlur"
            hasFeedback={designNewLayout ? { icons: feedbackIcons } : true}
          >
            <InputNumber min={min} max={max} step={step} value={value} disabled={props.disabled} />
          </ResetedFormItem>
        </Col>
      </Row>
    </PossibleHiddenContainer>
  )
}
