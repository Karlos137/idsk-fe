import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import EsignerApi from '../../api/EsignerApi'
import StckApi from '../../api/StckApi'
import { useFormContextBase } from '../../context/FormContext'
import { SIGN_TRANSITIONS } from '../../enums/enumWorkflowPlaces'
import { useEffectStart } from '../../hooks/useEffectStart'
import { useModal } from '../../hooks/useModal'
import { useTestIsLastSubmission } from '../../hooks/useTestIsLastSubmission'
import { loadAvatar } from '../../utils/loadAvatar'
import ButtonGov from '../Btns/ButtonGov'
import ErrorBlock from '../Error/Error'
import FileLink from '../FileLink/FileLink'
import Loading from '../Loading/Loading'

const ModalSign = () => {
  const { closeModal } = useModal()
  const { testIsLastSubmission } = useTestIsLastSubmission()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { fileMainContract, submissionData, nextKeyIndex, submissionVersionId } = useFormContextBase()
  const { workflowPlaceCode, data, id } = submissionData
  const pomocnaPocetPodpisu = data?.pomocnaPocetPodpisu

  const nexState = SIGN_TRANSITIONS[workflowPlaceCode]
  const attachId = fileMainContract.id
  const formId = id

  const [signingCertificate, setSigningCertificate] = useState('')
  const isInitEsigner = !!signingCertificate

  const [newAttachId, setNewAttachId] = useState('')
  const isSigned = !!newAttachId

  useEffectStart(() => {
    initEsigner()
  })

  const initEsigner = async () => {
    setLoading(true)
    setError('')
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    EsignerApi.getAppStatus()
      .then((appStatus) => {
        if (appStatus.signingCertificate) {
          setSigningCertificate(appStatus.signingCertificate)
          //TODO nejak rozparsovat signingCertificate a porovnat s prihlasenym uzivatelem
        } else {
          console.log('neni certifikat v esigneru', appStatus)
          setError('Prosím vyberte čipovou kartu a podpisový certifikát v aplikaci IDSK eSigning App.')
        }
      })
      .catch((err) => {
        console.log('chyba initu esigneru', err)
        setError('Prosím spusťte aplikaci IDSK eSigning App. Vyberte čipovou kartu a podpisový certifikát.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const clickPodepsat = async () => {
    setLoading(true)
    setError('')

    try {
      const appStatus = await EsignerApi.getAppStatus().catch((err) => {
        throw new Error('Chyba načtení certifikátu')
      })
      const actualSigningCertificate = appStatus.signingCertificate

      //TODO mozna nechat projit kdyz je chyba avatara
      const { base64 } = await loadAvatar().catch((err) => {
        throw new Error('Chyba načtení podpisového avatara')
      })

      const signatureImg = base64 ? base64.split(',')[1] : undefined

      const responseToSign = await StckApi.createDataToSign(
        submissionVersionId,
        attachId,
        actualSigningCertificate,
        signatureImg,
      ).catch((err) => {
        throw new Error(
          'Nezdařilo se vytvořit data k podepsání. ' +
            (err.response.status === 403 ? 'Uživatel nema povolenou roli.' : 'Chyba získání dat z eSigner serveru.'),
        )
      })

      const { getDataToSignRequestBody, dataToSign } = responseToSign

      const signedData = await EsignerApi.sign(getDataToSignRequestBody, dataToSign).catch((err) => {
        throw new Error('Nezdařilo se podepsat data')
      })

      if (!signedData.content) {
        throw new Error('Podepsaná data jsou prázdná')
      }
      //TODO chyba zruseni uzivatelem

      const res = await StckApi.insertSignedData(responseToSign.getDataToSignRequestBody, signedData.content).catch(
        (err) => {
          throw new Error('Nezdařilo se uložit podepsaná data')
        },
      )

      const { submissionAttachmentId } = res
      setNewAttachId(submissionAttachmentId)
      toast.success('Dokument byl úspěšně podepsán')
    } catch (e: any) {
      console.log('chyba podpisu', e)
      toast.error('Podepsání souboru se nezdařilo')
      setError(e?.message || 'Podepsání souboru se nezdařilo')
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
    EformsApi.updateFormAttach(formId, attachId, newAttachId, nexState, pomocnaPocetPodpisu + 1)
      .then((res) => {
        closeModal()
        nextKeyIndex()
      })
      .catch((err) => {
        setError('Chyba uložení přílohy ke smlouvě.')
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
    if (isSigned) {
      //TODO - náhled z public id udelat odkaz?? na zobrazeni
      return <>Dokument podepsán</>
    }
    if (isInitEsigner) {
      return (
        <>
          Dokument k podepsáni:
          <br />
          <FileLink fileData={fileMainContract} />
        </>
      )
    }
    return null //todo kdy to muze nastat ?
  }

  const ModalBtn = () => {
    //TODO tlacitko kdyz nevyjde podepsani nebo ulozeni na eforms ???
    if (isSigned) {
      return (
        <ButtonGov variant='primary' onClick={clickSave}>
          Uložit podepsanou smlouvu
        </ButtonGov>
      )
    }
    if (isInitEsigner) {
      return (
        <ButtonGov variant='primary' onClick={clickPodepsat}>
          Podepsat
        </ButtonGov>
      )
    } else {
      return (
        <ButtonGov variant='primary' onClick={initEsigner}>
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

export default ModalSign
