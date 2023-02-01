import React from 'react'
import TooltipMark from '../Tooltip/TooltipMark'

interface iFormInputToopltip {
  text?: string
}

const InputGovTooltip = ({ text }: iFormInputToopltip) => {
  if (!text) {
    return null
  }

  return (
    <div className='position-absolute top-0 end-0'>
      <TooltipMark text={text} />
    </div>
  )
}

export default InputGovTooltip
