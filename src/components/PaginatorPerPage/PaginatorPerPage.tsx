import React from 'react'
import Paginator from '../Paginator/Paginator'
import PerPage from '../PerPage/PerPage'

interface iPaginatorPerPage {
  totalCount: number
  maxPerPage?: number
}

const PaginatorPerPage = ({ totalCount, maxPerPage }: iPaginatorPerPage) => {
  return (
    <>
      <div className='row justify-content-end'>
        <div className='gov-pagination col-sm-8 col-md-9 col-lg-6'>
          <Paginator totalCount={totalCount} />
        </div>

        <div className=' col-12 col-sm-4 col-md-3 col-lg-3'>
          <PerPage totalCount={totalCount} maxPerPage={maxPerPage} />
        </div>
      </div>
    </>
  )
}

export default PaginatorPerPage
