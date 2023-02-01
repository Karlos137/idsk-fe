import React from 'react'
import { useFilterContextInput } from '../../context/FilterContext'

interface iCheckFilterInput {
  name: string
  label: string
  description?: string
  type?: string
  placeholder?: string
}

const TextFilterInput = ({ name, label, type = 'text', description, placeholder }: iCheckFilterInput) => {
  const { value, setValue } = useFilterContextInput(name)

  return (
    <div className={'gov-form-control ' + (value ? 'not-empty' : '')}>
      <input
        id={'input-' + name}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        name={name}
        type={type}
        className='gov-form-control__input'
        aria-required='false'
        aria-disabled='false'
        placeholder={placeholder}
      />

      <label className='gov-form-control__label ' htmlFor={'input-' + name}>
        {label}
      </label>
      {description && <span className='gov-form-control__message'>{description}</span>}
    </div>
  )
}

export default TextFilterInput
