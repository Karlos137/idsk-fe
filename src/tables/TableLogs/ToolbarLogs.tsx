import React from 'react'
import { LINKS } from '../../components/App/LINKS'
import BtnFilters from '../../components/Btns/BtnFilters'
import BtnNew from '../../components/Btns/BtnNew'
import FilterUsers from '../TableUsers/FilterUsers'

const ToolbarUsers = () => {
  return (
    <>
      <div className='d-flex justify-content-between mb-4'>
        <BtnFilters />
      </div>

      <FilterUsers />
      {/*todo contexmenu*/}
      {/*<ContexMenuUsers />*/}
    </>
  )
}

export default ToolbarUsers
