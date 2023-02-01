import React from 'react'

interface iFormInputDescription {
  text?: string
}

const InputGovDescription = ({ text }: iFormInputDescription) => {
  if (!text) {
    return null
  }

  return <span className='gov-form-control__message'>{text}</span>
}

export default InputGovDescription
