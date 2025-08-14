/* eslint-disable no-console */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Alert, Space, Input, Select, Button, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { TRequestError } from 'localTypes/api'
import { ResetedFormItem, CustomSizeTitle } from 'components/molecules/BlackholeForm/atoms'
import { Spacer, PlusIcon, MinusIcon } from 'components/atoms'
import { patchEntryWithReplaceOp } from 'api/forms'
import { TToleration, TTolerationOperator, TTaintEffect } from '../../types'
import { Styled } from './styled'

type TEditModalProps = {
  open: boolean
  close: () => void
  values?: TToleration[]
  openNotificationSuccess?: () => void
  modalTitle: string
  modalDescriptionText?: string
  inputLabel?: string
  endpoint: string
  pathToValue: string
  editModalWidth?: number | string
}

export const EditModal: FC<TEditModalProps> = ({
  open,
  close,
  values,
  openNotificationSuccess,
  modalTitle,
  modalDescriptionText,
  inputLabel,
  endpoint,
  pathToValue,
  editModalWidth,
}) => {
  const queryClient = useQueryClient()

  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [form] = Form.useForm<{ tolerations: TToleration[] }>()
  const tolerations = Form.useWatch<TToleration[]>('tolerations', form)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        tolerations: values || [],
      })
    }
  }, [open, form])

  const submit = () => {
    form
      .validateFields()
      .then(() => {
        console.log(JSON.stringify(tolerations))
        setIsLoading(true)
        setError(undefined)
        patchEntryWithReplaceOp({ endpoint, pathToValue, body: tolerations })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['multi'] })
            if (openNotificationSuccess) {
              openNotificationSuccess()
            }
            setIsLoading(false)
            setError(undefined)
            close()
          })
          .catch(error => {
            setIsLoading(false)
            setError(error)
          })
      })
      .catch(() => console.log('Validating error'))
  }

  const operatorOptions: TTolerationOperator[] = ['Exists', 'Equal']
  const effectOptions: TTaintEffect[] = ['NoSchedule', 'PreferNoSchedule', 'NoExecute']

  return (
    <Modal
      title={modalTitle}
      open={open}
      onOk={() => submit()}
      onCancel={() => {
        close()
        form.resetFields()
        setIsLoading(false)
        setError(undefined)
      }}
      okText="Save"
      confirmLoading={isLoading}
      maskClosable={false}
      width={editModalWidth || 520}
      destroyOnHidden
      centered
    >
      {error && <Alert type="error" message="Error while submitting" description={error?.response?.data?.message} />}
      {modalDescriptionText && (
        <>
          <div>{modalDescriptionText}</div>
          <Spacer $space={10} $samespace />
        </>
      )}
      <Form<{ tolerations: TToleration[] }> form={form}>
        {inputLabel && <CustomSizeTitle $designNewLayout>{inputLabel}</CustomSizeTitle>}
        <Spacer $space={10} $samespace />
        <Styled.ResetedFormList name="tolerations">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <ResetedFormItem
                    {...restField}
                    name={[name, 'key']}
                    label={
                      <span>
                        Key{' '}
                        <Tooltip title="Required when operator is Equal; optional for Exists.">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </span>
                    }
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, v) {
                          const op = getFieldValue(['tolerations', name, 'operator'])
                          if (op === 'Equal' && (!v || v === '')) {
                            return Promise.reject(new Error('Key is required when operator is Equal.'))
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="key" />
                  </ResetedFormItem>

                  <ResetedFormItem
                    {...restField}
                    name={[name, 'operator']}
                    label="Operator"
                    rules={[
                      { required: true, message: 'Operator is required.' },
                      {
                        validator: (_, v) =>
                          v && (v === 'Exists' || v === 'Equal')
                            ? Promise.resolve()
                            : Promise.reject(new Error('Operator must be Exists or Equal.')),
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select operator"
                      style={{ width: 140 }}
                      options={operatorOptions.map(op => ({ key: op, label: op }))}
                    />
                  </ResetedFormItem>

                  <ResetedFormItem
                    {...restField}
                    name={[name, 'value']}
                    label={
                      <span>
                        Value{' '}
                        <Tooltip title="Required for Equal; must be empty for Exists.">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </span>
                    }
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, v) {
                          const op = getFieldValue(['tolerations', name, 'operator'])
                          if (op === 'Equal' && (!v || v === '')) {
                            return Promise.reject(new Error('Value is required when operator is Equal.'))
                          }
                          if (op === 'Exists' && v) {
                            return Promise.reject(new Error('Value must be empty when operator is Exists.'))
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="value" />
                  </ResetedFormItem>

                  <ResetedFormItem
                    {...restField}
                    name={[name, 'effect']}
                    label="Effect"
                    rules={[
                      {
                        validator: (_, v) =>
                          !v || v === 'NoSchedule' || v === 'PreferNoSchedule' || v === 'NoExecute'
                            ? Promise.resolve()
                            : Promise.reject(new Error('Invalid effect.')),
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select effect"
                      style={{ width: 160 }}
                      options={effectOptions.map(eff => ({ key: eff, label: eff }))}
                    />
                  </ResetedFormItem>

                  <Button size="small" type="text" onClick={() => remove(name)}>
                    <MinusIcon />
                  </Button>
                </Space>
              ))}

              <ResetedFormItem>
                <Button type="text" size="small" onClick={() => add()}>
                  <PlusIcon />
                </Button>
              </ResetedFormItem>
            </>
          )}
        </Styled.ResetedFormList>
      </Form>
    </Modal>
  )
}
