import React from 'react'
import { LINKS } from '../../components/App/LINKS'
import BtnFilters from '../../components/Btns/BtnFilters'
import BtnNew from '../../components/Btns/BtnNew'
import FilterDso from './FilterDso'

const ToolbarDso = () => {
  return (
    <>
      <div className='d-flex justify-content-between mb-4'>
        <BtnFilters />

        <div className='d-flex'>
          <BtnNew title='Nový subjekt' to={LINKS.novySubjekt} />
        </div>
      </div>

      <FilterDso />
      {/*todo contexmenu*/}
      {/*<ContexMenuDso />*/}
    </>
  )
}

export default ToolbarDso
