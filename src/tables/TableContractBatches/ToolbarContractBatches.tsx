import React from 'react'
import { LINKS } from '../../components/App/LINKS'
import BtnFilters from '../../components/Btns/BtnFilters'
import BtnNew from '../../components/Btns/BtnNew'
import VariantsTabs from '../../components/VariantsTabs/VariantsTabs'
import { VARIANTS_TABLE_CONTRACTBATCHES_OPTIONS } from '../../enums/enumTablesVariants'
import { useUserAuth } from '../../hooks/useUserAuth'
import DropdownContractBatches from './DropdownContractBatches'
import FilterContractBatches from './FilterContractBatches'

const ToolbarContractBatches = () => {
  const { isReferent } = useUserAuth()

  return (
    <>
      <div className='d-flex justify-content-between mb-4'>
        <BtnFilters />

        <div className='d-flex'>
          {isReferent && <BtnNew title='Nova dávka smluv' to={LINKS.novaDavkaSmluv} />}
          {/*<DropdownContractBatches />*/}
        </div>
      </div>

      <FilterContractBatches />
      <VariantsTabs variants={VARIANTS_TABLE_CONTRACTBATCHES_OPTIONS} />
      {/*todo contexmenu*/}
      {/*<ContexMenuContractBatches />*/}
    </>
  )
}

export default ToolbarContractBatches
