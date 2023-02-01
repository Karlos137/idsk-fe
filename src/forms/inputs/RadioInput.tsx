import React from 'react'
import InputGovDescription from '../../components/InputsUtils/InputGovDescription'
import InputGovError from '../../components/InputsUtils/InputGovError'
import InputGovTooltip from '../../components/InputsUtils/InputGovTooltip'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInput } from '../../hooks/useFormHooks'

interface iRadioInput {
  name: string
  label?: string
  description?: string
  options: { label: string; value: string }[]
  tooltip?: string
  columnCount?: number
  disabled?: boolean
  defaultValue?: string
  disabledOptions?: string[]
}

const RadioInput = ({
  name,
  description,
  options,
  tooltip,
  columnCount = 1,
  disabled,
  defaultValue,
  disabledOptions,
}: iRadioInput) => {
  const { fullName, error, registerInput } = useFormInput(name)
  const { formDisabled } = useFormContextBase()

  return (
    <>
      <div style={{ columnCount: columnCount, paddingTop: 10, paddingBottom: 10 }}>
        {options.map(({ label, value }, index) => (
          <div
            key={index}
            className={'gov-form-control gov-form-control--custom ' + (error ? ' gov-form-control--error' : '')}
          >
            <input
              id={`radio_${fullName}_${value}`}
              {...registerInput()}
              defaultChecked={defaultValue ? defaultValue === value : undefined}
              value={value}
              className='gov-form-control__radio'
              type='radio'
              disabled={disabled || formDisabled || disabledOptions?.includes(value)}
            />
            <label className='gov-form-control__label' htmlFor={`radio_${fullName}_${value}`}>
              {label}
            </label>
            <span className='gov-form-control__indicator'></span>
          </div>
        ))}
      </div>

      <div className={error ? ' gov-form-control--error' : ''}>
        <InputGovDescription text={description} />
        <InputGovError text={error?.message} />
        <InputGovTooltip text={tooltip} />
      </div>
    </>
  )
}

export default RadioInput
