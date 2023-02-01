import React from 'react'
import { PlusLg } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import ButtonGov from './ButtonGov'

interface iBtnNew {
  title: string
  to: string
}

const BtnNew = ({ title, to }: iBtnNew) => {
  const navigate = useNavigate()
  return (
    <ButtonGov variant='primary' onClick={() => navigate(to)}>
      <PlusLg className='me-2' /> {title}
    </ButtonGov>
  )
}

export default BtnNew
