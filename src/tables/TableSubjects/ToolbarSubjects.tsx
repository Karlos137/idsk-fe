import React from 'react'
import { LINKS } from '../../components/App/LINKS'
import BtnFilters from '../../components/Btns/BtnFilters'
import BtnNew from '../../components/Btns/BtnNew'
import VariantsTabs from '../../components/VariantsTabs/VariantsTabs'
import { VARIANTS_TABLE_SUBJECTS_OPTIONS } from '../../enums/enumTablesVariants'
import FilterSubjects from './FilterSubjects'

const ToolbarSubjects = () => {
  return (
    <>
      <div className='d-flex justify-content-between mb-4'>
        <BtnFilters />

        <div className='d-flex'>
          <BtnNew title='Nový subjekt' to={LINKS.novySubjekt} />
        </div>
      </div>

      <FilterSubjects />
      <VariantsTabs variants={VARIANTS_TABLE_SUBJECTS_OPTIONS} />
      {/*todo contexmenu*/}
      {/*<ContexMenuSubjects />*/}
    </>
  )
}

export default ToolbarSubjects
