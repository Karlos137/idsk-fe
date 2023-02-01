import React from 'react'
import Badge from 'react-bootstrap/Badge'
import TooltipWrap from './TooltipWrap'

interface iTooltipMark {
  text?: string
}

const TooltipMark = ({ text }: iTooltipMark) => {
  if (!text) {
    return null
  }

  return (
    <TooltipWrap text={text}>
      <Badge className='mx-1' pill bg='secondary'>
        ?
      </Badge>
    </TooltipWrap>
  )
}

export default TooltipMark
