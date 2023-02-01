import React from 'react'
import { useLocation } from 'react-router-dom'
import { LINKS } from '../App/LINKS'
import BreadcrumbApp from '../BreadcrumbApp/BreadcrumbApp'

interface iPageWrap {
  title?: string
  subtitle?: string | React.ReactNode
  breadcrumbsItems?: { link?: string; label: string }[]
  children?: React.ReactNode
}

// jen stranky ve kterych jsou zanorene dalsi
const LINK_TO_TITLE = {
  [LINKS.prehledSmluv]: 'Přehled smluv',
  [LINKS.sprava]: 'Správa',
  [LINKS.uzivatele]: 'Uživatelé',
  [LINKS.subjekty]: 'Subjekty',
  [LINKS.prehledDavekSmluv]: 'Přehled dávek smluv',
  [LINKS.profil]: 'Profil uživatele',
}

const PageWrap = ({ title, subtitle, breadcrumbsItems, children }: iPageWrap) => {
  const location = useLocation()

  if (!breadcrumbsItems) {
    breadcrumbsItems = []
    const parts = location.pathname.split('/').filter((p) => p)
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        const label = title || part
        breadcrumbsItems?.push({ label: label })
      } else {
        const link = '/' + parts.slice(0, index + 1).join('/') // poskladani z rootu
        const label = LINK_TO_TITLE[link] || part
        breadcrumbsItems?.push({ label: label, link: link })
      }
    })
  }

  return (
    <>
      <BreadcrumbApp items={breadcrumbsItems} />
      <div className='gov-container'>
        <div className='gov-container__content'>
          <div className='mb-5'>
            {title && <h1 className='title mb-0'>{title}</h1>}
            {subtitle && <h3>{subtitle}</h3>}
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

export default PageWrap
