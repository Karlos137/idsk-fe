import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import FormContract from '../../forms/FormContract/FormContract'

const SmlouvaNovaPage = () => {
  return (
    <>
      <PageWrap title='Založení nové smlouvy / smluvního dodatku'>
        <FormContract id={''} />
      </PageWrap>
    </>
  )
}

export default SmlouvaNovaPage
