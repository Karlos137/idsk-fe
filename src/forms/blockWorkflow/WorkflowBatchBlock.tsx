import React, { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase } from '../../context/FormContext'
import { WORKFLOW_PLACES_BATCH as WPB } from '../../enums/enumWorkflowPlaces'
import { useTestIsLastSubmission } from '../../hooks/useTestIsLastSubmission'
import ActionGenerateListBlock from '../blockAction/ActionGenerateListBlock'
import WorkflowConditionsBatch from './WorkflowConditionsBatch'

interface iButton {
  title: string
  place: string
}

const WorkflowBatchBlock = () => {
  const [loading, setLoading] = useState(false)
  const [allChecked, setAllChecked] = useState(true)
  const { testIsLastSubmission } = useTestIsLastSubmission()

  const { submissionDataBatch, nextKeyIndex, fileMainResolution } = useFormContextBase()
  const id = submissionDataBatch.id
  const place = submissionDataBatch.workflowPlaceCode

  const changeWplace = async (placeCode: string) => {
    setLoading(true)

    // kontrola pred zpracovanim jestli jsou potrebne atributy a soubor
    if (placeCode === WPB.ZPRACOVANI) {
      const davkaInfo = submissionDataBatch.data.davkaInfo
      if (!davkaInfo?.cisloUsneseniKraj) {
        toast.error('Chybí číslo usnesení z kraje')
        setLoading(false)
        return
      }
      if (!davkaInfo?.datumUsneseniKraj) {
        toast.error('Chybí datum usnesení z kraje')
        setLoading(false)
        return
      }
      if (!fileMainResolution) {
        toast.error('Chybí dokument usnesení')
        setLoading(false)
        return
      }
      // if (fileMainResolution.file.extension !== 'docx') {
      //   toast.error('Dokument usnesení musí být formátu DOCX')
      //   setLoading(false)
      //   return
      // }
    }

    const isLast = await testIsLastSubmission()
    if (!isLast) {
      setLoading(false)
      return
    }

    EformsApi.updateFormWorkflow(id, placeCode)
      .then((data) => {
        toast.success('Dávka posunuta do dalšího stavu')
        nextKeyIndex()
      })
      .catch((err) => {
        toast.error('Nepovolený přechod workflow')
      })
      .finally(() => setLoading(false))
  }

  const ButtonNext = ({ title, place }: iButton) => (
    <ButtonGov variant='primary' disabled={!allChecked} onClick={() => changeWplace(place)}>
      {title}
    </ButtonGov>
  )

  const ButtonStorno = ({ title, place }: iButton) => (
    <ButtonGov variant='primary-outlined' className='ms-5' onClick={() => changeWplace(place)}>
      {title}
    </ButtonGov>
  )

  const NextStateBtns = () => {
    if (place === WPB.PRIPRAVA) {
      return (
        <>
          <ButtonNext title={'Dávka připravena - odeslat ke schválení'} place={WPB.ODESLANO} />
        </>
      )
    } else if (place === WPB.ODESLANO) {
      return (
        <>
          <ActionGenerateListBlock />
          <ButtonNext title={'Dávka vyřízena - odeslat ke zpracování'} place={WPB.ZPRACOVANI} />
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
        Aktuální stav dávky: <Badge>{place}</Badge>
      </div>
      <WorkflowConditionsBatch place={place} setAllChecked={setAllChecked} />
      <NextStateBtns />
    </>
  )
}

export default WorkflowBatchBlock
