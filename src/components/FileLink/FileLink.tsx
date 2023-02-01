import React from 'react'
import EformsApi from '../../api/EformsApi'
import { iFileData } from '../../interfaces/typesEformsApi'
import { humanFileSize } from '../../utils/humanFileSize'

interface iFileLink {
  fileData: iFileData
}

const FileLink = ({ fileData }: iFileLink) => {
  const FILE_BASE_URL = EformsApi.getFileBaseUrl()

  return (
    <>
      <a href={`${FILE_BASE_URL}${fileData.publicId}`} target='_blank' rel='noopener noreferrer'>
        {fileData.file.name}.{fileData.file.extension}
      </a>
      {fileData.file.size && ` (${humanFileSize(fileData.file.size)})`}
    </>
  )
}

export default FileLink
