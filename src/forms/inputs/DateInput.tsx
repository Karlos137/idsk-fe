import moment from 'moment'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useFormContext } from 'react-hook-form'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInput } from '../../hooks/useFormHooks'
import { DATE_FORMAT_ISO8601_SHORT } from '../../utils/dateFormat'
import FormInputWrap from '../utils/FormInputWrap'

interface iDateInput {
  name: string
  label: string
  description?: string
  required?: boolean
  withTime?: boolean
  tooltip?: string
  disabled?: boolean
}

const DateInput = ({ name, label, description, required, withTime = false, tooltip, disabled }: iDateInput) => {
  const { fullName } = useFormInput(name)
  const { control } = useFormContext()
  const { formDisabled } = useFormContextBase()
  const [openLabel, setOpenLabel] = useState(false)

  return (
    <FormInputWrap name={name} description={description} tooltip={tooltip} openLabel={openLabel}>
      <Controller
        control={control}
        name={fullName}
        render={({ field }) => (
          <DatePicker
            isClearable={!(formDisabled || disabled)}
            dateFormat={withTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput={withTime}
            disabled={formDisabled || disabled}
            onChange={(date) => {
              // const dateString = date ? moment(date).toISOString(true).split('T') : ''
              const dateString = date ? moment(date).format(DATE_FORMAT_ISO8601_SHORT) : ''
              field.onChange(dateString)
            }}
            selected={field.value ? moment(field.value).toDate() : undefined}
            id={'datepicker-' + name}
            className='gov-form-control__input'
            aria-required='false'
            aria-disabled='false'
            onFocus={() => {
              setOpenLabel(true)
            }}
            onBlur={() => {
              setOpenLabel(false)
            }}
          />
        )}
      />

      <InputGovLabel inputId={'datepicker-' + name} label={label} required={required} />
    </FormInputWrap>
  )
}

export default DateInput
