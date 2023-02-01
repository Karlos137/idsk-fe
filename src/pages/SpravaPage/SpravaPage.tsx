import React from 'react'
import { LINKS } from '../../components/App/LINKS'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import PageWrap from '../../components/PageWrap/PageWrap'

const SpravaPage = () => {
  return (
    <>
      <PageWrap title='Správa'>
        <ButtonGovLink variant='primary' to={LINKS.uzivatele} className='me-4'>
          Správa uživatelů
        </ButtonGovLink>
        {/*todo jen pro referenta*/}
        {/*        <ButtonGovLink variant='primary' to={LINKS.spravaLogy}>*/}
        {/*          Správa logů*/}
        {/*        </ButtonGovLink>*/}
      </PageWrap>
    </>
  )
}

export default SpravaPage
