import React from 'react'
import { ArrowRightShort } from 'react-bootstrap-icons'
import { LINKS } from '../../components/App/LINKS'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableSubjects from '../../tables/TableSubjects/TableSubjects'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import { FilterContextProvider } from '../../context/FilterContext'
import ToolbarSubjects from '../../tables/TableSubjects/ToolbarSubjects'

const SubjektyPage = () => {
  return (
    <>
      <PageWrap
        title='Subjekty'
        subtitle={
          <ButtonGovLink variant='primary-outlined' to={LINKS.subjektyDso}>
            DSO <ArrowRightShort className='ms-2' />
          </ButtonGovLink>
        }
      >
        <FilterContextProvider name={TABLE_TYPES.subjects}>
          <ToolbarSubjects />
          <TableSubjects />
        </FilterContextProvider>
      </PageWrap>
    </>
  )
}

export default SubjektyPage
