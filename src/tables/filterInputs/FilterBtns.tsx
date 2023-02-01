import React from 'react'
import ButtonGov from '../../components/Btns/ButtonGov'
import { useFilterContext } from '../../context/FilterContext'

const FilterBtns = () => {
  const { isEmpty, applyFilter, clearFilter } = useFilterContext()

  const doFilter = () => {
    applyFilter()
  }

  const resetFilter = () => {
    clearFilter()
  }

  return (
    <div className='text-end'>
      <ButtonGov variant='primary' className=' me-2' onClick={() => doFilter()} disabled={isEmpty}>
        Filtrovat
      </ButtonGov>

      <ButtonGov variant='primary-outlined' onClick={() => resetFilter()} disabled={isEmpty}>
        Zrušit filtr
      </ButtonGov>
    </div>
  )
}

export default FilterBtns
