import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

interface iTooltip {
  text: string
  children: React.ReactElement
}

const TooltipWrap = ({ text, children }: iTooltip) => {
  return (
    <OverlayTrigger
      // placement="right"
      // delay={{ show: 250, hide: 400 }}
      overlay={<Tooltip>{text}</Tooltip>}
    >
      {children}
    </OverlayTrigger>
  )
}

export default TooltipWrap
