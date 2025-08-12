/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import React, { FC, useState } from 'react'
import jp from 'jsonpath'
import { Popover, notification, Flex, Button } from 'antd'
import { UncontrolledSelect, CursorPointerTag, EditIcon } from 'components/atoms'
import { TDynamicComponentsAppTypeMap } from '../../types'
import { useMultiQuery } from '../../../DynamicRendererWithProviders/multiQueryProvider'
import { usePartsOfUrl } from '../../../DynamicRendererWithProviders/partsOfUrlContext'
import { parseAll } from '../utils'
import { EditModal } from './molecules'
import { parseArrayOfAny, truncate } from './utils'

export const Labels: FC<{ data: TDynamicComponentsAppTypeMap['Labels']; children?: any }> = ({ data, children }) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    reqIndex,
    jsonPathToLabels,
    selectProps,
    notificationSuccessMessage,
    notificationSuccessMessageDescription,
    modalTitle,
    modalDescriptionText,
    inputLabel,
    containerStyle,
    maxEditTagTextLength,
    allowClearEditSelect,
  } = data

  const [api, contextHolder] = notification.useNotification()
  const [open, setOpen] = useState<boolean>(false)

  const { maxTagTextLength, ...restSelectProps } = selectProps || { maxTagTextLength: undefined }

  const { data: multiQueryData, isLoading: isMultiQueryLoading, isError: isMultiQueryErrors, errors } = useMultiQuery()
  const partsOfUrl = usePartsOfUrl()

  if (isMultiQueryLoading) {
    return <div>Loading...</div>
  }

  if (isMultiQueryErrors) {
    return (
      <div>
        <h4>Errors:</h4>
        <ul>{errors.map((e, i) => e && <li key={i}>{e.message}</li>)}</ul>
      </div>
    )
  }

  const replaceValues = partsOfUrl.partsOfUrl.reduce<Record<string, string | undefined>>((acc, value, index) => {
    acc[index.toString()] = value
    return acc
  }, {})

  const jsonRoot = multiQueryData[`req${reqIndex}`]

  if (jsonRoot === undefined) {
    return <div>No root for json path</div>
  }

  const anythingForNow = jp.query(jsonRoot, `$${jsonPathToLabels}`)

  const { data: labelsRaw, error: errorArrayOfObjects } = parseArrayOfAny(anythingForNow)

  const notificationSuccessMessagePrepared = parseAll({
    text: notificationSuccessMessage,
    replaceValues,
    multiQueryData,
  })
  const notificationSuccessMessageDescriptionPrepared = parseAll({
    text: notificationSuccessMessageDescription,
    replaceValues,
    multiQueryData,
  })
  const modalTitlePrepared = parseAll({ text: modalTitle, replaceValues, multiQueryData })
  const modalDescriptionTextPrepared = modalDescriptionText
    ? parseAll({ text: modalDescriptionText, replaceValues, multiQueryData })
    : undefined
  const inputLabelPrepared = inputLabel ? parseAll({ text: inputLabel, replaceValues, multiQueryData }) : undefined

  const openNotificationSuccess = () => {
    api.success({
      message: notificationSuccessMessagePrepared,
      description: notificationSuccessMessageDescriptionPrepared,
      placement: 'bottomRight',
    })
  }

  const EmptySelect = (
    <div style={containerStyle}>
      <Flex justify="flex-end">
        <Button
          type="text"
          size="small"
          onClick={e => {
            e.stopPropagation()
            setOpen(true)
          }}
          icon={<EditIcon />}
        />
      </Flex>
      <UncontrolledSelect
        mode="multiple"
        {...restSelectProps}
        value={[]}
        options={[]}
        open={false}
        showSearch={false}
        removeIcon={() => {
          return null
        }}
        suffixIcon={null}
        isCursorPointer
      />
      {children}
      {contextHolder}
      <EditModal
        open={open}
        close={() => setOpen(false)}
        values={labelsRaw}
        openNotificationSuccess={openNotificationSuccess}
        modalTitle={modalTitlePrepared}
        modalDescriptionText={modalDescriptionTextPrepared}
        inputLabel={inputLabelPrepared}
        maxEditTagTextLength={maxEditTagTextLength}
        allowClearEditSelect={allowClearEditSelect}
      />
    </div>
  )

  if (!labelsRaw) {
    if (errorArrayOfObjects) {
      // return <div>{errorArrayOfObjects}</div>
      return EmptySelect
    }
    // return <div>Not a valid data structure</div>
    return EmptySelect
  }

  const labels = Object.entries(labelsRaw).map(([key, value]) => `${key}=${value}`)

  return (
    <div style={containerStyle}>
      <Flex justify="flex-end">
        <Button
          type="text"
          size="small"
          onClick={e => {
            e.stopPropagation()
            setOpen(true)
          }}
          icon={<EditIcon />}
        />
      </Flex>
      <UncontrolledSelect
        mode="multiple"
        // maxTagCount="responsive"
        {...restSelectProps}
        value={labels.map(el => ({ label: el, value: el }))}
        options={labels.map(el => ({ label: el, value: el }))}
        open={false}
        showSearch={false}
        removeIcon={() => {
          return null
        }}
        suffixIcon={null}
        tagRender={({ label }) => (
          <Popover content={label}>
            <CursorPointerTag
              onClick={e => {
                e.stopPropagation()
              }}
            >
              {typeof label === 'string' ? truncate(label, maxTagTextLength) : 'Not a string value'}
            </CursorPointerTag>
          </Popover>
        )}
        // isCursorPointer
      />
      {children}
      {contextHolder}
      <EditModal
        open={open}
        close={() => setOpen(false)}
        values={labelsRaw}
        openNotificationSuccess={openNotificationSuccess}
        modalTitle={modalTitlePrepared}
        modalDescriptionText={modalDescriptionTextPrepared}
        inputLabel={inputLabelPrepared}
        maxEditTagTextLength={maxEditTagTextLength}
        allowClearEditSelect={allowClearEditSelect}
      />
    </div>
  )
}
