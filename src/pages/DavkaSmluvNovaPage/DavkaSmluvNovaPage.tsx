import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import FormContractBatch from '../../forms/FormContractBatch/FormContractBatch'

const DavkaSmluvNovaPage = () => {
  return (
    <>
      <PageWrap title='Založení nové dávky smluv'>
        <FormContractBatch id={''} />
      </PageWrap>
    </>
  )
}

export default DavkaSmluvNovaPage
