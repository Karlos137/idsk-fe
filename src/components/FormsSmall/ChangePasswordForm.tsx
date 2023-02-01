import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import { validPassword, validPasswordErrorMsg } from '../../utils/validations'
import { LINKS } from '../App/LINKS'
import ButtonGov from '../Btns/ButtonGov'
import InputGov from '../Inputs/InputGov'
import WrapFormSmall from './WrapFormSmall'

const ChangePasswordForm = () => {
  const navigate = useNavigate()

  const [passOld, setPassOld] = useState('')
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true)
    IamApi.userChangePassword(passOld, pass)
      .then((data) => {
        toast.success('Heslo změněno')
        navigate(LINKS.profil)
      })
      .catch((e) => {
        if (e.response.status === 422) {
          toast.error('Heslo není dostatečně složité nebo není bezpečné')
        } else if (e.response.data.error.code === 1709) {
          toast.error('Chybné staré heslo')
        } else if (e.response.data.error.code === 1710) {
          toast.error('Nové heslo je shodné jako aktuální')
        } else {
          toast.error('Chyba změny hesla')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const diferentPass = pass !== pass2
  const errPass = !!pass && !validPassword(pass)
  const errPass2 = !!pass2 && diferentPass
  const samePass = !!passOld && passOld === pass

  return (
    <WrapFormSmall>
      <InputGov
        type='password'
        name='passOld'
        value={passOld}
        onChange={(e) => setPassOld(e.target.value)}
        label='Staré heslo'
      />

      <InputGov
        type='password'
        name='pass'
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        label='Nové heslo'
        tooltip={validPasswordErrorMsg}
        error={errPass ? validPasswordErrorMsg : samePass ? 'Staré a nové heslo jsou stejné' : ''}
      />

      <InputGov
        type='password'
        name='pass2'
        value={pass2}
        onChange={(e) => setPass2(e.target.value)}
        label='Nové heslo znovu'
        error={errPass2 ? 'Hesla nejsou stejná' : ''}
      />

      <div className='text-center'>
        <ButtonGov
          variant='primary'
          onClick={submit}
          loading={loading}
          disabled={!passOld || !pass || errPass || diferentPass || loading || samePass}
        >
          Změnit heslo
        </ButtonGov>
      </div>
    </WrapFormSmall>
  )
}

export default ChangePasswordForm
