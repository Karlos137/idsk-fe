import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import { useParams } from 'react-router-dom'
import FormContractBatch from '../../forms/FormContractBatch/FormContractBatch'

const DavkaSmluvDetailPage = () => {
  const { id } = useParams()

  return (
    <>
      <PageWrap title='Detail dávky smluv'>
        <FormContractBatch id={id!} />
      </PageWrap>
    </>
  )
}

export default DavkaSmluvDetailPage
