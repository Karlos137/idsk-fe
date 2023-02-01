import { RootState } from '../rootReducer'

export const selectOrganizationTypes = (state: RootState) => state.enums.organizationTypes.data
export const selectOrganizationTypesLoading = (state: RootState) => state.enums.organizationTypes.loading
export const selectOrganizationTypesError = (state: RootState) => state.enums.organizationTypes.error

export const selectUserRolesTypes = (state: RootState) => state.enums.userRolesTypes.data
export const selectUserRolesTypesLoading = (state: RootState) => state.enums.userRolesTypes.loading
export const selectUserRolesTypesError = (state: RootState) => state.enums.userRolesTypes.error

export const selectMainOrgsIdsk = (state: RootState) => state.enums.mainOrganization.idsk
export const selectMainOrgsRopid = (state: RootState) => state.enums.mainOrganization.ropid
export const selectMainOrgsLoading = (state: RootState) => state.enums.mainOrganization.loading
export const selectMainOrgsError = (state: RootState) => state.enums.mainOrganization.error
