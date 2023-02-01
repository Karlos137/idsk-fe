import React from 'react'

interface iFormInputError {
  text?: string
}

const InputGovError = ({ text }: iFormInputError) => {
  if (!text) {
    return null
  }

  return <span className='gov-form-control__message'>{text}</span>
}

export default InputGovError
