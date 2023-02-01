import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  VARIANTS_TABLE_CONTRACTBATCHES_OPTIONS,
  VARIANTS_TABLE_CONTRACTS_OPTIONS,
  VARIANTS_TABLE_SUBJECTS_OPTIONS,
} from '../../enums/enumTablesVariants'
import { TABLE_TYPES } from '../../enums/enumTableTypes'

interface iGlobalState {
  modalOpen: string
  contextMenuData: any
  pageLimits: { [name: string]: { page: number; limit: number } }
  sorts: { [name: string]: { field: string; order: boolean } }
  filters: { [name: string]: { [name: string]: string } }
  variants: { [name: string]: string }
}

const createAllTableTypesAsDefault = (val: any) =>
  Object.values(TABLE_TYPES).reduce((prev, cur) => ({ ...prev, [cur]: val }), {})

const defTableVariants = {
  [TABLE_TYPES.contracts]: VARIANTS_TABLE_CONTRACTS_OPTIONS[0].value,
  [TABLE_TYPES.contractBatches]: VARIANTS_TABLE_CONTRACTBATCHES_OPTIONS[0].value,
  [TABLE_TYPES.subjects]: VARIANTS_TABLE_SUBJECTS_OPTIONS[0].value,
}

const defTableSorts = {
  [TABLE_TYPES.contracts]: { field: 'createdAt', order: false },
  [TABLE_TYPES.contractBatches]: { field: 'createdAt', order: false },
  [TABLE_TYPES.subjects]: { field: 'name', order: true },
  [TABLE_TYPES.dso]: { field: 'name', order: true },
  [TABLE_TYPES.users]: { field: 'username', order: true },
}

const defTablePageLimits = {
  [TABLE_TYPES.contracts]: { page: 1, limit: 25 },
  [TABLE_TYPES.contractBatches]: { page: 1, limit: 10 },
  [TABLE_TYPES.subjects]: { page: 1, limit: 50 },
  [TABLE_TYPES.users]: { page: 1, limit: 10 },
  [TABLE_TYPES.dso]: { page: 1, limit: 10 },
  [TABLE_TYPES.contractHistory]: { page: 1, limit: 10 },
}

const slice = createSlice({
  name: 'global',
  initialState: {
    modalOpen: '',
    contextMenuData: {},
    pageLimits: defTablePageLimits,
    sorts: defTableSorts,
    filters: createAllTableTypesAsDefault({}),
    variants: defTableVariants,
  } as iGlobalState,
  reducers: {
    setModalOpen(state, action: PayloadAction<string>) {
      state.modalOpen = action.payload
    },
    setModalClose(state) {
      state.modalOpen = ''
    },
    setContextMenuData(state, action: PayloadAction<any>) {
      state.contextMenuData = action.payload
    },
    clearContextMenuData(state) {
      state.contextMenuData = {}
    },
    setPage(state, action: PayloadAction<{ name: string; page: number }>) {
      const { page, name } = action.payload
      state.pageLimits[name].page = page
    },
    setLimit(state, action: PayloadAction<{ name: string; limit: number }>) {
      const { limit, name } = action.payload
      state.pageLimits[name].limit = limit
      state.pageLimits[name].page = 1
    },
    setFilters(state, action: PayloadAction<{ name: string; filters: any }>) {
      const { name, filters } = action.payload
      state.filters[name] = filters
      state.pageLimits[name].page = 1
    },
    setSort(state, action: PayloadAction<{ name: string; field: string }>) {
      const { field, name } = action.payload
      if (state.sorts[name].field === field) {
        state.sorts[name].order = !state.sorts[name].order
      } else {
        state.sorts[name].field = field
      }
    },
    setVariant(state, action: PayloadAction<{ name: string; variant: string }>) {
      const { variant, name } = action.payload
      state.variants[name] = variant
      state.pageLimits[name].page = 1
    },
  },
})

export const {
  setModalOpen,
  setModalClose,
  setContextMenuData,
  clearContextMenuData,
  setPage,
  setLimit,
  setSort,
  setFilters,
  setVariant,
} = slice.actions
export default slice.reducer
