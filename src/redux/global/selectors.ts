import { RootState } from '../rootReducer'

export const selectModalOpen = (state: RootState) => state.global.modalOpen

export const selectContextMenuData = (state: RootState) => state.global.contextMenuData

export const selectPageLimit = (name: string) => (state: RootState) => state.global.pageLimits[name]

export const selectSort = (name: string) => (state: RootState) => state.global.sorts[name]

export const selectFilter = (name: string) => (state: RootState) => state.global.filters[name]

export const selectVariant = (name: string) => (state: RootState) => state.global.variants[name]
