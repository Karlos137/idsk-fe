import React, { useState } from 'react'
import ButtonGov, { iBtnGov } from './ButtonGov'

export interface iBtnGovConfirm extends iBtnGov {
  confirmText: string
}

const ButtonGovConfirm = ({ confirmText, children, onClick, ...others }: iBtnGovConfirm) => {
  const [confirm, setConfirm] = useState(false)

  const onClickConfirm = (e: any) => {
    if (confirm) {
      onClick && onClick(e)
    } else {
      setConfirm(true)
    }
  }

  const onClickStorno = (e: any) => {
    e.preventDefault()
    setConfirm(false)
  }

  return (
    <>
      <ButtonGov onClick={onClickConfirm} {...others}>
        {confirm ? confirmText : children}
      </ButtonGov>
      {confirm && <ButtonGov onClick={onClickStorno}>Zrušit</ButtonGov>}
    </>
  )
}

export default ButtonGovConfirm
