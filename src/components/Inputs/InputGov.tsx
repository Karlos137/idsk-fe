import React, { ChangeEventHandler } from 'react'
import InputGovLabel from '../InputsUtils/InputGovLabel'
import WrapInputGov from '../InputsUtils/WrapInputGov'

interface iInputGov {
  name: string
  label?: string
  type?: string
  description?: string
  placeholder?: string

  value?: string
  onChange?: ChangeEventHandler<any>
  error?: string
  tooltip?: string
}

const InputGov = ({ name, label, type = 'text', description, value, onChange, error, tooltip }: iInputGov) => {
  const id = 'input-' + name
  return (
    <WrapInputGov value={value} error={error} description={description} tooltip={tooltip}>
      <input
        id={id}
        onChange={onChange}
        value={value}
        name={name}
        type={type}
        className='gov-form-control__input'
        aria-required='false'
        aria-disabled='false'
      />
      <InputGovLabel inputId={id} label={label} />
    </WrapInputGov>
  )
}

export default InputGov
