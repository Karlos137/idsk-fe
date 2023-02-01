import React from 'react'
import ButtonGov from '../../components/Btns/ButtonGov'
import { useFormContextBase } from '../../context/FormContext'
import { CONTRACT_TYPES } from '../../enums/enumContractTypes'
import { FILE_EXTENSION } from '../../enums/enumFileExts'
import { WORKFLOW_PLACES as WP } from '../../enums/enumWorkflowPlaces'
import { useModal } from '../../hooks/useModal'
import { usePermissions } from '../../hooks/usePermissions'

const ActionConvertBlock = () => {
  const { fileMainContract, submissionData, editMode } = useFormContextBase()
  const place = submissionData.workflowPlaceCode
  const contractType = submissionData.data?.typ

  const { openModalConvert } = useModal()
  const { canConvertToPdf } = usePermissions()
  const isPdf = !!fileMainContract && [FILE_EXTENSION.PDF].indexOf(fileMainContract.file.extension) !== -1
  const isDocx = !!fileMainContract && [FILE_EXTENSION.DOCX].indexOf(fileMainContract.file.extension) !== -1

  if (!fileMainContract || !canConvertToPdf || isPdf || editMode) {
    return null
  }

  if (
    [WP.KONCEPT, WP.K_PREPRACOVANI].includes(place) &&
    contractType &&
    ![CONTRACT_TYPES.P02, CONTRACT_TYPES.P04, CONTRACT_TYPES.P06].includes(contractType)
  ) {
    return null
  }

  if (!isDocx) {
    return <div>Konverze do PDF podporuje pouze soubory formátu DOC a DOCX</div>
  }

  return (
    <>
      <ButtonGov variant='primary' onClick={openModalConvert}>
        Konvertovat do PDF
      </ButtonGov>
    </>
  )
}

export default ActionConvertBlock
