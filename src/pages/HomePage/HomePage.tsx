import React, { useEffect } from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import { FilterContextProvider } from '../../context/FilterContext'
import { VARIANTS_TABLE_CONTRACTS } from '../../enums/enumTablesVariants'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { setVariant } from '../../redux/global/globalSlice'
import { useAppDispatch } from '../../redux/store'
import TableContract from '../../tables/TableContracts/TableContract'

const HomePage = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setVariant({ name: TABLE_TYPES.contracts, variant: VARIANTS_TABLE_CONTRACTS.kvyrizeni }))
  }, [])

  return (
    <>
      <PageWrap title='Smlouvy k vyřízení'>
        <FilterContextProvider name={TABLE_TYPES.contracts}>
          {/*<ToolbarContracts />*/}
          <TableContract />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default HomePage
