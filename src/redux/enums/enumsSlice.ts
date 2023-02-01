import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { iOrgData } from '../../interfaces/IOrgData'
import { iOrgTypesData } from '../../interfaces/iOrgTypesData'
import { iUserRolesTypesData } from '../../interfaces/iUserRolesTypesData'

const slice = createSlice({
  name: 'enums',
  initialState: {
    organizationTypes: {
      data: [] as iOrgTypesData[],
      loading: true,
      error: '',
    },
    userRolesTypes: {
      data: [] as iUserRolesTypesData[],
      loading: true,
      error: '',
    },
    mainOrganization: {
      idsk: {} as iOrgData,
      ropid: {} as iOrgData,
      loading: true,
      error: '',
    },
  },
  reducers: {
    setOrganizationTypes(state, action: PayloadAction<iOrgTypesData[]>) {
      state.organizationTypes.data = action.payload
    },
    setOrganizationTypesLoading(state, action: PayloadAction<boolean>) {
      state.organizationTypes.loading = action.payload
    },
    setOrganizationTypesError(state, action: PayloadAction<string>) {
      state.organizationTypes.error = action.payload
    },
    setUserRolesTypes(state, action: PayloadAction<iUserRolesTypesData[]>) {
      state.userRolesTypes.data = action.payload
    },
    setUserRolesTypesLoading(state, action: PayloadAction<boolean>) {
      state.userRolesTypes.loading = action.payload
    },
    setUserRolesTypesError(state, action: PayloadAction<string>) {
      state.userRolesTypes.error = action.payload
    },
    setMainOrgs(state, action: PayloadAction<{ idsk: iOrgData; ropid: iOrgData }>) {
      const { idsk, ropid } = action.payload
      state.mainOrganization.idsk = idsk
      state.mainOrganization.ropid = ropid
    },
    setMainOrgsLoading(state, action: PayloadAction<boolean>) {
      state.mainOrganization.loading = action.payload
    },
    setMainOrgsError(state, action: PayloadAction<string>) {
      state.mainOrganization.error = action.payload
    },
  },
})

export const {
  setOrganizationTypes,
  setOrganizationTypesLoading,
  setOrganizationTypesError,
  setUserRolesTypes,
  setUserRolesTypesLoading,
  setUserRolesTypesError,
  setMainOrgs,
  setMainOrgsLoading,
  setMainOrgsError,
} = slice.actions
export default slice.reducer
