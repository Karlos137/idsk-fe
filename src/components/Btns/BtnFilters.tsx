import React from 'react'
import { Funnel, FunnelFill } from 'react-bootstrap-icons'
import { useFilterContext } from '../../context/FilterContext'
import ButtonGov from './ButtonGov'

const BtnFilters = () => {
  const { openFilter, setOpenFilter } = useFilterContext()

  return (
    <ButtonGov variant='primary' className='me-3' onClick={() => setOpenFilter(!openFilter)}>
      {openFilter ? <FunnelFill className='me-2' /> : <Funnel className='me-2' />} Filtrovat
    </ButtonGov>
  )
}

export default BtnFilters
