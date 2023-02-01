import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableContract from '../../tables/TableContracts/TableContract'
import ToolbarContracts from '../../tables/TableContracts/ToolbarContracts'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { FilterContextProvider } from '../../context/FilterContext'

const SmlouvaPrehledPage = () => {
  return (
    <>
      <PageWrap title='Přehled smluv'>
        <FilterContextProvider name={TABLE_TYPES.contracts}>
          <ToolbarContracts />
          <TableContract />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default SmlouvaPrehledPage
