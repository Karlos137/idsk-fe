import { useFormContextBase } from '../context/FormContext'
import { WORKFLOW_PLACES_BATCH as WPB } from '../enums/enumWorkflowPlaces'
import { useUserAuth } from './useUserAuth'

export const usePermissionsBatch = () => {
  const { isReferent } = useUserAuth()
  const { submissionDataBatch } = useFormContextBase()
  const placeBatch = submissionDataBatch.workflowPlaceCode

  return {
    canReadContractBatch: isReferent,
    canEditContractBatch: isReferent && [WPB.PRIPRAVA, WPB.ODESLANO, undefined].includes(placeBatch),
    canEditContractBatchContract: isReferent && [WPB.PRIPRAVA, undefined].includes(placeBatch),
    canEditContractBatchContractState: isReferent && [WPB.ODESLANO].includes(placeBatch),
    canEditAttachOtherBatch: isReferent && [WPB.PRIPRAVA, WPB.ODESLANO, undefined].includes(placeBatch),
    canEditAttachUsneseniBatch: isReferent && [WPB.PRIPRAVA, WPB.ODESLANO, undefined].includes(placeBatch),
    canGenerateList: isReferent && [WPB.ODESLANO].includes(placeBatch),
    canDeleteContractBatch: isReferent && [WPB.PRIPRAVA, undefined].includes(placeBatch),
  }
}
