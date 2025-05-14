import React, { FC } from 'react'
import { Tooltip } from 'antd'
import { Styled } from './styled'

type TShortenedTextWithTooltip = {
  text: string
  maxWidth?: number
  trimLength?: number
}

export const ShortenedTextWithTooltip: FC<TShortenedTextWithTooltip> = ({ text, trimLength, maxWidth = 200 }) => {
  if (trimLength) {
    const trimmedText = text.substring(0, trimLength)
    return (
      <Tooltip title={text} placement="top">
        {trimmedText}
      </Tooltip>
    )
  }

  return (
    <Tooltip title={text}>
      <Styled.ShortenedText $maxWidth={maxWidth}>{text}</Styled.ShortenedText>
    </Tooltip>
  )
}
