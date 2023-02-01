import React from 'react'
import { useFilterContext } from '../../context/FilterContext'

interface iPaginator {
  totalCount: number
}

const Paginator = ({ totalCount }: iPaginator) => {
  const { page: activePage, limit, setPage } = useFilterContext()

  const setActivePage = (value: number) => {
    setPage(value)
  }

  const pagesCount = Math.ceil(totalCount / limit)

  const numNumber = 2
  const btns = []
  for (var i = activePage - numNumber; i <= activePage + numNumber; i++) {
    if (i > 1 && i < pagesCount) {
      btns.push(i)
    }
  }

  const PagItem = ({ page }: { page: number }) => (
    <button
      onClick={() => setActivePage(page)}
      className={'gov-pagination__item ' + (activePage === page ? 'gov-pagination__item--active' : '')}
    >
      {page}
    </button>
  )

  return (
    <div className='gov-pagination__holder'>
      <button
        aria-label='Předchozí'
        onClick={() => setActivePage(activePage - 1)}
        className={'gov-pagination__item ' + (activePage === 1 ? ' gov-pagination__item--disabled' : '')}
      >
        <span className={'gov-icon gov-icon--arrow-left'}></span>
      </button>

      <PagItem page={1} />
      {activePage > numNumber + 2 && <span className='gov-pagination__item gov-pagination__item--dots'>...</span>}
      {btns.map((page) => (
        <PagItem key={page} page={page} />
      ))}
      {activePage < pagesCount - numNumber - 1 && (
        <span className='gov-pagination__item gov-pagination__item--dots'>...</span>
      )}
      {pagesCount > 1 && <PagItem page={pagesCount} />}
      <button
        aria-label='Následující'
        onClick={() => setActivePage(activePage + 1)}
        className={'gov-pagination__item ' + (activePage === pagesCount ? ' gov-pagination__item--disabled' : '')}
      >
        <span className={'gov-icon gov-icon--arrow-right'}></span>
      </button>
    </div>
  )
}

export default Paginator
