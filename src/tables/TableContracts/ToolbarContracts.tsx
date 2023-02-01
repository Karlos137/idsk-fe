import React from 'react'
import { LINKS } from '../../components/App/LINKS'
import BtnFilters from '../../components/Btns/BtnFilters'
import BtnNew from '../../components/Btns/BtnNew'
import VariantsTabs from '../../components/VariantsTabs/VariantsTabs'
import { VARIANTS_TABLE_CONTRACTS_OPTIONS } from '../../enums/enumTablesVariants'
import { useUserAuth } from '../../hooks/useUserAuth'
import DropdownContracts from './DropdownContracts'
import FilterContracts from './FilterContracts'

const ToolbarContracts = () => {
  const { isReferent } = useUserAuth()

  return (
    <>
      <div className='d-flex justify-content-between mb-4'>
        <BtnFilters />

        <div className='d-flex'>
          {isReferent && <BtnNew title='Nová smlouva' to={LINKS.novaSmlouva} />}
          {/*<DropdownContracts />*/}
        </div>
      </div>

      <FilterContracts />
      <VariantsTabs variants={VARIANTS_TABLE_CONTRACTS_OPTIONS} />
      {/*todo contexmenu*/}
      {/*<ContexMenuContracts />*/}
    </>
  )
}

export default ToolbarContracts
