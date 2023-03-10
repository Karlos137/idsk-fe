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
        toast.error('Chyb?? dokument usnesen??')
        setLoading(false)
        return
      }
    }
    if (place === WP.KONCEPT && !(isP02 || isP04 || isP06)) {
      if (!fileMainContract?.id) {
        toast.error('Chyb?? dokument smlouvy')
        setLoading(false)
        return
      }
      const validTemplate = await StckApi.validateDocxTemplate(submissionVersionId, fileMainContract.id).catch(
        (err) => {
          if (err.response.data.error.code === 2302) {
            toast.error('Dokument smlouvy mus?? b??t form??tu DOCX')
          }
          console.log('Chyba validace dokumentu smlouvy', err)
        },
      )

      if (!validTemplate) {
        toast.error('Nepoda??ilo se ov????it zda dokument smlouvy obsahuje po??adovan?? prom??nn??')
        setLoading(false)
        return
      }

      if (validTemplate.missingTemplateVariables.length) {
        const missingVars = validTemplate.missingTemplateVariables.map((p) => '${' + p + '}').join(', ')
        toast.error('Dokument smlouvy neobsahuje po??adovan?? prom??nn??: ' + missingVars)
        setLoading(false)
        return
      }
    }
    if (placeCode === WP.K_PODPISU_B && !isBack) {
      if (fileMainContract?.file?.extension !== FILE_EXTENSION.PDF) {
        toast.error('Dokument smlouvy mus?? b??t ve form??tu PDF.')
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
        toast.success(isBack ? 'Smlouva vr??cena ' : 'Smlouva posunuta do dal????ho stavu')
        nextKeyIndex()
      })
      .catch((err) => {
        toast.error('Nepovolen?? p??echod workflow')
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
          toast.error('Neexistuje vhodn?? p??edchoz?? verze smlouvy')
          setLoading(false)
          return
        }
        const prevSubmissionId = prevVersion[0].id
        EformsApi.getAttachments(prevSubmissionId)
          .then((prevAttach) => {
            const prevSmlouva = prevAttach.filter((file) => file.subtype?.startsWith(ATTACH_SUBTYPE.SMLOUVA))
            if (!prevSmlouva.length) {
              toast.error('Neexituje p????loha smlouva v p??edchoz?? verzi')
              setLoading(false)
              return
            }
            const prevMainFileId = prevSmlouva[0].id
            EformsApi.updateFormAttach(id, fileMainContract.id, prevMainFileId, placeCode)
              .then((data) => {
                toast.success('Smlouva vr??cena do stavu k podpisu')
                nextKeyIndex()
              })
              .catch((err) => {
                toast.error('Nepovolen?? p??echod workflow')
              })
              .finally(() => setLoading(false))
          })
          .catch((err) => {
            toast.error('Nepoda??ilo se z??skat p????lohy z p??edchoz?? verze')
            setLoading(false)
          })
      })
      .catch((err) => {
        toast.error('Nepoda??ilo se z??skat p??edchoz?? verzi smlouvy')
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
          {(isP02 || isP04 || isP06) && <ButtonNext title={'Odeslat k podpisu stran?? B'} place={WP.K_PODPISU_B} />}
          {(isP01 || isP05) && <ButtonNext title={'Odeslat ke schv??len?? stran?? B'} place={WP.KE_SCHVALENI_B} />}
          {isP03 && <ButtonNext title={'Odeslat ke schv??len?? na kraj'} place={WP.KE_SCHVALENI_KRAJ} />}
        </>
      )
    } else if (place === WP.K_PREPRACOVANI && isReferent) {
      return (
        <>
          {(isP02 || isP04 || isP06) && (
            <ButtonNext title={'Odeslat znovu k podpisu stran?? B'} place={WP.K_PODPISU_B} />
          )}
          {(isP01 || isP05) && <ButtonNext title={'Odeslat znovu ke schv??len?? stran?? B'} place={WP.KE_SCHVALENI_B} />}
          {isP03 && <ButtonNext title={'Odeslat znovu ke schv??len?? na kraj'} place={WP.KE_SCHVALENI_KRAJ} />}
          <ButtonStorno title={'Nep??epracov??vat - storno'} place={WP.STORNO} />
        </>
      )
    } else if (place === WP.STORNO && isReferent) {
      return (
        <>
          <ButtonNext title={'O??ivit stornovanou smlouvu'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.KE_SCHVALENI_B && isKlientB) {
      return (
        <>
          {isP05 && <ButtonNext title={'Schv??leno na stran?? B - p????prava k podpisu'} place={WP.PRIPRAVA_K_PODPISU} />}
          {isP01 && <ButtonNext title={'Schv??leno na stran?? B - p????prava d??vky'} place={WP.PRIPRAVA_DAVKY} />}
          <ButtonStorno title={'Neschv??leno na stran?? B - p??epracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.PRIPRAVA_DAVKY && isReferent) {
      return (
        <>
          <ActionProccessTemplateBlock />
          <ButtonStorno title={'P??epracovat'} place={WP.KE_SCHVALENI_B} />
        </>
      )
    } else if (place === WP.PRIPRAVA_K_PODPISU_DAVKA && isReferent) {
      return (
        <>
          <ButtonNext title={'Odeslat k podpisu stran?? B'} place={WP.K_PODPISU_B} />
        </>
      )
    } else if (place === WP.KE_SCHVALENI_KRAJ && isReferent) {
      return (
        <>
          <ActionProccessTemplateBlock />
          <ButtonNext title={'Schv??leno na kraji - p????prava k podpisu'} place={WP.PRIPRAVA_K_PODPISU} />
          <ButtonStorno title={'Neschv??leno na kraji - p??epracovat'} place={WP.K_PREPRACOVANI} />
          <ButtonStorno title={'Neschv??leno na kraji - storno'} place={WP.STORNO} />
        </>
      )
    } else if (place === WP.PRIPRAVA_K_PODPISU && isReferent) {
      return (
        <>
          <ActionProccessTemplateBlock />
          <ButtonNext title={'Odeslat k podpisu stran?? B'} place={WP.K_PODPISU_B} />
        </>
      )
    } else if (place === WP.K_PODPISU_B && isPodepisujiciB) {
      return (
        <>
          <ActionSignBlock />
          <ButtonStorno title={'Nepodeps??no stranou B - p??epracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.KE_KONTROLE_GINIS && isReferent) {
      return (
        <>
          {hasPartC ? (
            <ButtonNext title={'??sp????n?? kontrola GINIS - kontrola ROPID'} place={WP.KE_KONTROLE_ROPID} />
          ) : (
            <ButtonNext title={'??sp????n?? kontrola GINIS - k podpisu A'} place={WP.K_PODPISU_A} />
          )}
          <ButtonStorno title={'Ne??sp????n?? kontrola GINIS - storno'} place={WP.STORNO} />
        </>
      )
    } else if (place === WP.KE_KONTROLE_ROPID && isKlientRopid) {
      return (
        <>
          <ButtonNext title={'??sp????n?? kontrola ROPID - k podpisu ROPID'} place={WP.K_PODPISU_ROPID} />
          <ButtonStorno title={'Ne??sp????n?? kontrola ROPID - p??epracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.K_PODPISU_ROPID && isPodepisujiciRopid) {
      return (
        <>
          <ActionSignBlock />
          <ButtonStorno title={'Nepodeps??no stranou ROPID - p??epracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.K_PODPISU_A && isPodepisujiciIdsk) {
      return (
        <>
          <ActionSignBlock />
          <ButtonStorno title={'Nepodeps??no stranou A - p??epracovat'} place={WP.K_PREPRACOVANI} />
        </>
      )
    } else if (place === WP.KONTROLA_PRED_VYRIZENIM && isReferent) {
      return (
        <>
          <ButtonNext title={'Smlouva ??sp????n?? vy????zena'} place={WP.VYRIZENO} />
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
        {isHistoryDetail ? 'Stav' : 'Aktu??ln?? stav'}: <Badge>{place}</Badge>
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
            <div className='mb-4'>Dal???? zpracov??n?? t??to smlouvy bude v r??mci odpov??daj??c?? d??vky smluv.</div>
          )}
          <NextStateBtns />
          <WorkflowValidMsgBlock />
        </>
      )}
    </>
  )
}

export default WorkflowBlock
