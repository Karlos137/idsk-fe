import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import EformsApi, { SLUG_FORM_SMLOUVA } from '../../api/EformsApi'
import StckApi from '../../api/StckApi'
import { useFormContextBase } from '../../context/FormContext'
import { useEffectStart } from '../../hooks/useEffectStart'
import { useModal } from '../../hooks/useModal'
import { useTestIsLastSubmission } from '../../hooks/useTestIsLastSubmission'
import { iSubmissionDataContract } from '../../interfaces/ISubmissionData'
import ButtonGov from '../Btns/ButtonGov'
import ErrorBlock from '../Error/Error'
import Loading from '../Loading/Loading'

const ModalGenerateList = () => {
  const { closeModal } = useModal()
  const { testIsLastSubmission } = useTestIsLastSubmission()

  const [isInit, setIsInit] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { submissionDataBatch, nextKeyIndex } = useFormContextBase()
  const { id, data } = submissionDataBatch
  const smlouvyIds = data.smlouvy || []
  const formId = id

  const [smlouvy, setSmlouvy] = useState([] as iSubmissionDataContract[])

  // const [resFile, setResFile] = useState({} as iFileData)
  const [resFileId, setResFileId] = useState('')
  const isGenerate = !!resFileId

  useEffectStart(() => {
    initGenerate()
  })

  const initGenerate = async () => {
    setLoading(true)
    setError('')
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    EformsApi.getSubmissionsSearch(SLUG_FORM_SMLOUVA, 1, 200, { id: smlouvyIds })
      .then((res) => {
        setSmlouvy(res.data)
        setIsInit(true)
      })
      .catch((err) => {
        setError('Chyba načtení smluv v dávce')
      })
      .finally(() => setLoading(false))
  }

  const clickGenerate = () => {
    setLoading(true)
    setError('')

    const exportData = smlouvy.map((smlouva) => ({
      subjectName: smlouva.data.subjektStranyB?.nazev || undefined,
      subjectIdentificationNumber: smlouva.data.subjektStranyB?.ic || undefined,
      resolutionDate: smlouva.data.schvaleni?.obec?.datumUsneseniObec || undefined,
      resolutionNumber: smlouva.data.schvaleni?.obec?.cisloUsneseniObec || undefined,
      contractNumber: smlouva.data.subjektStranyB?.cisloSmlouvyStranyB || undefined,
    }))

    StckApi.bulkExport(formId, exportData)
      .then((data) => {
        setResFileId(data.submissionAttachmentId)

        toast.success('Soupiska smluv byl úspěšně vygenerován')
      })
      .catch((err) => {
        toast.error('Chyba generování soupisky smluv')
        setError('Vygenerování soupisky smluv se nezdařilo')
      })
      .finally(() => setLoading(false))
  }

  const clickSave = async () => {
    setLoading(true)
    setError('')
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    EformsApi.updateFormAttach(formId, resFileId, resFileId)
      .then((res) => {
        closeModal()
        nextKeyIndex()
      })
      .catch((err) => {
        setError('Chyba uložení soupisky ke smlouvě.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return <Loading />
  }

  const ModalBody = () => {
    if (error) {
      return <ErrorBlock msg={error} />
    }
    if (isGenerate) {
      //TODO nacist cely soubor + odkaz na publicId
      return (
        <>
          Soupiska smluv vygenerována.
          {/*<br />*/}
          {/*<FileLink fileData={resFile} />*/}
        </>
      )
    }
    if (isInit) {
      return (
        <>
          Před použítím dávku uložte.
          <br />V dávce je uloženo {smlouvyIds.length} smluv.
        </>
      )
    }
    return null
  }

  const ModalBtn = () => {
    if (isGenerate) {
      return (
        <ButtonGov variant='primary' onClick={clickSave}>
          Uložit soupisku smluv
        </ButtonGov>
      )
    }

    if (isInit) {
      return (
        <ButtonGov variant='primary' onClick={clickGenerate}>
          Generovat soupisku smluv
        </ButtonGov>
      )
    } else {
      return (
        <ButtonGov variant='primary' onClick={initGenerate}>
          Zkusit znovu
        </ButtonGov>
      )
    }
  }

  return (
    <>
      <Modal.Body>
        <ModalBody />
      </Modal.Body>
      <Modal.Footer>
        <ModalBtn />
        <ButtonGov onClick={closeModal}>Zrušit</ButtonGov>
      </Modal.Footer>
    </>
  )
}

export default ModalGenerateList
