import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import { LINKS } from '../App/LINKS'
import ButtonGov from '../Btns/ButtonGov'
import InputGov from '../Inputs/InputGov'
import WrapFormSmall from './WrapFormSmall'

const ForgotPasswordForm = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true)
    IamApi.userForgotPasswordByUsername(username)
      .then((data) => {
        toast.success('Odeslán e-mail pro změněnu hesla')
        navigate(LINKS.login)
      })
      .catch((err) => {
        if (err.response.data.error.code === 2104) {
          toast.error('Již existuje žádost o reset hesla.')
        } else {
          toast.error('Chyba zapomenutého hesla')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <WrapFormSmall>
      <h1>Zapomenuté heslo</h1>

      <InputGov
        name='email'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label='Přihlašovací jméno'
      />

      <div className='text-center'>
        <ButtonGov variant='primary' onClick={submit} loading={loading} disabled={!username || loading}>
          Resetovat heslo
        </ButtonGov>
      </div>
    </WrapFormSmall>
  )
}

export default ForgotPasswordForm
