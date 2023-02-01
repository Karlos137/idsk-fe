import { iSchemaContract } from '../forms/FormContract/SchemeContract'
import { iSchemaContractBatch } from '../forms/FormContractBatch/SchemeContractBatch'

interface iByUser {
  email: string
  id: string
  name: string
}

export interface iSubmissionData<T> {
  data: T
  formSchema: string
  id: string
  organizationData: any
  // owner: {
  //   id: string
  //   name: string
  // }
  publicId: string
  state: string
  submissionVersion?: string
  submission?: string
  variableId: string
  workflowPlaceCode: string
  createdAt: string
  updatedAt: string
  createdBy: iByUser
  updatedBy?: iByUser
}

export type iSubmissionDataContract = iSubmissionData<iSchemaContract>
export type iSubmissionDataContractBatch = iSubmissionData<iSchemaContractBatch>
