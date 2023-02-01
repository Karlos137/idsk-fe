import React, { ButtonHTMLAttributes } from 'react'
import Spinner from 'react-bootstrap/Spinner'

export interface iBtnGov extends ButtonHTMLAttributes<any> {
  variant?: 'primary' | 'primary-outlined'
  size?: 'small' | 'large'
  inversed?: boolean
  loading?: boolean
}

const ButtonGov = ({ type = 'button', variant, size, inversed, children, className, loading, ...others }: iBtnGov) => {
  const classes = [className]
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
    <button type={type} className={classes.join(' ')} {...others}>
      {loading && <Spinner animation='border' className='me-2' size='sm' />}
      {children}
    </button>
  )
}

export default ButtonGov
