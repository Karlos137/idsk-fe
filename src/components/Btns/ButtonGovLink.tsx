import React from 'react'
import { Link } from 'react-router-dom'
import { iBtnGov } from './ButtonGov'

interface iBtnGovLink extends iBtnGov {
  to: string
}

const ButtonGovLink = ({ to, variant, size, inversed, children, className, ...others }: iBtnGovLink) => {
  const classes = [className, 'gov-button']
  if (variant) {
    classes.push('gov-button--' + variant)
  }
  if (size) {
    classes.push('gov-button--' + size)
  }
  if (inversed) {
    classes.push('gov-button--inversed')
  }

  return (
    <Link className={classes.join(' ')} {...others} to={to}>
      {children}
    </Link>
  )
}

export default ButtonGovLink
