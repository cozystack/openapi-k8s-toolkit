/* eslint-disable no-console */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Alert, Select } from 'antd'
import { TRequestError } from 'localTypes/api'
import { ResetedFormItem, CustomSizeTitle } from 'components/molecules/BlackholeForm/atoms'
import { filterSelectOptions } from 'utils/filterSelectOptions'

type TEditModalProps = {
  open: boolean
  close: () => void
  values?: Record<string, string | number>
  openNotification?: (msg: string) => void
  modalTitle: string
  modalDescriptionText?: string
  inputLabel?: string
  notificationSuccessText: string
}

export const EditModal: FC<TEditModalProps> = ({
  open,
  close,
  values,
  openNotification,
  modalTitle,
  modalDescriptionText,
  inputLabel,
  notificationSuccessText,
}) => {
  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [form] = Form.useForm<{ labels: string[] }>()
  const labels = Form.useWatch<string[]>('labels', form)

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        labels: values ? Object.entries(values).map(([key, value]) => `${key}=${value}`) : [],
      })
    }
  }, [open, form])

  const submit = () => {
    form
      .validateFields()
      .then(() => {
        console.log(labels)
        if (openNotification) {
          openNotification(notificationSuccessText)
        }
      })
      .catch(() => console.log('Validating error'))
  }

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
      width={400}
      destroyOnHidden
    >
      {error && <Alert type="error" message="Error while submitting" description={error?.response?.data?.message} />}
      {modalDescriptionText}
      <Form<{ labels: string[] }> form={form}>
        {inputLabel && <CustomSizeTitle>{inputLabel}</CustomSizeTitle>}
        <ResetedFormItem
          name="labels"
          hasFeedback
          validateTrigger="onBlur"
          rules={[
            () => ({
              validator(_, value) {
                if (
                  Array.isArray(value) &&
                  value.some(str => {
                    if (typeof str !== 'string') {
                      return true
                    }
                    const splittedStr = str.split('=')
                    if (splittedStr.length - 1 !== 1) {
                      return true
                    }
                    if (splittedStr[1] !== undefined && splittedStr[1].length < 1) {
                      return true
                    }
                    return false
                  })
                ) {
                  return Promise.reject(new Error('Please enter key=value style'))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Select mode="tags" placeholder="Enter key=value" filterOption={filterSelectOptions} allowClear />
        </ResetedFormItem>
      </Form>
    </Modal>
  )
}
