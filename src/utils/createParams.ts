import { iFilterParam } from '../interfaces/typesEformsApi'
import { iFilter } from '../context/FilterContext'

const ASC = 'ASC'
const DESC = 'DESC'

export const createFilterParams = (filtersActive: iFilter) => {
  const filters: iFilterParam = {}

  for (const filterName in filtersActive) {
    const value = filtersActive[filterName]
    if (value !== '') {
      filters[filterName] = value
    }
  }
  return filters
}

export const createOrderParams = (sort: string, sortOrder: boolean) => {
  if (sort) {
    return { order: { [sort]: sortOrder ? ASC : DESC } }
  }

  return {}
}
