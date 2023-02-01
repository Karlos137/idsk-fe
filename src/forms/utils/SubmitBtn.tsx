import React from 'react'
import ButtonGov from '../../components/Btns/ButtonGov'

interface iSubmitBtn {
  title: string
  disabled?: boolean
  loading?: boolean
}

const SubmitBtn = ({ title, disabled, loading }: iSubmitBtn) => {
  return (
    <div className='text-center py-5'>
      <ButtonGov variant='primary' disabled={disabled} type='submit' loading={loading}>
        {title}
      </ButtonGov>
    </div>
  )
}

export default SubmitBtn
