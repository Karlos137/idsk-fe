import React from 'react'
import { useParams } from 'react-router-dom'
import PageWrap from '../../components/PageWrap/PageWrap'
import FormUser from '../../forms/FormUser/FormUser'

const UzivateleDetailPage = () => {
  const { userid } = useParams()

  return (
    <>
      <PageWrap title='Detail uživatele'>
        <FormUser id={userid!} />
      </PageWrap>
    </>
  )
}

export default UzivateleDetailPage
