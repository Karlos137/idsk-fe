import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import { validPassword, validPasswordErrorMsg } from '../../utils/validations'
import { LINKS } from '../App/LINKS'
import ButtonGov from '../Btns/ButtonGov'
import Error from '../Error/Error'
import InputGov from '../Inputs/InputGov'
import WrapFormSmall from './WrapFormSmall'

interface iResetPassword {
  activate?: boolean
}

const ResetPasswordForm = ({ activate }: iResetPassword) => {
  const navigate = useNavigate()

  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return <Error msg={'Prazdný token'} />
  }

  const submit = () => {
    setLoading(true)
    IamApi.userNewPassword(token, pass)
      .then((data) => {
        toast.success(activate ? 'Uživatel aktivování' : 'Heslo změněno')
        navigate(LINKS.login)
      })
      .catch((e) => {
        //TODO parse errot
        if (e.response.status === 422) {
          toast.error('Heslo není dostatečně složité nebo není bezpečné')
        } else {
          toast.error(activate ? 'Chyba aktivace uživatele' : 'Chyba změny hesla')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const diferentPass = pass !== pass2
  const errPass = !!pass && !validPassword(pass)
  const errPass2 = !!pass2 && diferentPass

  return (
    <WrapFormSmall>
      <h1>{activate ? 'Aktivace uživatele' : 'Nastavení nového hesla'}</h1>

      <InputGov
        type='password'
        name='pass'
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        label='Heslo'
        error={errPass ? validPasswordErrorMsg : ''}
      />

      <InputGov
        type='password'
        name='pass2'
        value={pass2}
        onChange={(e) => setPass2(e.target.value)}
        label='Heslo znovu'
        error={errPass2 ? 'Hesla nejsou stejná' : ''}
      />

      <div className='text-center'>
        <ButtonGov
          variant='primary'
          onClick={submit}
          loading={loading}
          disabled={!pass || errPass || diferentPass || loading}
        >
          {activate ? 'Aktivovat uživatele' : 'Změnit heslo'}
        </ButtonGov>
      </div>
    </WrapFormSmall>
  )
}

export default ResetPasswordForm
