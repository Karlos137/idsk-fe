import React from 'react'
import { useFilterContextInput } from '../../context/FilterContext'

interface iCheckFilterInput {
  name: string
  label: string
  filterValue?: string
}

const CheckFilterInput = ({ name, label, filterValue }: iCheckFilterInput) => {
  const { value, setValue } = useFilterContextInput(name)

  return (
    <div className='gov-form-control gov-form-control--custom'>
      <ul className='gov-form-group'>
        <li className='gov-form-group__item'>
          <input
            id={'check-' + name}
            className='gov-form-control__checkbox'
            type='checkbox'
            checked={value}
            onChange={(e) =>
              setValue(e.target.checked ? (filterValue !== undefined ? filterValue : e.target.checked) : '')
            }
            name={name}
            aria-required='false'
            aria-disabled='false'
          />
          <label className='gov-form-control__label' htmlFor={'check-' + name}>
            {label}
          </label>
          <span className='gov-form-control__indicator'></span>
        </li>
      </ul>
    </div>
  )
}

export default CheckFilterInput
