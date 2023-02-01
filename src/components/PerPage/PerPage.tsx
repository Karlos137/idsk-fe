import React from 'react'
import { useFilterContext } from '../../context/FilterContext'

interface iPerPage {
  totalCount: number
  maxPerPage?: number
}

const PerPage = ({ totalCount, maxPerPage }: iPerPage) => {
  const setLimitValue = (value: number) => {
    setLimit(value)
  }
  const { limit, setLimit } = useFilterContext()

  const options = [
    { value: '10', label: '10 řádků' },
    { value: '25', label: '25 řádků' },
    { value: '50', label: '50 řádků' },
    { value: '100', label: '100 řádků' },
    { value: '250', label: '250 řádků' },
  ].filter(({ value }) => !maxPerPage || Number(value) <= maxPerPage)

  return (
    <div className='gov-form-control not-empty'>
      <div className='gov-select'>
        <select
          id='perPage'
          value={limit}
          onChange={(e) => setLimitValue(parseInt(e.target.value))}
          name='custom-select'
          aria-required='false'
          aria-disabled='false'
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className='gov-form-control__label ' htmlFor='perPage'>
          Počet řádků
        </label>
      </div>
      <small>Celkem: {totalCount}</small>
    </div>
  )
}

export default PerPage
