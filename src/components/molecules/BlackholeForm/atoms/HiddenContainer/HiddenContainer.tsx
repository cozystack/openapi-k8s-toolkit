import React, { FC, PropsWithChildren } from 'react'
import { TFormName } from 'localTypes/form'
import { useHiddenPathsLayout } from '../../organisms/BlackholeForm/context'
import { PossibleHiddenContainer } from '../../atoms'
import { includesPath, toArray } from './utils'

export const HiddenContainer: FC<PropsWithChildren<{ name?: TFormName; secondName?: TFormName }>> = ({
  name,
  secondName,
  children,
}) => {
  const hiddenPaths = useHiddenPathsLayout() // type: string[][]

  const nameArr = toArray(name)
  const secondArr = toArray(secondName)

  const isHidden = !!hiddenPaths && !!nameArr && includesPath(hiddenPaths, nameArr)

  const isHiddenSecond = !!hiddenPaths && !!secondArr && includesPath(hiddenPaths, secondArr)

  return (
    <PossibleHiddenContainer $isHidden={!hiddenPaths || isHidden || isHiddenSecond}>{children}</PossibleHiddenContainer>
  )
}
