import React from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import AvatarBlock from '../../forms/blocks/AvatarBlock'
import FormUser from '../../forms/FormUser/FormUser'
import { useSelector } from 'react-redux'
import { selectUserId } from '../../redux/user/selectors'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import { LINKS } from '../../components/App/LINKS'

const UzivatelProfilPage = () => {
  const userId = useSelector(selectUserId)
  return (
    <PageWrap title='Profil uživatele'>
      <div className='text-end'>
        <ButtonGovLink variant='primary' to={LINKS.zmenaHesla}>
          Změnit heslo
        </ButtonGovLink>
      </div>
      <AvatarBlock />
      <FormUser id={userId!} isProfil={true} />
    </PageWrap>
  )
}

export default UzivatelProfilPage
