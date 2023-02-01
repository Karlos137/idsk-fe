import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableContractBatches from '../../tables/TableContractBatches/TableContractBatches'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { FilterContextProvider } from '../../context/FilterContext'
import ToolbarContractBatches from '../../tables/TableContractBatches/ToolbarContractBatches'

const DavkaSmluvPrehledPage = () => {
  return (
    <>
      <PageWrap title='Přehled dávek smluv'>
        <FilterContextProvider name={TABLE_TYPES.contractBatches}>
          <ToolbarContractBatches />
          <TableContractBatches />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default DavkaSmluvPrehledPage
