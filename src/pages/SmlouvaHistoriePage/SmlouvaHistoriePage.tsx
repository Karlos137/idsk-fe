import React from 'react'
import { useParams } from 'react-router-dom'
import { LINKS } from '../../components/App/LINKS'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import PageWrap from '../../components/PageWrap/PageWrap'
import { FilterContextProvider } from '../../context/FilterContext'
import { TABLE_TYPES } from '../../enums/enumTableTypes'
import HistoryBlock from '../../forms/blocks/HistoryBlock'

const SmlouvaHistorieDetailPage = () => {
  const { id } = useParams()

  return (
    <>
      <PageWrap title={'Historie smlouvy'}>
        <div>
          <ButtonGovLink variant='primary-outlined' to={LINKS.prehledSmluv + '/' + id}>
            Aktuální verze
          </ButtonGovLink>
        </div>
        <fieldset className='mt-5'>
          <legend>Historie procesních kroků</legend>
          <FilterContextProvider name={TABLE_TYPES.contractHistory}>
            <HistoryBlock id={id!} />
          </FilterContextProvider>
        </fieldset>
      </PageWrap>
    </>
  )
}

export default SmlouvaHistorieDetailPage
