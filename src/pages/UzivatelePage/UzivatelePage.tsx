import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableUsers from '../../tables/TableUsers/TableUsers'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { FilterContextProvider } from '../../context/FilterContext'
import ToolbarUsers from '../../tables/TableUsers/ToolbarUsers'

const UzivatelePage = () => {
  return (
    <>
      <PageWrap title='Uživatelé'>
        <FilterContextProvider name={TABLE_TYPES.users}>
          <ToolbarUsers />
          <TableUsers />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default UzivatelePage
