import React from 'react'
import { useParams } from 'react-router-dom'
import PageWrap from '../../components/PageWrap/PageWrap'
import FormContract from '../../forms/FormContract/FormContract'

const SmlouvaDetailPage = () => {
  const { id } = useParams()

  return (
    <>
      <PageWrap title='Detail smlouvy'>
        <FormContract id={id!} />
      </PageWrap>
    </>
  )
}

export default SmlouvaDetailPage
