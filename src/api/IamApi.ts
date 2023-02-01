import axios from 'axios'
import { interceptorRequestAuthToken } from './interceptorRequestAuthToken'
import { interceptorResponseAuthToken } from './interceptorResponseAuthToken'

const API_URL = process.env.REACT_APP_IAM_API_URL

export const REACT_APP_IAM_ISSUER_ID = process.env.REACT_APP_IAM_ISSUER_ID!

class IamApi {
  api = axios.create({
    baseURL: API_URL,
  })

  constructor() {
    interceptorRequestAuthToken(this.api)
    interceptorResponseAuthToken(this.api)
  }

  getLogedUserDetail = () => this.api.get(`/users/me`).then((res) => res.data)

  /*
  Organization Types
   */
  getOrgTypes = () => this.api.get(`/organization_types`).then((res) => res.data)

  addOrgType = (value: string, label: string) =>
    this.api
      .post(`/organization_types`, {
        name: label,
        identifier: value,
        // description: label
      })
      .then((res) => res.data)

  deleteOrgType = (id: string) => this.api.delete(`/organization_types/${id}`).then((res) => res.data)

  /*
  Organization
   */
  getOrgs = (page?: number, limit?: number, organizationTypeIds?: string[], params?: any) =>
    this.api
      .get(`/organizations`, {
        params: {
          page: page,
          itemsPerPage: limit,
          organizationType: organizationTypeIds,
          ...params,
        },
      })
      .then((res) => ({
        data: res.data,
        totalCount: parseInt(res.headers['x-total-count']),
      }))

  searchOrgs = (query?: string, organizationTypeIds?: string[]) =>
    this.api
      .get(`/organizations`, {
        params: {
          // page: page,
          // itemsPerPage: limit,
          organizationType: organizationTypeIds,
          name: query,
        },
      })
      .then((res) => res.data)

  getOrg = (id: string) => this.api.get(`/organizations/${id}`).then((res) => res.data)

  addOrg = (orgData: any) =>
    this.api
      .post(
        `/organizations`,
        orgData,
        //   {
        //   organizationType: "string",
        //   name: "string",
        //   slug: "string",
        //   description: "string",
        //   identifications: [
        //     "string"
        //   ],
        //   addresses: [
        //     "string"
        //   ],
        //   contacts: [
        //     "string"
        //   ],
        //   attributes: [
        //     "string"
        //   ]
        // }
      )
      .then((res) => res.data)

  editOrg = (id: string, orgData: any) => this.api.put(`/organizations/${id}`, orgData).then((res) => res.data)

  deleteOrg = (id: string) => this.api.delete(`/organizations/${id}`).then((res) => res.data)

  /*
  OrganizationOrganization
 */

  getOrgOrg = (parentOrganization: string) =>
    this.api
      .get(`/organization_organizations`, {
        params: {
          parentOrganization: '/organizations/' + parentOrganization,
        },
      })
      .then((res) => res.data)

  addOrgOrg = (parentOrganization: string, childOrganization: string) =>
    this.api
      .post(`/organization_organizations`, {
        parentOrganization: '/organizations/' + parentOrganization,
        childOrganization: '/organizations/' + childOrganization,
      })
      .then((res) => res.data)

  deleteOrgOrg = (id: string) => this.api.delete(`/organization_organizations/${id}`).then((res) => res.data)

  /*
 Role
 */
  getRoles = () => this.api.get(`/roles`).then((res) => res.data)

  addRole = (value: string, label: string, level: number = 0) =>
    this.api
      .post(`/roles`, {
        name: label,
        identifier: value,
        // description: label
        level: level,
      })
      .then((res) => res.data)

  deleteRole = (id: string) => this.api.delete(`/roles/${id}`).then((res) => res.data)

  /*
User Role
*/
  getUserRoles = (userId: string) =>
    this.api
      .get(`/user_roles`, {
        params: {
          owner: `${userId}`,
        },
      })
      .then((res) => res.data)

  addUserRole = (userId: string, roleId: string) =>
    this.api
      .post(`/user_roles`, {
        role: `/roles/${roleId}`,
        owner: `/users/${userId}`,
      })
      .then((res) => res.data)

  deleteUserRole = (id: string) => this.api.delete(`/user_roles/${id}`).then((res) => res.data)

  /*
  User
   */

  getUsers = (page: number, limit: number, params?: any) =>
    this.api
      .get(`/users`, {
        params: {
          page: page,
          itemsPerPage: limit,
          ...params,
        },
      })
      .then((res) => ({
        data: res.data,
        totalCount: parseInt(res.headers['x-total-count']),
      }))

  searchUsers = (params?: any) =>
    this.api
      .get(`/users`, {
        params: {
          ...params,
        },
      })
      .then((res) => res.data)

  getUser = (id: string) => this.api.get(`/users/${id}`).then((res) => res.data)

  addUser = (user: any) => this.api.post(`/users`, user).then((res) => res.data)

  editUser = (id: string, user: any) => this.api.put(`/users/${id}`, user).then((res) => res.data)

  deleteUser = (id: string) => this.api.put(`/users/${id}`).then((res) => res.data)

  /*
  User Password
   */
  userChangePassword = (oldPassword: string, newPassword: string) =>
    this.api
      .post(`/users/change_password`, {
        password: oldPassword,
        newPassword: newPassword,
      })
      .then((res) => res.data)

  // userForgotPassword = (id: string) =>
  //   this.api.post(`/users/${id}/forgotten_password`, {}, { headers: { 'content-type': 'application/json' } })
  //     .then(res => res.data)

  userForgotPasswordByUsername = (username: string) =>
    this.api
      .post(`/users/forgotten_password`, {
        issuer: `/iam_issuer_configurations/${REACT_APP_IAM_ISSUER_ID}`,
        username: username,
      })
      .then((res) => res.data)

  userNewPassword = (token: string, newPassword: string) =>
    this.api
      .post(`/users/${token}/new_password`, {
        newPassword: newPassword,
      })
      .then((res) => res.data)

  /*
  Ares
   */

  // proxy na https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi
  ares = (ico: string) =>
    this.api
      .get('/ares', {
        params: {
          ico: ico,
        },
        headers: { Accept: 'text/xml' },
      })
      .then((res) => res.data)

  /*
  Avatar
   */

  uploadAvatar = (file: File) => {
    var formData = new FormData()
    formData.append('file', file, file.name)
    return this.api
      .post('/user_sign_avatars', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data)
  }

  getAvatarMine = () => this.api.get('/user_sign_avatars/mine').then((res) => res.data)

  getAvatarContent = (id: string) =>
    this.api.get(`/user_sign_avatars/download/${id}`, { responseType: 'blob' }).then((res) => res.data)

  deleteAvatar = (id: string) => this.api.delete(`/user_sign_avatars/${id}`)
}

export default new IamApi()
