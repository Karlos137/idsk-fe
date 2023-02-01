import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import { useParams } from 'react-router-dom'
import FormSubject from '../../forms/FormSubject/FormSubject'

const SubjektDetailPage = () => {
  const { id } = useParams()

  return (
    <>
      <PageWrap title='Detail subjektu'>
        <FormSubject id={id!} />
      </PageWrap>
    </>
  )
}

export default SubjektDetailPage
