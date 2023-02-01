import React from 'react'
import { Link } from 'react-router-dom'

interface iBcrumb {
  items: { link?: string; label: string }[]
  nohomelink?: boolean
}

const HOME_LABEL = 'Úvod'

const BreadcrumbApp = ({ items, nohomelink }: iBcrumb) => {
  if (items.length === 0 && nohomelink) {
    return null
  }

  const itemsr = !nohomelink ? [{ label: HOME_LABEL, link: items.length ? '/' : undefined }, ...items] : items

  // https://designsystem.gov.cz/pl/?p=viewall-molecules--02-gov-breadcrumbs
  return (
    <div className='gov-container gov-container--no-y-offset'>
      <div className='gov-container__content'>
        <div className='gov-breadcrumbs'>
          {itemsr.map((item, index) => (
            <span key={index} className='gov-breadcrumbs__item'>
              {item.link ? (
                <Link className='gov-link gov-link--standalone' to={item.link}>
                  {item.label}
                </Link>
              ) : (
                <strong className='gov-title gov-title--delta'>{item.label}</strong>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BreadcrumbApp
