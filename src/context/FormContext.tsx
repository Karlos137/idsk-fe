import React, { useContext, useState } from 'react'
import { ATTACH_SUBTYPE } from '../forms/blocks/UploadBlock'
import { usePermissions } from '../hooks/usePermissions'
import { usePermissionsBatch } from '../hooks/usePermissionsBatch'
import { iSubmissionDataContract, iSubmissionDataContractBatch } from '../interfaces/ISubmissionData'
import { iFileData } from '../interfaces/typesEformsApi'

const defValue = {
  formDisabled: false,
  editMode: false,
  setEditMode: (editMode: boolean) => {},
  setFormFilesByPath: (path: string, files: iFileData[]) => {},
  formFiles: {} as { [path: string]: iFileData[] },
  _getFilesIds: () => [] as string[],
  fileMainContract: {} as iFileData,
  fileMainResolution: {} as iFileData,
  filesOther: [] as iFileData[],
  submissionData: {} as iSubmissionDataContract,
  setSubmissionData: (submissionData: iSubmissionDataContract) => {},
  submissionDataBatch: {} as iSubmissionDataContractBatch,
  setSubmissionDataBatch: (submissionDataBatch: iSubmissionDataContractBatch) => {},
  isHistoryDetail: false,
  nextKeyIndex: () => {},
  keyIndex: 0,
  submissionVersionId: '',
  isBatch: false,
}

const FormContextBase = React.createContext(defValue)

export const useFormContextBase = () => useContext(FormContextBase)

interface iFilterContexProvider {
  children: React.ReactNode
}

export const FormContexProvider = ({ children }: iFilterContexProvider) => {
  const [editMode, setEditMode] = useState(false)
  const [formFiles, setFormFiles] = useState<{ [path: string]: iFileData[] }>({})
  const [submissionData, setSubmissionData] = useState({} as iSubmissionDataContract)
  const [submissionDataBatch, setSubmissionDataBatch] = useState({} as iSubmissionDataContractBatch)
  const [keyIndex, setKeyIndex] = useState(0)
  // const [isEditMode, setIsEditMode] = useState(false)

  const isHistoryVersion = !!submissionData.id && !submissionData.submissionVersion
  const isBatch = !!submissionDataBatch?.id
  const submissionVersion = isBatch ? submissionDataBatch?.submissionVersion : submissionData?.submissionVersion

  const { canEditContractBatch } = usePermissionsBatch()
  const { canEditContract } = usePermissions()
  const canEdit = isBatch ? canEditContractBatch : canEditContract

  const providerValue = React.useMemo(
    () => ({
      formDisabled: !editMode || !canEdit,
      editMode: editMode,
      setEditMode: setEditMode,
      setFormFilesByPath: (path: string, files: iFileData[]) => {
        setFormFiles((formFiles) => ({ ...formFiles, [path]: files }))
      },
      formFiles: formFiles,
      _getFilesIds: () => {
        const files = Object.values(formFiles).flat()
        return files.map((file: iFileData) => file.id)
      },
      fileMainContract: formFiles[ATTACH_SUBTYPE.SMLOUVA]?.[0],
      fileMainResolution: formFiles[ATTACH_SUBTYPE.USNESENI]?.[0],
      filesOther: formFiles[ATTACH_SUBTYPE.PRILOHA],
      submissionData: submissionData,
      setSubmissionData: setSubmissionData,
      submissionDataBatch: submissionDataBatch,
      setSubmissionDataBatch: setSubmissionDataBatch,
      isHistoryDetail: isHistoryVersion,
      nextKeyIndex: () => setKeyIndex((k) => k + 1),
      keyIndex: keyIndex,
      isBatch: isBatch,
      submissionVersionId: isHistoryVersion ? submissionData.id : submissionVersion?.split('/')[3] || '',
    }),
    [formFiles, editMode, submissionData, submissionDataBatch, keyIndex],
  )

  return <FormContextBase.Provider value={providerValue}>{children}</FormContextBase.Provider>
}

export const withFormContextBase = (WrapedComp: any) => (props: any) =>
  (
    <FormContexProvider>
      <WrapedComp {...props} />
    </FormContexProvider>
  )
