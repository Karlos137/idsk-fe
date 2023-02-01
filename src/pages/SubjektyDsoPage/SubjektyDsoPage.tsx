import React from 'react'
import { ArrowRightShort } from 'react-bootstrap-icons'
import { LINKS } from '../../components/App/LINKS'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableDso from '../../tables/TableDso/TableDso'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { FilterContextProvider } from '../../context/FilterContext'
import ToolbarDso from '../../tables/TableDso/ToolbarDso'

const SubjektyDsoPage = () => {
  return (
    <>
      <PageWrap
        title='DSO'
        subtitle={
          <ButtonGovLink variant='primary-outlined' to={LINKS.subjekty}>
            Subjekty <ArrowRightShort className='ms-2' />
          </ButtonGovLink>
        }
      >
        <FilterContextProvider name={TABLE_TYPES.dso}>
          <ToolbarDso />
          <TableDso />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default SubjektyDsoPage
