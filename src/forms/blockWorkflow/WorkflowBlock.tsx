import React, { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import StckApi from '../../api/StckApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase } from '../../context/FormContext'
import { CONTRACT_TYPES } from '../../enums/enumContractTypes'
import { FILE_EXTENSION } from '../../enums/enumFileExts'
import { WORKFLOW_PLACES as WP } from '../../enums/enumWorkflowPlaces'
import { useTestIsLastSubmission } from '../../hooks/useTestIsLastSubmission'
import { useUserAuth } from '../../hooks/useUserAuth'
import ActionProccessTemplateBlock from '../blockAction/ActionProcessTemplateBlock'
import ActionSignBlock from '../blockAction/ActionSignBlock'
import { ATTACH_SUBTYPE } from '../blocks/UploadBlock'
import WorkflowConditions from './WorkflowConditions'
import WorkflowValidMsgBlock from './WorkflowValidMsgBlock'

interface iWorkflowBlock {
  contractType: string
  hasPartC: boolean
}

interface iButton {
  title: string
  place: string
}

const WorkflowBlock = ({ contractType, hasPartC }: iWorkflowBlock) => {
  const [loading, setLoading] = useState(false)
  const [allChecked, setAllChecked] = useState(true)
  const { testIsLastSubmission } = useTestIsLastSubmission()

  const isP01 = contractType === CONTRACT_TYPES.P01
  const isP02 = contractType === CONTRACT_TYPES.P02
  const isP03 = contractType === CONTRACT_TYPES.P03
  const isP04 = contractType === CONTRACT_TYPES.P04
  const isP05 = contractType === CONTRACT_TYPES.P05
  const isP06 = contractType === CONTRACT_TYPES.P06

  const { isReferent, isOrgAdmin, isUserIdsk, isUserRopid, isKlient } = useUserAuth()
  const { submissionData, isHistoryDetail, nextKeyIndex, fileMainContract, fileMainResolution, submissionVersionId } =
    useFormContextBase()
  const id = submissionData.id
  const place = submissionData.workflowPlaceCode

  const isKlientB = (isOrgAdmin || isKlient) && !isUserRopid && !isUserIdsk
  const isKlientRopid = (isOrgAdmin || isKlient) && isUserRopid
  const isPodepisujiciB = isOrgAdmin && !isUserRopid && !isUserIdsk
  const isPodepisujiciIdsk = isOrgAdmin && isUserIdsk
  const isPodepisujiciRopid = isOrgAdmin && isUserRopid

  const changeWplace = async (placeCode: string, isBack?: boolean) => {
    setLoading(true)
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    if (place === WP.KE_SCHVALENI_B && isP01) {
      if (!fileMainResolution?.id) {
        toast.error('Chybí dokument usnesení')
        setLoading(false)
        return
      }
    }
    if (place === WP.KONCEPT && !(isP02 || isP04 || isP06)) {
      if (!fileMainContract?.id) {
        toast.error('Chybí dokument smlouvy')
        setLoading(false)
        return
      }
      const validTemplate = await StckApi.validateDocxTemplate(submissionVersionId, fileMainContract.id).catch(
        (err) => {
          if (err.response.data.error.code === 2302) {
            toast.error('Dokument smlouvy musí být formátu DOCX')
          }
          console.log('Chyba validace dokumentu smlouvy', err)
        },
      )

      if (!validTemplate) {
        toast.error('Nepodařilo se ověřit zda dokument smlouvy obsahuje požadované proměnné')
        setLoading(false)
        return
      }

      if (validTemplate.missingTemplateVariables.length) {
        const missingVars = validTemplate.missingTemplateVariables.map((p) => '${' + p + '}').join(', ')
        toast.error('Dokument smlouvy neobsahuje požadované proměnné: ' + missingVars)
        setLoading(false)
        return
      }
    }
    if (placeCode === WP.K_PODPISU_B && !isBack) {
      if (fileMainContract?.file?.extension !== FILE_EXTENSION.PDF) {
        toast.error('Dokument smlouvy musí být ve formátu PDF.')
        setLoading(false)
        return
      }
    }

    const attachmentsJsonPatch =
      place === WP.KE_SCHVALENI_B && isBack && fileMainResolution
        ? [{ op: 'remove', path: '/' + fileMainResolution.id }]
        : undefined

    EformsApi.updateFormWorkflow(id, placeCode, undefined, attachmentsJsonPatch)
      .then((data) => {
        toast.success(isBack ? 'Smlouva vrácena ' : 'Smlouva posunuta do dalšího stavu')
        nextKeyIndex()
      })
      .catch((err) => {
        toast.error('Nepovolený přechod workflow')
      })
      .finally(() => setLoading(false))
  }

  const resignWplace = async (placeCode: string) => {
    setLoading(true)
    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }
    EformsApi.getVersionLast(id, [WP.K_PODPISU_A, WP.K_PODPISU_B, WP.K_PODPISU_ROPID])
      .then((prevVersion) => {
        if (!prevVersion.length) {
          toast.error('Neexistuje vhodná předchozí verze smlouvy')
          setLoading(false)
          return
        }
        const prevSubmissionId = prevVersion[0].id
        EformsApi.getAttachments(prevSubmissionId)
          .then((prevAttach) => {
            const prevSmlouva = prevAttach.filter((file) => file.subtype?.startsWith(ATTACH_SUBTYPE.SMLOUVA))
            if (!prevSmlouva.length) {
              toast.error('Neexituje příloha smlouva v předchozí verzi')
              setLoading(false)
              return
            }
            const prevMainFileId = prevSmlouva[0].id
            EformsApi.updateFormAttach(id, fileMainContract.id, prevMainFileId, placeCode)
              .then((data) => {
                toast.success('Smlouva vrácena do stavu k podpisu')
                nextKeyIndex()
              })
              .catch((err) => {
                toast.error('Nepovolený přechod workflow')
              })
              .finally(() => setLoading(false))
          })
          .catch((err) => {
            toast.error('Nepodařilo se získat přílohy z předchozí verze')
            setLoading(false)
          })
      })
      .catch((err) => {
        toast.error('Nepodařilo se získat předchozí verzi smlouvy')
        setLoading(false)
      })
  }

  const ButtonNext = ({ title, place }: iButton) => (
    <ButtonGov variant='primary' disabled={!allChecked} onClick={() => changeWplace(place)}>
      {title}
    </ButtonGov>
  )

  const ButtonStorno = ({ title, place }: iButton) => (
    <ButtonGov variant='primary-outlined' className='ms-5' onClick={() => changeWplace(place, true)}>
      {title}
    </ButtonGov>
  )

  const ButtonResign = ({ title, place }: iButton) => (
    <ButtonGov variant='primary' onClick={() => resignWplace(place)}>
      {title}
    </ButtonGov>
  )

  const NextStateBtns = () => {
    if (place === WP.KONCEPT && isReferent) {
      return (
        <>
          {(isP02 || isP04 || isP06) && <ButtonNext title={'Odeslat k podpisu straně B'} place={WP.K_PODPISU_B} />}
          {(isP01 || isP05) && <ButtonNext title={'Odeslat ke schválení straně B'} place={WP.KE_SCHVALENI_B} />}
          {isP03 && <ButtonNext title={'Odeslat ke schválení na kraj'} place={WP.KE_SCHVALENI_KRAJ} />}
        </>
      )
    } else if (place === WP.K_PREPRACOVANI && isReferent) {
      return (
        <>
          {(isP02 || isP04 || isP06) && (
            <ButtonNext title={'Odeslat znovu k podpisu straně B'} place={WP.K_PODPISU_B} />
          )}
          {(isP01 || isP05) && <ButtonNext title={'Odeslat znovu ke schválení straně B'} place={WP.KE_SCHVALENI_B} />}
          {isP03 && <ButtonNext title={'Odeslat znovu ke schválení na kraj'} place={WP.KE_SCHVALENI_KRAJ} />}
          <ButtonStorno title={'Nepřepracovávat - storno'} place={WP.STORNO} />
        </>
      )
    } else if (place === WP.STORNO && isReferent) {
      return (
        <>
          <ButtonNext title={'Oživit stornovanou smlouvu'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.KE_SCHVALENI_B && isKlientB) {
      return (
        <>
          {isP05 && <ButtonNext title={'Schváleno na straně B - příprava k podpisu'} place={WP.PRIPRAVA_K_PODPISU} />}
          {isP01 && <ButtonNext title={'Schváleno na straně B - příprava dávky'} place={WP.PRIPRAVA_DAVKY} />}
          <ButtonStorno title={'Neschváleno na straně B - přepracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.PRIPRAVA_DAVKY && isReferent) {
      return (
        <>
          <ActionProccessTemplateBlock />
          <ButtonStorno title={'Přepracovat'} place={WP.KE_SCHVALENI_B} />
        </>
      )
    } else if (place === WP.PRIPRAVA_K_PODPISU_DAVKA && isReferent) {
      return (
        <>
          <ButtonNext title={'Odeslat k podpisu straně B'} place={WP.K_PODPISU_B} />
        </>
      )
    } else if (place === WP.KE_SCHVALENI_KRAJ && isReferent) {
      return (
        <>
          <ActionProccessTemplateBlock />
          <ButtonNext title={'Schváleno na kraji - příprava k podpisu'} place={WP.PRIPRAVA_K_PODPISU} />
          <ButtonStorno title={'Neschváleno na kraji - přepracovat'} place={WP.K_PREPRACOVANI} />
          <ButtonStorno title={'Neschváleno na kraji - storno'} place={WP.STORNO} />
        </>
      )
    } else if (place === WP.PRIPRAVA_K_PODPISU && isReferent) {
      return (
        <>
          <ActionProccessTemplateBlock />
          <ButtonNext title={'Odeslat k podpisu straně B'} place={WP.K_PODPISU_B} />
        </>
      )
    } else if (place === WP.K_PODPISU_B && isPodepisujiciB) {
      return (
        <>
          <ActionSignBlock />
          <ButtonStorno title={'Nepodepsáno stranou B - přepracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.KE_KONTROLE_GINIS && isReferent) {
      return (
        <>
          {hasPartC ? (
            <ButtonNext title={'Úspěšná kontrola GINIS - kontrola ROPID'} place={WP.KE_KONTROLE_ROPID} />
          ) : (
            <ButtonNext title={'Úspěšná kontrola GINIS - k podpisu A'} place={WP.K_PODPISU_A} />
          )}
          <ButtonStorno title={'Neúspěšná kontrola GINIS - storno'} place={WP.STORNO} />
        </>
      )
    } else if (place === WP.KE_KONTROLE_ROPID && isKlientRopid) {
      return (
        <>
          <ButtonNext title={'Úspěšná kontrola ROPID - k podpisu ROPID'} place={WP.K_PODPISU_ROPID} />
          <ButtonStorno title={'Neúspěšná kontrola ROPID - přepracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.K_PODPISU_ROPID && isPodepisujiciRopid) {
      return (
        <>
          <ActionSignBlock />
          <ButtonStorno title={'Nepodepsáno stranou ROPID - přepracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.K_PODPISU_A && isPodepisujiciIdsk) {
      return (
        <>
          <ActionSignBlock />
          <ButtonStorno title={'Nepodepsáno stranou A - přepracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.KONTROLA_PRED_VYRIZENIM && isReferent) {
      return (
        <>
          <ButtonNext title={'Smlouva úspěšně vyřízena'} place={WP.VYRIZENO} />
        </>
      )
    } else if (place === WP.NEVALIDNI_PODPIS_A && isPodepisujiciIdsk) {
      return (
        <>
          <ButtonResign title={'Opakovat podpis - navrat do stavu k podpisu'} place={WP.K_PODPISU_A} />
        </>
      )
    } else if (place === WP.NEVALIDNI_PODPIS_B && isPodepisujiciB) {
      return (
        <>
          <ButtonResign title={'Opakovat podpis - navrat do stavu k podpisu'} place={WP.K_PODPISU_B} />
        </>
      )
    } else if (place === WP.NEVALIDNI_PODPIS_ROPID && isPodepisujiciRopid) {
      return (
        <>
          <ButtonResign title={'Opakovat podpis - navrat do stavu k podpisu'} place={WP.K_PODPISU_ROPID} />
        </>
      )
    }
    return null
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='mb-4'>
        {isHistoryDetail ? 'Stav' : 'Aktuální stav'}: <Badge>{place}</Badge>
      </div>
      {!isHistoryDetail && (
        <>
          <WorkflowConditions
            place={place}
            isP02P04P06={isP02 || isP04 || isP06}
            setAllChecked={setAllChecked}
            isReferent={isReferent}
            isKlientB={isKlientB}
            isKlientRopid={isKlientRopid}
          />
          {place === WP.PRIPRAVA_DAVKY && (
            <div className='mb-4'>Další zpracování této smlouvy bude v rámci odpovídající dávky smluv.</div>
          )}
          <NextStateBtns />
          <WorkflowValidMsgBlock />
        </>
      )}
    </>
  )
}

export default WorkflowBlock
