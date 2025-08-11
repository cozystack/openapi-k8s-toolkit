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
}

export const EditModal: FC<TEditModalProps> = ({ open, close, values, openNotification }) => {
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
        if (openNotification) {
          openNotification('Labels updated')
        }
      })
      .catch(() => console.log('Validating error'))
  }

  return (
    <Modal
      title="Manage Labels"
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
      {error && <Alert type="error" message="Error while delete" description={error?.response?.data?.message} />}
      Description text
      <Form<{ labels: string[] }> form={form}>
        <CustomSizeTitle>Labels</CustomSizeTitle>
        <ResetedFormItem name="labels">
          <Select mode="tags" placeholder="Select" filterOption={filterSelectOptions} allowClear />
        </ResetedFormItem>
      </Form>
    </Modal>
  )
}
