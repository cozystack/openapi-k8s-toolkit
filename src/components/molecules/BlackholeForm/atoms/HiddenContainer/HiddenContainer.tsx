import React, { FC, PropsWithChildren } from 'react'
import { includesArray } from 'utils/nestedStringsArrayInclude'
import { TFormName } from 'localTypes/form'
import { PossibleHiddenContainer } from '../../atoms'
import { useHiddenPathsLayout } from '../../organisms/BlackholeForm/context'

type THiddenContainerProps = PropsWithChildren<{
  name?: TFormName
  secondName?: TFormName
}>

export const HiddenContainer: FC<THiddenContainerProps> = ({ name, secondName, children }) => {
  const hiddenPaths = useHiddenPathsLayout()

  const isHidden = name ? includesArray(hiddenPaths, Array.isArray(name) ? name : [name]) : false
  const isHiddenSecond = secondName
    ? includesArray(hiddenPaths, Array.isArray(secondName) ? secondName : [secondName])
    : false

  return (
    <PossibleHiddenContainer $isHidden={!hiddenPaths || isHidden || isHiddenSecond}>{children}</PossibleHiddenContainer>
  )
}
