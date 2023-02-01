import React from 'react'

interface iWrapFormSmall {
  children: React.ReactNode
  width?: number
}

const WrapFormSmall = ({ children, width = 500 }: iWrapFormSmall) => {
  return (
    <div className='d-flex justify-content-center align-items-center flex-grow-1'>
      <div className='bg-white p-4 card border-0 shadow rounded-3' style={{ width: width, maxWidth: '100%' }}>
        {children}
      </div>
    </div>
  )
}

export default WrapFormSmall
