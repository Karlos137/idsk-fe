import moment from 'moment'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import InputGovDescription from '../../components/InputsUtils/InputGovDescription'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import { useFilterContextInput } from '../../context/FilterContext'
import { DATE_FORMAT_ISO8601_SHORT } from '../../utils/dateFormat'

interface iDateFilterInput {
  name: string
  label: string
  description?: string
  withTime?: boolean
}

const DateFilterInput = ({ name, label, withTime = false, description }: iDateFilterInput) => {
  const { value, setValue } = useFilterContextInput(name)
  const [openLabel, setOpenLabel] = useState(!!value)

  return (
    <div className={'gov-form-control ' + (value || openLabel ? 'not-empty' : '')}>
      <DatePicker
        isClearable={true}
        dateFormat={withTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
        showTimeInput={withTime}
        onChange={(date) => {
          // const dateString = date ? moment(date).toISOString(true).split('T') : ''
          const dateString = date ? moment(date).format(DATE_FORMAT_ISO8601_SHORT) : ''
          setValue(dateString)
        }}
        selected={value ? moment(value).toDate() : undefined}
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
      <InputGovLabel inputId={'datepicker-' + name} label={label} />
      <InputGovDescription text={description} />
    </div>
  )
}

export default DateFilterInput
