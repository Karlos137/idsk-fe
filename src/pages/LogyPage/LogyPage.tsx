import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableLogs from '../../tables/TableLogs/TableLogs'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { FilterContextProvider } from '../../context/FilterContext'
import ToolbarUsers from '../../tables/TableUsers/ToolbarUsers'

const UzivatelePage = () => {
  return (
    <>
      <PageWrap title='Logy'>
        <FilterContextProvider name={TABLE_TYPES.logs}>
          <ToolbarUsers />
          <TableLogs />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default UzivatelePage
