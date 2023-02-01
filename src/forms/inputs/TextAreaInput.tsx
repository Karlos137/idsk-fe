import React from 'react'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInput } from '../../hooks/useFormHooks'
import FormInputWrap from '../utils/FormInputWrap'

interface iTextAreaInput {
  name: string
  label: string
  description?: string
  tooltip?: string
  required?: boolean
}

const TextAreaInput = ({ name, label, description, tooltip, required }: iTextAreaInput) => {
  const { fullName, registerInput } = useFormInput(name)
  const { formDisabled } = useFormContextBase()

  const handleKeyDown = (e: any) => {
    e.target.style.minHeight = '0px'
    const scrollHeight = e.target.scrollHeight
    e.target.style.minHeight = scrollHeight + 25 + 'px'

    // e.target.style.height = "inherit";
    // e.target.style.resize = "none";
    // let newheight = e.target.scrollHeight;
    // if (newheight > e.target.offsetHeight) {
    //     e.target.style.height = `${newheight + 25}px`;
    // }
  }
  const id = 'textarea-' + fullName
  return (
    <FormInputWrap name={name} description={description} tooltip={tooltip}>
      <textarea
        id={id}
        {...registerInput()}
        disabled={formDisabled}
        onKeyDown={handleKeyDown}
        className='gov-form-control__input'
        aria-required='false'
        aria-disabled='false'
      />

      <InputGovLabel inputId={id} label={label} required={required} />
    </FormInputWrap>
  )
}

export default TextAreaInput
