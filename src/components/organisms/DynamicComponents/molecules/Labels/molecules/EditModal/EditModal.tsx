/* eslint-disable no-console */
import React, { FC, useState, useEffect } from 'react'
import { Modal, Form, Alert, Tag, Popover } from 'antd'
import { TRequestError } from 'localTypes/api'
import { ResetedFormItem, CustomSizeTitle } from 'components/molecules/BlackholeForm/atoms'
import { filterSelectOptions } from 'utils/filterSelectOptions'
import { CustomSelect, Spacer } from 'components/atoms'
import { truncate } from '../../utils'

type TEditModalProps = {
  open: boolean
  close: () => void
  values?: Record<string, string | number>
  openNotificationSuccess?: () => void
  modalTitle: string
  modalDescriptionText?: string
  inputLabel?: string
  maxEditTagTextLength?: number
  allowClearEditSelect?: boolean
}

export const EditModal: FC<TEditModalProps> = ({
  open,
  close,
  values,
  openNotificationSuccess,
  modalTitle,
  modalDescriptionText,
  inputLabel,
  maxEditTagTextLength,
  allowClearEditSelect,
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
        const result: Record<string, string> = {}
        labels.forEach(label => {
          const [key, value] = label.split('=')
          result[key] = value || ''
        })
        console.log(JSON.stringify(result))
        // setIsLoading(false)
        // setError(undefined)
        if (openNotificationSuccess) {
          openNotificationSuccess()
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
      width={520}
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
      <Form<{ labels: string[] }> form={form}>
        {inputLabel && <CustomSizeTitle $designNewLayout>{inputLabel}</CustomSizeTitle>}
        <Spacer $space={10} $samespace />
        <ResetedFormItem
          name="labels"
          hasFeedback
          validateTrigger="onBlur"
          rules={[
            () => ({
              validator(_, value) {
                if (
                  Array.isArray(value) &&
                  value.every(str => typeof str === 'string' && str.includes('=') && !str.startsWith('='))
                ) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Please enter key=value style'))
              },
            }),
          ]}
        >
          <CustomSelect
            mode="tags"
            placeholder="Enter key=value"
            filterOption={filterSelectOptions}
            allowClear={allowClearEditSelect}
            tokenSeparators={[' ']}
            open={false}
            tagRender={({ label, closable, onClose }) => {
              return (
                <Popover content={label}>
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    {typeof label === 'string' ? truncate(label, maxEditTagTextLength) : 'Not a string value'}
                  </Tag>
                </Popover>
              )
            }}
          />
        </ResetedFormItem>
      </Form>
    </Modal>
  )
}
