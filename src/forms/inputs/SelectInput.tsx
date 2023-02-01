import React from 'react'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInput } from '../../hooks/useFormHooks'
import FormInputWrap from '../utils/FormInputWrap'

interface iSelectInput {
  name: string
  label: string
  description?: string
  options: { label: string; value: string }[]
  tooltip?: string
  required?: boolean
  defaultValue?: string
  disabled?: boolean
}

const SelectInput = ({
  name,
  label,
  description,
  options,
  tooltip,
  required,
  defaultValue,
  disabled,
}: iSelectInput) => {
  const { fullName, registerInput } = useFormInput(name)
  const { formDisabled } = useFormContextBase()

  const id = 'select-' + fullName
  return (
    <FormInputWrap name={name} description={description} tooltip={tooltip}>
      <div className='gov-select'>
        <select
          id={id}
          defaultValue={defaultValue}
          {...registerInput()}
          disabled={formDisabled || disabled}
          aria-required='false'
          aria-disabled='false'
        >
          <option value=''></option>
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <InputGovLabel inputId={id} label={label} required={required} />
      </div>
    </FormInputWrap>
  )
}

export default SelectInput
