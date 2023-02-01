import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ButtonGov from '../../components/Btns/ButtonGov'
import InputGov from '../../components/Inputs/InputGov'
import { useAppDispatch } from '../../redux/store'
import { logIn } from '../../redux/user/actions'
import { LINKS } from '../App/LINKS'
import WrapFormSmall from './WrapFormSmall'

const LoginForm = () => {
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')

  const dispatch = useAppDispatch()
  const clickLogin = () => {
    dispatch(logIn(name, pass))
  }

  return (
    <WrapFormSmall width={350}>
      <h1>Přihlášení</h1>
      <form onSubmit={clickLogin} className='d-flex flex-column'>
        <InputGov name='login' value={name} onChange={(e) => setName(e.target.value)} label='Přihlašovací jméno' />
        <InputGov type='password' name='pass' value={pass} onChange={(e) => setPass(e.target.value)} label='Heslo' />

        <Link to={LINKS.zapomenuteHeslo} className='gov-link gov-link--small mb-5'>
          Zapomněli jste heslo?
        </Link>

        <div className='text-center'>
          <ButtonGov variant='primary' type='submit'>
            Přihlásit
          </ButtonGov>
        </div>
      </form>
    </WrapFormSmall>
  )
}

export default LoginForm
