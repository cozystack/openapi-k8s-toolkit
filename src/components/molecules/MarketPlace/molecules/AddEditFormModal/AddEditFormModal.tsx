import React, { FC, Dispatch, SetStateAction } from 'react'
import { isAxiosError, AxiosError } from 'axios'
import { Form, Input, Select, Switch, Modal } from 'antd'
import { createNewEntry, updateEntry } from 'api/forms'
import { v4 as uuidv4 } from 'uuid'
import { TMarketPlacePanel, TMarketPlacePanelResource } from 'localTypes/marketplace'

type TAddEditFormModalProps = {
  clusterName?: string
  baseApiGroup: string
  baseApiVersion: string
  mpResourceName: string
  mpResourceKind: string
  isOpen: boolean | TMarketPlacePanelResource
  setIsOpen: Dispatch<SetStateAction<boolean | TMarketPlacePanelResource>>
  setError: Dispatch<SetStateAction<AxiosError | Error | undefined>>
  onCreateSuccess: () => void
  onUpdateSuccess: () => void
}

export const AddEditFormModal: FC<TAddEditFormModalProps> = ({
  clusterName,
  baseApiGroup,
  baseApiVersion,
  mpResourceName,
  mpResourceKind,
  isOpen,
  setIsOpen,
  setError,
  onCreateSuccess,
  onUpdateSuccess,
}) => {
  const [form] = Form.useForm<TMarketPlacePanel>()
  const type = Form.useWatch<string | undefined>('type', form)

  const defaultValues: TMarketPlacePanel =
    typeof isOpen === 'boolean'
      ? {
          name: '',
          description: '',
          icon: '',
          type: 'direct',
          apiGroup: '',
          apiVersion: '',
          typeName: '',
          pathToNav: '',
          tags: [],
          disabled: false,
          hidden: false,
        }
      : isOpen.spec

  const onSubmit = (values: TMarketPlacePanel) => {
    if (typeof isOpen === 'boolean') {
      createNewEntry({
        endpoint: `/api/clusters/${clusterName}/k8s/apis/${baseApiGroup}/${baseApiVersion}/${mpResourceName}`,
        body: {
          apiVersion: `${baseApiGroup}/${baseApiVersion}`,
          kind: mpResourceKind,
          metadata: {
            name: uuidv4(),
          },
          spec: { ...values },
        },
      })
        .then(() => {
          setIsOpen(false)
          onCreateSuccess()
        })
        .catch(err => {
          if (isAxiosError(err) || err instanceof Error) {
            setError(err)
          }
        })
        .finally(() => setIsOpen(false))

      return
    }

    updateEntry({
      endpoint: `/api/clusters/${clusterName}/k8s/apis/${baseApiGroup}/${baseApiVersion}/${mpResourceName}/${isOpen.metadata.name}`,
      body: {
        apiVersion: `${baseApiGroup}/${baseApiVersion}`,
        kind: mpResourceKind,
        metadata: {
          name: isOpen.metadata.name,
          resourceVersion: isOpen.metadata.resourceVersion,
        },
        spec: { ...values },
      },
    })
      .then(() => {
        setIsOpen(false)
        onUpdateSuccess()
      })
      .catch(err => {
        if (isAxiosError(err) || err instanceof Error) {
          setError(err)
        }
      })
      .finally(() => setIsOpen(false))
  }

  const submit = () => {
    form
      .validateFields()
      .then(() => {
        onSubmit(form.getFieldsValue())
      })
      // eslint-disable-next-line no-console
      .catch(() => console.log('Validating error'))
  }

  return (
    <Modal
      title={typeof isOpen === 'boolean' ? 'Add card' : 'Edit плитку'}
      open={isOpen !== false}
      onCancel={() => setIsOpen(false)}
      onOk={() => submit()}
    >
      <Form<TMarketPlacePanel> form={form} name="control-hooks" initialValues={{ ...defaultValues }}>
        <Form.Item label="Name" name="name">
          <Input required />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input required />
        </Form.Item>
        <Form.Item label="Icon" name="icon">
          <Input.TextArea placeholder="SVG-иконка, <svg /> -> base64" maxLength={undefined} required />
        </Form.Item>
        <Form.Item label="Resources type" name="type">
          <Select
            placeholder="Choose resource type"
            options={[
              { value: 'direct', label: 'Direct link' },
              { value: 'crd', label: 'CRD' },
              { value: 'nonCrd', label: 'API' },
              { value: 'built-in', label: 'Built-in' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Enter API group" name="apiGroup">
          <Input disabled={type === 'direct' || type === 'built-in'} />
        </Form.Item>
        <Form.Item label="Enter API version" name="apiVersion">
          <Input disabled={type === 'direct'} />
        </Form.Item>
        <Form.Item label="Enter resource type" name="typeName">
          <Input disabled={type === 'direct'} />
        </Form.Item>
        <Form.Item label="Enter path" name="pathToNav">
          <Input disabled={type !== 'direct'} />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select
            mode="tags"
            placeholder="Enter tags. Separators: comma and space"
            tokenSeparators={[',', ' ']}
            dropdownStyle={{ display: 'none' }}
          />
        </Form.Item>
        <Form.Item label="Disabled" name="disabled">
          <Switch />
        </Form.Item>
        <Form.Item label="Hidden" name="hidden">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}
