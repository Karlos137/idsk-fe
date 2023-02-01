import React from 'react'

interface iFormInputLabel {
  inputId: string
  label?: string
  required?: boolean
}

const InputGovLabel = ({ inputId, label, required }: iFormInputLabel) => {
  if (!label) {
    return null
  }

  return (
    <label className='gov-form-control__label' htmlFor={inputId}>
      {label}
      {required && '*'}
    </label>
  )
}

export default InputGovLabel
