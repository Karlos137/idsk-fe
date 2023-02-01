import React, { useState } from 'react'
import StckApi, { iValidationStatus } from '../../api/StckApi'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase } from '../../context/FormContext'
import { WORKFLOW_PLACES } from '../../enums/enumWorkflowPlaces'
import { useEffectStart } from '../../hooks/useEffectStart'
import { dateFormatFull } from '../../utils/dateFormat'

const WORKFLOW_VALID_PLACE = [
  WORKFLOW_PLACES.K_VALIDACI_PODPISU_A,
  WORKFLOW_PLACES.K_VALIDACI_PODPISU_B,
  WORKFLOW_PLACES.K_VALIDACI_PODPISU_ROPID,
]

const WorkflowValidMsgBlock = () => {
  const { submissionData, submissionVersionId } = useFormContextBase()
  const { workflowPlaceCode } = submissionData

  const isValidation = WORKFLOW_VALID_PLACE.includes(workflowPlaceCode)

  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<iValidationStatus>()

  const NextProccess = () => {
    if (!data?.nextProcessAt) {
      return null
    }
    return <>Další pokus o validaci bude proveden: {dateFormatFull(data?.nextProcessAt)}</>
  }

  useEffectStart(() => {
    if (isValidation && submissionVersionId) {
      setLoading(true)
      StckApi.getValidationStatus(submissionVersionId)
        .then((data) => {
          setData(data)
        })
        .catch((error) => {
          if (error.response.stateCode === 404) {
            setNotFound(true)
          }
          setError(error.toString())
        })
        .finally(() => {
          setLoading(false)
        })
    }
  })

  if (!isValidation) {
    return null
  }
  if (loading) {
    return <Loading />
  }
  if (notFound || !data) {
    return <div>Žádost o validaci zatím nebyla obsloužena</div>
  }
  if (error) {
    return <Error msg='Chyba získání stavu validace' />
  }

  if (data.resultIndicationCode === 'TOTAL_PASSED') {
    return <div>Validace podpisu proběhla úspěšně. Čekejte na posun stavu smlouvy.</div>
  }
  if (data.resultIndicationCode === 'TOTAL-FAILED') {
    return <Error msg={'Chyba validace podpisu: ' + data.resultSubindicationCode} />
  }
  if (data.resultIndicationCode === 'INDETERMINATE') {
    if (data.resultSubindicationCode === 'TRY_LATER') {
      return (
        <div>
          Čeká na čerstvá revokační data certifikační autority k validaci podpisu osoby {data?.signedBy}.
          <br />
          <NextProccess />
        </div>
      )
    } else {
      return (
        <div>
          Čeká se na validaci.
          <br />
          <NextProccess />
        </div>
      )
    }
  }
  return null
}

export default WorkflowValidMsgBlock
