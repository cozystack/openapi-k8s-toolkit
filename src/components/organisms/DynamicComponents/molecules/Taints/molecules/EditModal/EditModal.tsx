/* eslint-disable no-console */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Alert, Space, Input, Select, Button, Row, Col } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { TRequestError } from 'localTypes/api'
import { ResetedFormItem, CustomSizeTitle } from 'components/molecules/BlackholeForm/atoms'
import { Spacer, PlusIcon, MinusIcon } from 'components/atoms'
import { patchEntryWithReplaceOp } from 'api/forms'
import { TTaintEffect, TTaintLike } from '../../types'
import { Styled } from './styled'

type TEditModalProps = {
  open: boolean
  close: () => void
  values?: TTaintLike[]
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

  const [form] = Form.useForm<{ taints: TTaintLike[] }>()
  const taints = Form.useWatch<TTaintLike[]>('taints', form)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        taints: values || [],
      })
    }
  }, [open, form])

  const submit = () => {
    form
      .validateFields()
      .then(() => {
        console.log(JSON.stringify(taints))
        setIsLoading(true)
        setError(undefined)
        patchEntryWithReplaceOp({ endpoint, pathToValue, body: taints })
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
      <Form<{ taints: TTaintLike[] }> form={form}>
        {inputLabel && <CustomSizeTitle $designNewLayout>{inputLabel}</CustomSizeTitle>}
        <Spacer $space={10} $samespace />
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div>Key</div>
          </Col>
          <Col span={8}>
            <div>Value</div>
          </Col>
          <Col span={6}>
            <div>Effect</div>
          </Col>
          <Col span={2}>
            <div />
          </Col>
        </Row>
        <Styled.ResetedFormList name="taints">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={[16, 16]}>
                  <Col span={8}>
                    <ResetedFormItem
                      {...restField}
                      name={[name, 'key']}
                      rules={[
                        {
                          validator: (_, v) =>
                            v === undefined || typeof v === 'string'
                              ? Promise.resolve()
                              : Promise.reject(new Error('Key must be a string.')),
                        },
                      ]}
                    >
                      <Input placeholder="e.g. dedicated" />
                    </ResetedFormItem>
                  </Col>

                  <Col span={8}>
                    <ResetedFormItem
                      {...restField}
                      name={[name, 'value']}
                      rules={[
                        {
                          validator: (_, v) =>
                            v === undefined || typeof v === 'string'
                              ? Promise.resolve()
                              : Promise.reject(new Error('Value must be a string.')),
                        },
                      ]}
                    >
                      <Input placeholder="e.g. batch" />
                    </ResetedFormItem>
                  </Col>

                  <Col span={6}>
                    <ResetedFormItem
                      {...restField}
                      name={[name, 'effect']}
                      rules={[
                        { required: true, message: 'Effect is required.' },
                        {
                          validator: (_, v) =>
                            v && effectOptions.includes(v)
                              ? Promise.resolve()
                              : Promise.reject(new Error('Select a valid effect.')),
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select effect"
                        style={{ width: 200 }}
                        options={effectOptions.map(eff => ({ key: eff, value: eff }))}
                      />
                    </ResetedFormItem>
                  </Col>

                  <Col span={2}>
                    <Button size="small" type="text" onClick={() => remove(name)}>
                      <MinusIcon />
                    </Button>
                  </Col>
                </Row>
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
