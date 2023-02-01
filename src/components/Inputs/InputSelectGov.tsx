import React, { ChangeEventHandler } from 'react'
import InputGovLabel from '../InputsUtils/InputGovLabel'
import WrapInputGov from '../InputsUtils/WrapInputGov'

interface iInputSelectGov {
  name: string
  label?: string
  description?: string
  tooltip?: string
  error?: string
  value?: string
  onChange?: ChangeEventHandler<any>
  options: { label: string; value: string }[]
  disabled?: boolean
  blankOptions?: boolean
}

const InputSelectGov = ({
  name,
  label,
  description,
  value,
  onChange,
  error,
  tooltip,
  options,
  disabled,
  blankOptions,
}: iInputSelectGov) => {
  const id = 'select-' + name
  return (
    <WrapInputGov value={value} error={error} description={description} tooltip={tooltip}>
      <div className='gov-select'>
        <select
          disabled={disabled}
          id={id}
          onChange={onChange}
          value={value}
          name={name}
          aria-required='false'
          aria-disabled='false'
        >
          {blankOptions && <option value=''></option>}
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <InputGovLabel inputId={id} label={label} />
      </div>
    </WrapInputGov>
  )
}

export default InputSelectGov
