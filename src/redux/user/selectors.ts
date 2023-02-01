import { RootState } from '../rootReducer'

export const selectUserData = (state: RootState) => state.user.userData

export const selectUserInit = (state: RootState) => state.user.init
export const selectUserIsLoged = (state: RootState) => state.user.logedIn
export const selectUserLoading = (state: RootState) => state.user.loading

export const selectUserName = (state: RootState) => state.user.userData?.username
export const selectUserRolesDynamic = (state: RootState) => state.user.userData?.dynamicRoles
export const selectUserId = (state: RootState) => state.user.userData?.id
export const selectUserOrg = (state: RootState) => state.user.userData?.organization
