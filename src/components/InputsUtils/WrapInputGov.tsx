import React from 'react'
import InputGovDescription from './InputGovDescription'
import InputGovError from './InputGovError'
import InputGovTooltip from './InputGovTooltip'

interface iTextInput {
  value?: string
  description?: string
  tooltip?: string
  openLabel?: boolean
  error?: string
  children: React.ReactNode
}

const WrapInputGov = ({ value, description, tooltip, openLabel, error, children }: iTextInput) => {
  const classes = ['gov-form-control']
  if (value || openLabel) {
    classes.push('not-empty')
  }
  if (error) {
    classes.push('gov-form-control--error')
  }
  return (
    <div className={classes.join(' ')}>
      {children}

      <InputGovDescription text={description} />
      <InputGovError text={error} />
      <InputGovTooltip text={tooltip} />
    </div>
  )
}

export default WrapInputGov
