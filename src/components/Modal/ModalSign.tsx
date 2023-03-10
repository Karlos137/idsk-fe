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
          setError('Pros??m vyberte ??ipovou kartu a podpisov?? certifik??t v aplikaci IDSK eSigning App.')
        }
      })
      .catch((err) => {
        console.log('chyba initu esigneru', err)
        setError('Pros??m spus??te aplikaci IDSK eSigning App. Vyberte ??ipovou kartu a podpisov?? certifik??t.')
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
        throw new Error('Chyba na??ten?? certifik??tu')
      })
      const actualSigningCertificate = appStatus.signingCertificate

      //TODO mozna nechat projit kdyz je chyba avatara
      const { base64 } = await loadAvatar().catch((err) => {
        throw new Error('Chyba na??ten?? podpisov??ho avatara')
      })

      const signatureImg = base64 ? base64.split(',')[1] : undefined

      const responseToSign = await StckApi.createDataToSign(
        submissionVersionId,
        attachId,
        actualSigningCertificate,
        signatureImg,
      ).catch((err) => {
        throw new Error(
          'Nezda??ilo se vytvo??it data k podeps??n??. ' +
            (err.response.status === 403 ? 'U??ivatel nema povolenou roli.' : 'Chyba z??sk??n?? dat z eSigner serveru.'),
        )
      })

      const { getDataToSignRequestBody, dataToSign } = responseToSign

      const signedData = await EsignerApi.sign(getDataToSignRequestBody, dataToSign).catch((err) => {
        throw new Error('Nezda??ilo se podepsat data')
      })

      if (!signedData.content) {
        throw new Error('Podepsan?? data jsou pr??zdn??')
      }
      //TODO chyba zruseni uzivatelem

      const res = await StckApi.insertSignedData(responseToSign.getDataToSignRequestBody, signedData.content).catch(
        (err) => {
          throw new Error('Nezda??ilo se ulo??it podepsan?? data')
        },
      )

      const { submissionAttachmentId } = res
      setNewAttachId(submissionAttachmentId)
      toast.success('Dokument byl ??sp????n?? podeps??n')
    } catch (e: any) {
      console.log('chyba podpisu', e)
      toast.error('Podeps??n?? souboru se nezda??ilo')
      setError(e?.message || 'Podeps??n?? souboru se nezda??ilo')
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
        setError('Chyba ulo??en?? p????lohy ke smlouv??.')
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
      //TODO - n??hled z public id udelat odkaz?? na zobrazeni
      return <>Dokument podeps??n</>
    }
    if (isInitEsigner) {
      return (
        <>
          Dokument k podeps??ni:
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
          Ulo??it podepsanou smlouvu
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
        <ButtonGov onClick={closeModal}>Zru??it</ButtonGov>
      </Modal.Footer>
    </>
  )
}

export default ModalSign
