import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'
import { logOutAction } from '../../redux/user/actions'
import { selectUserIsLoged, selectUserName } from '../../redux/user/selectors'
import { LINKS } from '../App/LINKS'
import logo from './logo.svg'
import Menu from './Menu'

const Header = () => {
  const username = useSelector(selectUserName)
  const isloged = useSelector(selectUserIsLoged)

  const dispatch = useAppDispatch()
  const logout = () => {
    dispatch(logOutAction())
  }

  return (
    <header className='gov-container gov-container--no-y-offset gov-portal-header'>
      <div className='gov-container__content'>
        <div className='gov-portal-header__upper'>
          <div className='gov-portal-header__column'>
            <a
              className='gov-logo gov-logo--inversed'
              href='https://www.idsk.cz/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src={logo} alt='IDSK logo' height={52} style={{ height: 30, maxWidth: 'none' }} />
            </a>
            <button className='gov-hamburger'> Menu</button>
          </div>
          <div className='gov-portal-header__column'>
            {/*<div className="gov-search ">*/}
            {/*  <div className="gov-search__inner">*/}
            {/*    <div className="gov-form-control gov-form-control--inversed">*/}
            {/*      <input id="search-input"*/}
            {/*             className="gov-form-control__input gov-js-input gov-form-control__input--standalone"*/}
            {/*             type="text" aria-required="false" aria-disabled="false" placeholder="Hledat"/>*/}
            {/*      <label className="gov-form-control__label u-sr-only" htmlFor="search-input">*/}
            {/*        Hledat*/}
            {/*      </label>*/}
            {/*    </div>*/}
            {/*    <button className="gov-button gov-button--primary gov-button--icon-only gov-search__submit"*/}
            {/*            aria-labelledby="ho-submit">*/}
            {/*      <span id="ho-submit" className="u-sr-only gov-button__label"> Hledat </span>*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className='gov-portal-header__extras'>
              {isloged ? (
                <>
                  <Link to={LINKS.profil} className='gov-button gov-button--inversed me-0'>
                    {username}
                  </Link>

                  <button onClick={logout} className='gov-button gov-button--small gov-button--inversed'>
                    <span className='gov-icon gov-icon--exit'></span>
                  </button>
                </>
              ) : (
                <>
                  {/*<Link to={LINKS.login} className="gov-button  gov-button--primary-outlined  gov-button--inversed">*/}
                  {/*  Přihlásit se do IDSK*/}
                  {/*</Link>*/}
                </>
              )}

              {/*<div className="gov-lang-switch">*/}
              {/*  <select defaultValue="cs" id="lang-select" className="gov-lang-switch__select">*/}
              {/*    <option value="cs">CZ</option>*/}
              {/*    <option value="sk">SK</option>*/}
              {/*    <option value="en">EN</option>*/}
              {/*  </select>*/}
              {/*  <label className="u-sr-only" htmlFor="lang-select">*/}
              {/*    Změna jazyka*/}
              {/*  </label>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        <hr className='gov-header__separator' />
        {isloged && <Menu />}
      </div>
    </header>
  )
}

export default Header
