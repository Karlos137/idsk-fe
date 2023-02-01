import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import LibreOfficekApi from '../../api/LibreOfficekApi'
import { useFormContextBase } from '../../context/FormContext'
import { ATTACH_SUBTYPE } from '../../forms/blocks/UploadBlock'
import { useEffectStart } from '../../hooks/useEffectStart'
import { useModal } from '../../hooks/useModal'
import { useTestIsLastSubmission } from '../../hooks/useTestIsLastSubmission'
import { iFileData } from '../../interfaces/typesEformsApi'
import ButtonGov from '../Btns/ButtonGov'
import ErrorBlock from '../Error/Error'
import FileLink from '../FileLink/FileLink'
import Loading from '../Loading/Loading'

const ModalConvert = () => {
  const { closeModal } = useModal()
  const { testIsLastSubmission } = useTestIsLastSubmission()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { fileMainContract, submissionData, nextKeyIndex } = useFormContextBase()
  const { id } = submissionData
  const attachId = fileMainContract.id
  const formId = id

  const [fileInfo, setFileInfo] = useState({} as iFileData)
  const isInit = !!fileInfo.publicId

  const [resFile, setResFile] = useState({} as iFileData)
  const isConvert = !!resFile.id

  useEffectStart(() => {
    initConvert()
  })

  const initConvert = async () => {
    setLoading(true)
    setError('')
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    EformsApi.getAttachment(attachId)
      .then((fileInfo) => {
        setFileInfo(fileInfo)
      })
      .catch((err) => {
        setError('Nejdříve uložte smlouvu s přílohou')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const clickConvert = async () => {
    setLoading(true)
    setError('')
    try {
      const file = await EformsApi.getAttachmentContentPublic(fileInfo.publicId).catch((err) => {
        throw new Error('Nazdařilo se stáhnout info o souboru')
      })

      const convertedFile = await LibreOfficekApi.convertToPdf(file).catch((err) => {
        throw new Error('Nazdařilo se konverze do PDF')
      })
      // const myBlob = new Blob([convertedFile], { type: 'application/pdf' })
      // window.open(URL.createObjectURL(convertedFile));

      var convertedFileFile = new File([convertedFile], fileInfo.file.name + '.pdf')

      const resFile = await EformsApi.uploadFile(convertedFileFile, 'custom', ATTACH_SUBTYPE.SMLOUVA).catch((err) => {
        throw new Error('Nazdařilo se uložení konvertovaneho PDF')
      })

      setResFile(resFile)
      toast.success('Dokument byl úspěšně převeden na PDF')
    } catch (e: any) {
      console.log('chyba konverze', e)
      toast.error('Konverze souboru do PDF se nezdařila')
      setError(e?.message || 'Konverze souboru do PDF se nezdařila')
    } finally {
      setLoading(false)
    }
  }

  const clickSave = async () => {
    setLoading(true)
    setError('')
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    EformsApi.updateFormAttach(formId, attachId, resFile.id)
      .then((res) => {
        closeModal()
        nextKeyIndex()
      })
      .catch((err) => {
        setError('Chyba uložení převedené přílohy ke smlouvě.')
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
    if (isConvert) {
      return (
        <>
          Dokument konvertován do PDF:
          <br />
          <FileLink fileData={resFile} />
        </>
      )
    }
    if (isInit) {
      return (
        <>
          Dokument ke konvertování:
          <br />
          <FileLink fileData={fileInfo} />
        </>
      )
    }
    return null //todo kdy to muze nastat ?
  }

  const ModalBtn = () => {
    //TODO tlacitko kdyz nevyjde podepsani nebo ulozeni na eforms ???
    if (isConvert) {
      return (
        <ButtonGov variant='primary' onClick={clickSave}>
          Uložit konvertovaný PDF dokument
        </ButtonGov>
      )
    }
    if (isInit) {
      return (
        <ButtonGov variant='primary' onClick={clickConvert}>
          Konvertovat do PDF
        </ButtonGov>
      )
    } else {
      return (
        <ButtonGov variant='primary' onClick={initConvert}>
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

export default ModalConvert
