import React from 'react'

interface iSortTableHeader {
  children: React.ReactNode
  order: string
  onClick: () => void
}

const SortTableHeader = ({ children, order, onClick }: iSortTableHeader) => {
  const activeUp = order === 'desc'
  const activeDown = order === 'asc'
  return (
    <span
      className={
        'gov-sortable-table__trigger ' +
        (activeUp ? ' gov-sortable-table__trigger--desc ' : '') +
        (activeDown ? ' gov-sortable-table__trigger--asc ' : '')
      }
      role='button'
      tabIndex={0}
      onClick={onClick}
    >
      {children}
    </span>
  )
}

export default SortTableHeader

