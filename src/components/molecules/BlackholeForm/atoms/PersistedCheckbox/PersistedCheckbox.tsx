import React, { FC } from 'react'
import { Checkbox } from 'antd'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { Styled } from './styled'

type TPersistedCheckboxProps = {
  formName: TFormName
  persistedControls: TPersistedControls
  type?: 'str' | 'number' | 'arr' | 'obj'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PersistedCheckbox: FC<TPersistedCheckboxProps> = ({ formName, persistedControls, type }) => {
  const isChecked = persistedControls.persistedKeys.some(arr => JSON.stringify(arr) === JSON.stringify(formName))

  const toggleCheckbox = () => {
    if (isChecked) {
      persistedControls.onPersistUnmark(formName)
    } else {
      persistedControls.onPersistMark(formName, type)
    }
  }

  return (
    <Styled.PossibleHiddenContainerWidthPadding $isHidden={persistedControls.isPersistedKeysShown === false}>
      <Checkbox
        // onChange={toggleCheckbox}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          toggleCheckbox()
        }}
        checked={isChecked}
      />
    </Styled.PossibleHiddenContainerWidthPadding>
  )
}
