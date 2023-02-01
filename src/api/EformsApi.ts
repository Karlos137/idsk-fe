import axios from 'axios'
import qs from 'qs'
import { iDataJsonPatch, iFileData, iFilterOrderParam, iFilterParam } from '../interfaces/typesEformsApi'
import { interceptorRequestAuthToken } from './interceptorRequestAuthToken'
import { interceptorResponseAuthToken } from './interceptorResponseAuthToken'

export const API_EFORMS_URL = process.env.REACT_APP_EFORMS_API_URL

//TODO test na existenci konstatn - jestli jsou promenne v env nastaveny ?
export const SLUG_FORM_SMLOUVA = process.env.REACT_APP_EFORMS_SLUG_FORM_SMLOUVA!
export const SLUG_FORM_DAVKA = process.env.REACT_APP_EFORMS_SLUG_FORM_DAVKA!

// #TODO nastavit natvrdo id specailani org -> nemusi se nacitat typ organizace
export const ORG_IDSK = process.env.REACT_APP_EFORMS_ORG_IDSK!
export const ORG_ROPID = process.env.REACT_APP_EFORMS_ORG_ROPID!

const ADMIN_TOKEN = process.env.REACT_APP_EFORMS_ADMIN_TOKEN!

const HEADER_JSON_MERGE = { 'Content-Type': 'application/merge-patch+json' }

class EformsApi {
  api = axios.create({
    baseURL: API_EFORMS_URL,
    // paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
    paramsSerializer: (params) => qs.stringify(params, {}),
  })

  setAdminAcl = () => {
    this.api.defaults.headers.common['X-Auth-Token'] = ADMIN_TOKEN
  }

  clearAdminAcl = () => {
    delete this.api.defaults.headers.common['X-Auth-Token']
  }

  getBaseUrl = () => {
    return this.api.defaults.baseURL
  }

  getFileBaseUrl = () => {
    return this.getBaseUrl() + 'download/submission_attachments/public/'
  }

  constructor() {
    interceptorRequestAuthToken(this.api)
    interceptorResponseAuthToken(this.api)
  }

  /*   informace o formulari    */
  getFormBySlug = (orgSlug: string, formSlug: string) =>
    this.api.get(`/api/organizations/slug/${orgSlug}/forms/slug/${formSlug}`).then((res) => res.data)

  getSubmission = (id: string) => this.api.get(`/api/submissions/${id}`).then((res) => res.data)

  getSubmissionsSearch = (formSlug: string, page?: number, limit?: number, params?: iFilterOrderParam) =>
    this.api
      .get(`/api/submissions/search`, {
        params: {
          page: page,
          limit: limit,
          form: formSlug,
          ...params,
        },
      })
      .then((res) => ({
        data: res.data,
        totalCount: parseInt(res.headers['x-total-count']),
      }))

  newForm = (
    formSlug: string,
    orgSlug: string,
    data?: any,
    attachments: string[] = [],
    organizations?: string[],
    lang: string = 'cs',
  ) =>
    this.api
      .post(
        `/api/submissions`,
        {
          form: formSlug,
          organization: orgSlug,
          data: data,
          attachments: attachments,
          organizations: organizations,
        },
        { headers: { 'Accept-Language': lang } },
      )
      .then((res) => res.data)

  submitForm = (
    schemaIri: string,
    orgSlug: string,
    data: any,
    attachments: string[] = [],
    // state?: string,
    // signature?: Signature,
    organizations?: string[],
    lang: string = 'cs',
  ) =>
    this.api
      .post(
        `/api/submissions`,
        {
          formSchema: schemaIri,
          organization: orgSlug,
          data: data,
          attachments: attachments,
          // signature,
          // state
          organizations: organizations,
        },
        { headers: { 'Accept-Language': lang } },
      )
      .then((res) => res.data)

  updateForm = (
    id: string,
    data: any,
    attachments: string[] = [],
    // state?: string,
    // signature?: Signature
    organizations?: string[],
  ) =>
    this.api
      .patch(
        `/api/submissions/${id}`,
        {
          data: data,
          attachments: attachments,
          organizations: organizations,
        },
        { headers: HEADER_JSON_MERGE },
      )
      .then((res) => res.data)

  updateFormWorkflow = (
    id: string,
    workflowCode?: string,
    dataJsonPatch?: iDataJsonPatch[],
    attachmentsJsonPatch?: iDataJsonPatch[],
  ) =>
    this.api
      .patch(
        `/api/submissions/${id}`,
        {
          workflowPlaceCode: workflowCode,
          dataJsonPatch: dataJsonPatch,
          attachmentsJsonPatch: attachmentsJsonPatch,
        },
        { headers: HEADER_JSON_MERGE },
      )
      .then((res) => res.data)

  updateFormAttach = (id: string, oldFileId: string, newFileId: string, workflowCode?: string, pocetPodpisu?: number) =>
    this.api
      .patch(
        `/api/submissions/${id}`,
        {
          attachmentsJsonPatch: [{ op: 'add', path: '/' + oldFileId, value: newFileId }],
          workflowPlaceCode: workflowCode,
          dataJsonPatch: pocetPodpisu ? [{ op: 'add', path: '/pomocnaPocetPodpisu', value: pocetPodpisu }] : undefined,
        },
        { headers: HEADER_JSON_MERGE },
      )
      .then((res) => res.data)

  // updateFormParent = (id: string, parent: string) =>
  //   this.api.patch(`/api/submissions/${id}`, {
  //     parent: parent
  //   }, { headers: HEADER_JSON_MERGE })
  //     .then(res => res.data)

  deleteForm = (id: string) => {
    return this.api.delete(`/api/submissions/${id}`).then((res) => res.data)
  }

  /*   Organizace info  + setAdminAcl */
  // getOrganizations = () =>
  //   this.api.get(`/api/organizations`)
  //     .then(res => res.data)

  // getOrganizationBySlug = (orgSlug: string) =>
  //   this.api.get(`/api/organizations/slug/${orgSlug}`)
  //     .then(res => res.data)
  //
  // /*    formulare v organizaci */
  // getOrganizationForms = (orgId: string) =>
  //   this.api.get(`/api/organizations/${orgId}/forms`)
  //     .then(res => res.data)

  // getOrganizationFormsBySlug = (orgSlug: string, page?: number) =>
  //   this.api.get(`/api/organizations/slug/${orgSlug}/forms`, { params: { page: page } })
  //     .then(res => res.data)

  /*   schema formulare    */
  // getFormSchemaFullUrl = (schemaUrl: string) =>
  //   this.api.get(`${schemaUrl}`)
  //     .then(res => res.data)
  //
  // getFormSchemaById = (formSchemaId: string) =>
  //   this.api.get(`/api/form_schemas/${formSchemaId}`)
  //     .then(res => res.data)

  // setFormSchemaById = (formSchemaId: string, schema: any) =>
  //   this.api.put(`/api/form_schemas/${formSchemaId}`, {
  //     schema: schema,
  //     note: 'edit by react-eforms-lib'
  //   })

  getSubmissionAcl = (id: string) => this.api.get(`/api/submissions/${id}/acl`).then((res) => res.data)

  getEnum = (formSchemaId: string, enumId: string) =>
    this.api
      .get(`/api/enumerations/values/form_schemas/${formSchemaId}/enumeration_groups/${enumId}`)
      .then((res) => res.data)

  /*
  Attachments
   */
  getAttachments = (submissionId: string): Promise<iFileData[]> =>
    this.api
      .get(`/api/submission_attachments`, {
        params: {
          limit: 50,
          submissionVersion: submissionId,
        },
      })
      .then((res) => res.data)

  getAttachment = (id: string): Promise<iFileData> =>
    this.api.get(`/api/submission_attachments/${id}`).then((res) => res.data)

  getAttachmentPublic = (publicId: string): Promise<iFileData> =>
    this.api.get(`/api/submission_attachments/public/${publicId}`).then((res) => res.data)

  getAttachmentContentPublic = (publicId: string) =>
    this.api
      .get(`/download/submission_attachments/public/${publicId}`, { responseType: 'blob' })
      .then((res) => res.data)

  uploadFile = (
    file: File,
    type: string,
    subtype: string,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<iFileData> => {
    var formData = new FormData()
    formData.append('file', file, file.name)
    if (type) {
      formData.append('type', type)
    }
    if (subtype) {
      formData.append('subtype', subtype)
    }
    return this.api
      .post(`/api/submission_attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      })
      .then((res) => res.data)
  }

  downloadFiles = (submissionVersion: string, filesId: string[], archiveFilename = 'archiv_priloh.zip') =>
    this.api
      .post(
        '/download/submission_attachments',
        {
          archiveFilename: archiveFilename,
          items: filesId,
        },
        {
          // headers:{
          //   Accept: 'application/zip'
          // },
          params: {
            submissionVersion: submissionVersion,
          },
          responseType: 'blob',
        },
      )
      .then((res) => res.data)

  //
  // importRequest = (schemaUrl: string, orgId: string) => {
  //   return this.api.post('/api/submission_import_requests', {
  //     formSchema: schemaUrl,
  //     organization: `/api/organizations/${orgId}`
  //   }).then(res => res.data)
  // }
  //
  //
  // exportRequest = (orgFormId: string, filter: iFilterParam, filterOrder: iFilterOrderParam) => {
  //   return this.api.post('/api/submission_export_requests', {
  //     organizationForm: `/api/organization_forms/${orgFormId}`,
  //     filter: filter,
  //     filterOrder: filterOrder
  //   }).then(res => res.data)
  // }
  //

  getVersions = (id: string, page = 1, limit = 10) =>
    this.api
      .get(`/api/submission_versions`, {
        params: {
          limit: limit,
          page: page,
          submission: id,
          order: { createdAt: 'asc' },
        },
      })
      .then((res) => ({
        data: res.data,
        totalCount: parseInt(res.headers['x-total-count']),
      }))

  getVersionLast = (id: string, workflowPlace?: string[]) =>
    this.api
      .get(`/api/submission_versions`, {
        params: {
          limit: 1,
          page: 1,
          submission: id,
          order: { createdAt: 'desc' },
          workflowPlace: workflowPlace,
        },
      })
      .then((res) => res.data)

  getVersionDetail = (versionId: string) =>
    this.api.get(`/api/submission_versions/${versionId}`).then((res) => res.data)

  //
  // sendOrgNotifyMail = (orgFormId: string, message: string, scopes?: string[], recivers?: string[], subject?: string) =>
  //   this.api.post('/api/send_organization_notify_mail', {
  //     organizationForm: orgFormId,
  //     scopes: scopes,
  //     receivers: recivers,
  //     subject: subject ? subject : null,
  //     message: message
  //
  //   }).then(res => res.data)
  //
  //
  addSubmissionComment = (id: string, message: string) =>
    this.api
      .post('/api/submission_comments', {
        submission: id,
        message: message,
      })
      .then((res) => res.data)

  getSubmissionComments = (id: string) =>
    this.api
      .get(`/api/submission_comments`, {
        params: {
          submission: id,
          limit: 50,
          order: { createdAt: 'asc' },
        },
      })
      .then((res) => res.data)

  /*
 Bulk
  */

  bulkEdit = (formId: string, filter: iFilterParam, dataJsonPatch?: iDataJsonPatch[], worflowPlace?: string) =>
    this.api
      .post('/api/submissions/bulk_patch', {
        workflowPlaceCode: worflowPlace,
        // workflowTransitionCode: "string",
        dataJsonPatch: dataJsonPatch,
        filter: {
          form: formId, // "IRI/UUID/slug",
          ...filter,
        },
      })
      .then((res) => res.data)
  //
  // bulkDelete = (orgFromId: string, filter: iFilterParam) =>
  //   this.api.post("/api/submissions/bulk_delete", {
  //     organizationForm: `/api/organization_forms/${orgFromId}`,
  //     filter: filter
  //   }).then(res => res.data);
  //
  //
  // bulkGetAttr = (orgFromId: string, filter: iFilterParam, attr: string) =>
  //   this.api.post("/api/submissions/bulk_get_data", {
  //     organizationForm: `/api/organization_forms/${orgFromId}`,
  //     filter: filter,
  //     dataReference: attr
  //   }).then(res => res.data);
  //
  // addSubmissionShare = (id: string, scope: string) =>
  //   this.api.post("/api/submission_shared_scopes", {
  //     submission: `/api/submissions/${id}`,
  //     scope: scope
  //     // scope: "/SDILENY/13245678/"
  //   }).then(res => res.data);
  //
  // deleteSubmissionShare = (id: string) =>
  //   this.api.delete(`/api/submission_shared_scopes/${id}`)
  //     .then(res => res.data);
  //
  // calculateSimilar = () =>
  //   this.api.post(`/api/scheduler_commands/68ffe256-bc10-489c-a5f0-8bd937e6df14/execute`)
  //     .then(res => res.data);
}

export default new EformsApi()
