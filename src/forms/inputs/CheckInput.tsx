import React from 'react'
import InputGovDescription from '../../components/InputsUtils/InputGovDescription'
import InputGovError from '../../components/InputsUtils/InputGovError'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import InputGovTooltip from '../../components/InputsUtils/InputGovTooltip'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInput } from '../../hooks/useFormHooks'

interface iCheckInput {
  name: string
  label: string
  description?: string
  tooltip?: string
  defaultValue?: boolean
}

const CheckInput = ({ name, label, description, tooltip, defaultValue }: iCheckInput) => {
  const { fullName, error, registerInput } = useFormInput(name)
  const { formDisabled } = useFormContextBase()

  return (
    <div className='gov-form-control gov-form-control--custom'>
      <input
        id={'check-' + fullName}
        className='gov-form-control__checkbox'
        type='checkbox'
        {...registerInput()}
        disabled={formDisabled}
        defaultChecked={defaultValue}
        aria-required='false'
        aria-disabled='false'
      />
      <InputGovLabel inputId={'check-' + fullName} label={label} />

      <span className='gov-form-control__indicator'></span>

      <InputGovDescription text={description} />
      <InputGovError text={error?.message} />
      <InputGovTooltip text={tooltip} />
    </div>
  )
}

export default CheckInput
