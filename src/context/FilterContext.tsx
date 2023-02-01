import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { setFilters, setLimit, setPage, setSort, setVariant } from '../redux/global/globalSlice'
import { selectFilter, selectPageLimit, selectSort, selectVariant } from '../redux/global/selectors'
import { useAppDispatch } from '../redux/store'

export interface iFilter {
  [name: string]: any
}

const defState = {
  contextName: '',
  filters: {} as iFilter,
  activeFilters: {} as iFilter,
  sort: {} as { field: string; order: boolean },
  setFilter: (state: iFilter) => {},
  updateFilter: (state: Partial<iFilter>) => {},
  clearFilter: () => {},
  applyFilter: () => {},
  setSort: (name: string) => {},
  isEmpty: true,

  openFilter: false,
  setOpenFilter: (isOpen: boolean) => {},
  page: 1,
  limit: 10,
  variant: '',
  setVariant: (variant: string) => {},
  setPage: (page: number) => {},
  setLimit: (limit: number) => {},
}

export const FilterContext = React.createContext(defState)

export const useFilterContext = () => useContext(FilterContext)

export const useFilterContextInput = (inputName: string) => {
  const { filters, updateFilter } = useFilterContext()
  return {
    value: filters[inputName] || '',
    setValue: (value: any) => updateFilter({ [inputName]: value }),
  }
}

interface iFilterContextProvider {
  name: string
  children: React.ReactNode
}

export const FilterContextProvider = ({ name, children }: iFilterContextProvider) => {
  const sort = useSelector(selectSort(name))
  const activeFilters = useSelector(selectFilter(name))
  const { page, limit } = useSelector(selectPageLimit(name))
  const variant = useSelector(selectVariant(name))
  const [contextFilters, setContextFilters] = useState<iFilter>(activeFilters)

  const isEmpty = Object.keys(contextFilters).length === 0
  const [openFilter, setOpenFilter] = useState(!isEmpty)

  const dispatch = useAppDispatch()

  const providerValue = React.useMemo(
    () => ({
      contextName: name,
      filters: contextFilters,
      activeFilters: activeFilters,
      sort: sort,
      setFilter: setContextFilters,
      updateFilter: (values: any) => {
        setContextFilters((state) => ({ ...state, ...values }))
      },
      clearFilter: () => {
        console.log('CLEAR')
        setContextFilters({})
        dispatch(setFilters({ name: name, filters: {} }))
      },
      applyFilter: () => {
        dispatch(setFilters({ name: name, filters: contextFilters }))
      },
      setSort: (field: string) => {
        console.log('set sort', field, name)
        dispatch(setSort({ name: name, field: field }))
      },
      isEmpty, //TODO kdyz se vymaze retezec?,
      openFilter,
      setOpenFilter,
      page,
      limit,
      variant,
      setVariant: (variant: string) => {
        dispatch(setVariant({ name: name, variant: variant }))
      },
      setPage: (page: number) => {
        dispatch(setPage({ name: name, page: page }))
      },
      setLimit: (limit: number) => {
        dispatch(setLimit({ name: name, limit: limit }))
      },
    }),
    [name, contextFilters, isEmpty, activeFilters, sort, openFilter, variant, page, limit],
  )

  return <FilterContext.Provider value={providerValue}>{children}</FilterContext.Provider>
}
