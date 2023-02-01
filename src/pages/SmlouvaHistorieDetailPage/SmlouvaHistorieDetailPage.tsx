import React from 'react'
import { useParams } from 'react-router-dom'
import PageWrap from '../../components/PageWrap/PageWrap'
import FormContract from '../../forms/FormContract/FormContract'

const SmlouvaHistorieDetailPage = () => {
  const { id, versionId } = useParams()

  return (
    <>
      <PageWrap title={'Historie smlouvy'}>
        <FormContract key={versionId} id={id!} versionId={versionId} />
      </PageWrap>
    </>
  )
}

export default SmlouvaHistorieDetailPage
