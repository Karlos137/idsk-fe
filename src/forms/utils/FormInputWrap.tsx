import React from 'react'
import InputGovDescription from '../../components/InputsUtils/InputGovDescription'
import InputGovError from '../../components/InputsUtils/InputGovError'
import InputGovTooltip from '../../components/InputsUtils/InputGovTooltip'
import { useFormInput, useWatchFullName } from '../../hooks/useFormHooks'

interface iTextInput {
  name: string
  description?: string
  tooltip?: string
  openLabel?: boolean
  children: React.ReactNode
}

const FormInputWrap = ({ name, description, tooltip, openLabel, children }: iTextInput) => {
  const { error } = useFormInput(name)
  const value = useWatchFullName(name)
  return (
    <div
      className={
        'gov-form-control ' + (value || openLabel ? 'not-empty' : '') + (error ? ' gov-form-control--error' : '')
      }
    >
      {children}

      <InputGovDescription text={description} />
      <InputGovError text={error?.message} />
      <InputGovTooltip text={tooltip} />
    </div>
  )
}

export default FormInputWrap
