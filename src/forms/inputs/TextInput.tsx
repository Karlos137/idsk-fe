import React from 'react'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInput } from '../../hooks/useFormHooks'
import FormInputWrap from '../utils/FormInputWrap'

interface iTextInput {
  name: string
  label: string
  description?: string
  type?: string
  tooltip?: string
  disabled?: boolean
  required?: boolean
}

const TextInput = ({ name, label, description, type = 'text', tooltip, disabled, required }: iTextInput) => {
  const { fullName, registerInput } = useFormInput(name)
  const { formDisabled } = useFormContextBase()

  const id = 'input-' + fullName
  return (
    <FormInputWrap name={name} description={description} tooltip={tooltip}>
      <input
        id={id}
        {...registerInput()}
        disabled={disabled || formDisabled}
        type={type}
        className='gov-form-control__input'
        aria-required='false'
        aria-disabled='false'
      />
      <InputGovLabel inputId={id} label={label} required={required} />
    </FormInputWrap>
  )
}

export default TextInput
