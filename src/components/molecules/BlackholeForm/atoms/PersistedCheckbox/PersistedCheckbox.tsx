import React, { FC } from 'react'
import { Button } from 'antd'
import { TFormName, TPersistedControls } from 'localTypes/form'
import { LockedIcon, UnlockedIcon } from 'components/atoms'
import { PossibleHiddenContainer } from '../PossibleHiddenContainer'

type TPersistedCheckboxProps = {
  formName: TFormName
  persistedControls: TPersistedControls
  type?: 'str' | 'number' | 'arr' | 'obj'
}

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
    <PossibleHiddenContainer $isHidden={persistedControls.isPersistedKeysShown === false}>
      <Button size="small" type="text" onClick={toggleCheckbox}>
        {isChecked ? <LockedIcon /> : <UnlockedIcon />}
      </Button>
    </PossibleHiddenContainer>
  )
}
