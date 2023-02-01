import axios from 'axios'
import { interceptorRequestAuthToken } from './interceptorRequestAuthToken'
import { interceptorResponseAuthToken } from './interceptorResponseAuthToken'

const API_URL = process.env.REACT_APP_STCK_API_URL

export interface iGetDataToSignRequestBody {
  documentToSign: {
    name: string
    content: string
    mimeType: string
  }
  signingTime?: string
  signingTimeZone?: string // 'Europe/Prague',
  signatureLevel?: string //'PAdES_BASELINE_T',
  signaturePosition: {
    pageIndex: 0
    x: 0
    y: 0
    width: 0
    height: 0
    text: string
    image: string
  }
}

export interface iValidationStatus {
  id: string
  submissionId: string
  submissionVersionId: string
  submissionAttachmentId: string
  firstRequestCreatedAt: string //kdy vzniknul pozadavek na validaci
  nextProcessAt: string //kdy probehne dalsi obslouzeni validace
  processedAt: string
  signedAt: string
  signedBy: string
  resultIndicationCode: string //TOTAL_PASSED - zaseklo se  jinak INDETERMINATE
  resultSubindicationCode: string //TRY_LATER - kdyz jev predchozim INDETERMINATE  - ceka se az to projde
  createdAt: string
}

interface iDataToSignData {
  getDataToSignRequestBody: iGetDataToSignRequestBody
  dataToSign: string
}

interface iSignedData {
  submissionAttachmentId: string
}

interface iValidTemplateData {
  requiredTemplateVariables: string[]
  missingTemplateVariables: string[]
}

interface iProccessTemplateData {
  submissionAttachmentId: string
  submissionVersionId: string
  submissionId: string
}

interface iBulkExportData {
  batchId: string
  submissionAttachmentId: string
}

interface iBulkExportDataLine {
  subjectName?: string
  subjectIdentificationNumber?: string
  resolutionDate?: string
  resolutionNumber?: string
  contractNumber?: string
}

class StckApi {
  api = axios.create({
    baseURL: API_URL,
  })

  constructor() {
    interceptorRequestAuthToken(this.api)
    interceptorResponseAuthToken(this.api)
  }

  createDataToSign = (
    submissionVersionId: string,
    attachId: string,
    signingCertificate: string,
    signatureImage?: string,
  ): Promise<iDataToSignData> =>
    this.api
      .post(`/api/signature/create_data_to_sign`, {
        submissionVersionId: submissionVersionId,
        submissionAttachmentId: attachId,
        signingCertificate: signingCertificate,
        signatureImage: signatureImage,
      })
      .then((res) => res.data)

  insertSignedData = (getDataToSignRequestBody: iGetDataToSignRequestBody, signedData: string): Promise<iSignedData> =>
    this.api
      .post(`/api/signature/insert_signed_data`, {
        getDataToSignRequestBody: getDataToSignRequestBody,
        signedData: signedData,
      })
      .then((res) => res.data)

  getValidationStatus = (submissionVersionId: string): Promise<iValidationStatus> =>
    this.api.get(`/api/signature_validation_requests/last_processed/${submissionVersionId}`).then((res) => res.data)

  proccessDocxTemplate = (
    submissionVersionId: string,
    submissionAttachmentId: string,
  ): Promise<iProccessTemplateData> =>
    this.api
      .post(`/api/submission_attachments/process_docx_template`, {
        submissionAttachmentId: submissionAttachmentId,
        submissionVersionId: submissionVersionId,
      })
      .then((res) => res.data)

  validateDocxTemplate = (submissionVersionId: string, submissionAttachmentId: string): Promise<iValidTemplateData> =>
    this.api
      .post(`/api/submission_attachments/validate_docx_template`, {
        submissionAttachmentId: submissionAttachmentId,
        submissionVersionId: submissionVersionId,
      })
      .then((res) => res.data)

  bulkExport = (batchId: string, data: iBulkExportDataLine[]): Promise<iBulkExportData> =>
    this.api
      .post(`/api/submissions/bulk_export`, {
        batchId: batchId,
        submissions: data,
      })
      .then((res) => res.data)
}

export default new StckApi()
