import React from 'react'
import { useFilterContext } from '../../context/FilterContext'

interface iSortTableHeader {
  children: React.ReactNode
  name: string
}

const SortTableHeader = ({ children, name }: iSortTableHeader) => {
  const { sort, setSort } = useFilterContext()

  const { field, order } = sort

  const changeSort = () => {
    setSort(name)
  }

  const activeUp = name === field && order
  const activeDown = name === field && !order
  return (
    <span
      className={
        'gov-sortable-table__trigger ' +
        (activeUp ? ' gov-sortable-table__trigger--desc ' : '') +
        (activeDown ? ' gov-sortable-table__trigger--asc ' : '')
      }
      role='button'
      tabIndex={0}
      onClick={changeSort}
    >
      {children}
    </span>
  )
}

export default SortTableHeader
