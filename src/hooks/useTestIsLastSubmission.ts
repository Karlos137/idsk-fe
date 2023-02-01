import { toast } from 'react-toastify'
import EformsApi from '../api/EformsApi'
import { useFormContextBase } from '../context/FormContext'
import { iSubmissionData } from '../interfaces/ISubmissionData'

export const useTestIsLastSubmission = () => {
  const { submissionData, submissionDataBatch, isBatch } = useFormContextBase()
  const { id, submissionVersion } = isBatch ? submissionDataBatch : submissionData

  const testIsLastSubmission = () =>
    new Promise<boolean>((resolve) => {
      EformsApi.getSubmission(id)
        .then((data: iSubmissionData<any>) => {
          const lastSubmissionVersion = data.submissionVersion
          if (submissionVersion === lastSubmissionVersion) {
            resolve(true)
          } else {
            toast.error(
              isBatch
                ? 'Data ve dávce nejsou aktuální, pracujete z předchozí verzí dávky. Načtěte aktuální stav dávky a akci opakujte.'
                : 'Data ve smlouvě nejsou aktuální, pracujete z předchozí verzí smlouvy. Načtěte aktuální stav smlouvy a akci opakujte.',
            )
            resolve(false)
          }
        })
        .catch((err) => {
          toast.error(
            isBatch ? 'Nepodařilo se ověřit aktuální verzi dávky' : 'Nepodařilo se ověřit aktuální verzi smlouvy',
          )
          resolve(false)
        })
    })

  return { testIsLastSubmission }
}
