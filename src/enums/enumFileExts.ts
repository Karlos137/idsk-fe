export const FILE_EXTENSION = {
  PDF: 'pdf',
  // DOC: 'doc',
  DOCX: 'docx',
  // XLS: 'xls',
  XLSX: 'xlsx',
}

export const FILE_MIME_TYPE = {
  [FILE_EXTENSION.PDF]: 'application/pdf',
  // [FILE_EXTENSION.DOC]: 'application/msword',
  [FILE_EXTENSION.DOCX]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // [FILE_EXTENSION.XLS]: 'application/vnd.ms-excel',
  [FILE_EXTENSION.XLSX]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}
