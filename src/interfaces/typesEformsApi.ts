export interface Signature {
  signature: string
  certificate: string
}

export interface iDataJsonPatch {
  op: string
  path: string
  value?: string
}

// export interface iFilterParam {
//   publicId?: string | string[]
//   variableId?: string | string[]
//   workflowPlace?: string | string[]
//   parent?: string | string[]
//   data?: iFilterDataParam[] | string
//   id?: string | string[]
// }
//
// export interface iFilterDataParam {
//   key: string
//   value: string | { [operator: string]: string }
//   // value: string | boolean,
//   strategy?: string
// }

// export interface iFilterOrderParam {
//   variableId?: string
//   createdAt?: string
//   updatedAt?: string
//   workflowPlace?: string
//   data?: iFilterOrderDataParam[] | string
// }

export interface iFilterParam {
  publicId?: string | string[]
  variableId?: string | string[]
  workflowPlace?: string | string[]
  parent?: string | string[]
  id?: string | string[]

  [dataKey: string]: string | string[] | undefined | any
}

export interface iOrderParam {
  variableId?: string
  createdAt?: string
  updatedAt?: string
  workflowPlace?: string

  [dataKey: string]: string | undefined
}

export type iFilterOrderParam = iFilterParam & { order?: iOrderParam }

// export interface iFilterOrderDataParam {
//   key: string
//   direction: string
// }

// export interface iFilterGetParam extends iFilterParam {
//   order?: iFilterOrderParam
// }

export interface iFileData {
  id: string
  publicId: string
  submission: string
  subtype: string
  type: string
  contentUrl: string
  file: {
    extension: string
    hash: string
    mimeType: string
    mimeTypeExtension: string
    name: string
    safeName: string
    size: number
  }
  createdAt: string
  updatedAt: string
}
