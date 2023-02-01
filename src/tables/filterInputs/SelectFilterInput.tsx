import React from 'react'
import { useFilterContextInput } from '../../context/FilterContext'

interface iCheckFilterInput {
  name: string
  label: string
  description?: string
  options: { label: string; value: string }[]
}

const SelectFilterInput = ({ name, label, options, description }: iCheckFilterInput) => {
  const { value, setValue } = useFilterContextInput(name)

  return (
    <div className={'gov-form-control ' + (value ? 'not-empty' : '')}>
      <div className='gov-select'>
        <select
          id={'select-' + name}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          name={name}
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
        <label className='gov-form-control__label ' htmlFor={'select-' + name}>
          {label}
        </label>
      </div>
      {description && <span className='gov-form-control__message'>{description}</span>}
    </div>
  )
}

export default SelectFilterInput
