import React from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useUserAuth } from '../../hooks/useUserAuth'
import { LINKS } from '../App/LINKS'

interface iMenuLink {
  link: string
  label: string
  subnav?: { link: string; label: string; hide?: boolean }[]
  hide?: boolean
}

const MenuLink = ({ link, label, subnav, hide }: iMenuLink) => {
  //skryje submenu
  const clearFocus = () => {
    // @ts-ignore
    document.activeElement?.blur()
  }

  const match = useMatch(link)

  if (hide) {
    return null
  }

  return (
    <li className={'gov-portal-nav__item ' + (subnav ? 'has-subnav' : '')}>
      <Link to={link} className={'gov-portal-nav__link ' + (match ? 'is-active' : '')}>
        {label}
      </Link>

      {subnav && (
        <nav className='gov-portal-subnav gov-portal-subnav--mini'>
          <ul className='gov-portal-subnav__submenu'>
            {subnav
              .filter(({ hide }) => !hide)
              .map(({ link, label }, index) => (
                <li key={index}>
                  <Link to={link} onClick={clearFocus} className='gov-link--inversed'>
                    {label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      )}
    </li>
  )
}

const Menu = () => {
  const { isReferent, isOrgAdmin } = useUserAuth()

  return (
    <nav className='gov-portal-nav'>
      <ul className='gov-portal-nav__menu'>
        <MenuLink link={LINKS.home} label='Úvod' />
        <MenuLink link={LINKS.prehledSmluv} label='Přehled smluv' />
        <MenuLink link={LINKS.novaSmlouva} label='Nová smlouva' hide={!isReferent} />
        <MenuLink link={LINKS.prehledDavekSmluv} label='Přehled dávek smluv' hide={!isReferent} />
        <MenuLink link={LINKS.novaDavkaSmluv} label='Nová dávka smluv' hide={!isReferent} />
        {/*<MenuLink link={LINKS.platby} label='Platby' hide={!isReferent} />*/}
        <MenuLink link={LINKS.subjekty} label='Subjekty' hide={!isReferent} />
        <MenuLink
          link={LINKS.sprava}
          label='Správa'
          hide={!isOrgAdmin && !isReferent}
          subnav={[
            { link: LINKS.uzivatele, label: 'Uživatelé' },
            { link: LINKS.spravaLogy, label: 'Logy', hide: !isReferent },
          ]}
        />
      </ul>
    </nav>
  )
}

export default Menu
