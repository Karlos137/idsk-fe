import React from 'react'
import { useFormInput } from '../../hooks/useFormHooks'

interface iHiddenInput {
  name: string
}

const HiddenInput = ({ name }: iHiddenInput) => {
  const { registerInput } = useFormInput(name)

  return <input {...registerInput()} type={'hidden'} />
}

export default HiddenInput
