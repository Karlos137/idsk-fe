import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import EformsApi, { SLUG_FORM_SMLOUVA } from '../../api/EformsApi'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase, withFormContextBase } from '../../context/FormContext'
import { useFormActionsContractBatch } from '../../hooks/useFormActionsContractBatch'
import { usePermissionsBatch } from '../../hooks/usePermissionsBatch'
import { iSubmissionDataContract } from '../../interfaces/ISubmissionData'
import { AuditInfoBlock } from '../blocks/AuditInfoBlock'
import CommentsBlock from '../blocks/CommentsBlock'
import ContractsListBlock, { CONTRACTS_STATES } from '../blocks/ContractsListBlock'
import FormContractModals from '../blocks/FormContractModals'
import UploadBlock from '../blocks/UploadBlock'
import WorkflowBatchBlock from '../blockWorkflow/WorkflowBatchBlock'
import DateInput from '../inputs/DateInput'
import TextInput from '../inputs/TextInput'
import LoadMultiContractBlock from '../loaders/LoadMultiContractBlock'
import LoadSubjectSimpleBlock from '../loaders/LoadSubjectSimpleBlock'
import FormSection from '../utils/FormSection'
import SubmitBtn from '../utils/SubmitBtn'
import FormContractBatchTopButtons from './FormContractBatchTopButtons'
import { iSchemaContractBatch } from './SchemeContractBatch'

interface iFormContract {
  id: string
}

const FormContractBatch = ({ id }: iFormContract) => {
  const isNew = !id

  const { onSubmitAction, setFormData, methods, dataLoading } = useFormActionsContractBatch(id)
  const { editMode, setEditMode, keyIndex, submissionDataBatch, setSubmissionDataBatch } = useFormContextBase()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = () => {
    if (isNew) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    EformsApi.getSubmission(id)
      .then((data) => {
        setFormData(data)
        setSubmissionDataBatch(data)
      })
      .catch((err) => {
        if (err.response.stateCode === 403) {
          setError('Nem??te opr??vn??n?? zobrazit d??vku')
        } else {
          setError('Chyba na??ten?? d??vky')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [keyIndex])

  const {
    canEditAttachUsneseniBatch,
    canEditAttachOtherBatch,
    canEditContractBatch,
    canEditContractBatchContract,
    canEditContractBatchContractState,
    canReadContractBatch,
  } = usePermissionsBatch()

  const canEditAttachBatch = canEditAttachOtherBatch || canEditAttachUsneseniBatch

  useEffect(() => {
    if (isNew) {
      setEditMode(true)
    }
  }, [isNew])

  const [childContracts, setChildContracts] = useState<iSubmissionDataContract[]>([])
  const [childContractsStates, setChildContractsStates] = useState<{ [contractId: string]: string }>({})

  useEffect(() => {
    if (submissionDataBatch.data) {
      const { smlouvy, pomocnaSmlouvyPrepracovat, pomocnaSmlouvyStornovat, pomocnaSmlouvyRevokovat } =
        submissionDataBatch.data

      if (smlouvy?.length) {
        EformsApi.getSubmissionsSearch(SLUG_FORM_SMLOUVA, 1, 200, { id: smlouvy })
          .then((res) => {
            setChildContracts(res.data)
          })
          .catch((err) => {
            toast.error('Chyba na??ten?? smluv v d??vce')
          })
      }

      const states = {
        ...createContractStateList(CONTRACTS_STATES.prepracovat, pomocnaSmlouvyPrepracovat),
        ...createContractStateList(CONTRACTS_STATES.stornovat, pomocnaSmlouvyStornovat),
        ...createContractStateList(CONTRACTS_STATES.revokovat, pomocnaSmlouvyRevokovat),
      }
      setChildContractsStates(states)
    }
  }, [submissionDataBatch])

  const findContractByState = (state: string) =>
    Object.entries(childContractsStates)
      .filter(([contractId, contractState]) => contractState === state)
      .map(([contractId]) => contractId)

  const createContractStateList = (state: string, contractsList?: string[]) =>
    contractsList ? contractsList.reduce((prev, cur) => ({ ...prev, [cur]: state }), {}) : undefined

  const onSubmit = async (data: iSchemaContractBatch) => {
    if (!childContracts.length) {
      toast.error('D??vka mus?? obsahovat alespo?? jednu smlouvu')
      return
    }
    data.smlouvy = childContracts.map((contract) => contract.id)
    data.pomocnaSmlouvyPrepracovat = findContractByState(CONTRACTS_STATES.prepracovat)
    data.pomocnaSmlouvyStornovat = findContractByState(CONTRACTS_STATES.stornovat)
    data.pomocnaSmlouvyRevokovat = findContractByState(CONTRACTS_STATES.revokovat)

    onSubmitAction(data, childContracts)
  }

  const onError = (err: any) => {
    toast.error('Vypl??te v??echna povinn?? pole')
    console.log('err', err)
  }

  const [subjectId, setSubjectId] = useState('')
  const isSubmitting = methods.formState.isSubmitting

  if (error) {
    return <Error msg={error} />
  }
  if (loading || dataLoading) {
    return <Loading />
  }
  if (!canReadContractBatch) {
    return <Error msg={'Nem??te opr??vn??n?? ????st d??vku smlouvy.'} />
  }
  if (editMode && !(canEditContractBatch || canEditAttachBatch)) {
    return <Error msg={'Nem??te opr??vn??n?? upravit d??vku.'} />
  }

  return (
    <>
      <FormProvider {...methods}>
        {!isNew && <FormContractBatchTopButtons />}
        <form className='mt-5' onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <fieldset>
            <legend>Z??kladn?? ??daje o d??vce</legend>
            <FormSection name='davkaInfo'>
              <Row>
                <Col>
                  <TextInput name='nazev' label='N??zev' required />
                </Col>
                <Col lg={3}>
                  <DateInput name='datumPlatnostiOd' label='D??vka plat?? od' />
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextInput name='cisloUsneseniKraj' label='????slo usnesen?? z kraje' />
                </Col>
                <Col>
                  <DateInput name='datumUsneseniKraj' label='Datum usnesen?? z kraje' />
                </Col>
                <Col>{/*<CheckInput name="jeVysporadana" label="D??vka je vyspo????dan??"/>*/}</Col>
              </Row>
            </FormSection>
          </fieldset>

          <fieldset>
            <legend>Smlouvy</legend>

            <ContractsListBlock
              contracts={childContracts}
              setContracts={setChildContracts}
              constractsStates={childContractsStates}
              setContractsStates={setChildContractsStates}
              disabled={!editMode || !canEditContractBatchContract}
              selectMode={canEditContractBatchContractState}
            />

            {editMode && canEditContractBatchContract && (
              <LoadSubjectSimpleBlock
                value={subjectId}
                setValue={setSubjectId}
                label='Vyberte obec nebo DSO (smluvn?? strana)'
              />
            )}

            {editMode && canEditContractBatchContract && (
              <LoadMultiContractBlock
                subjectId={subjectId}
                contracts={childContracts}
                setContracts={setChildContracts}
              />
            )}
          </fieldset>
          <fieldset>
            <legend>P????lohy</legend>
            <UploadBlock isBatch={true} />
          </fieldset>

          {editMode && (
            <SubmitBtn
              title={isNew ? 'Zalo??it d??vku' : 'Ulo??it d??vku a p????lohy'}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          )}

          {!isNew && !editMode && (
            <>
              <fieldset>
                <legend>Pozn??mky</legend>
                <CommentsBlock id={id} />
              </fieldset>

              <AuditInfoBlock
                createdAt={submissionDataBatch?.createdAt}
                createdBy={submissionDataBatch?.createdBy?.name}
                updatedAt={submissionDataBatch?.updatedAt}
                updatedBy={submissionDataBatch?.updatedBy?.name}
              />

              <fieldset>
                <legend>Stav a ob??h d??vky</legend>
                <WorkflowBatchBlock />
              </fieldset>
            </>
          )}
        </form>
        <FormContractModals />
      </FormProvider>
    </>
  )
}

export default withFormContextBase(FormContractBatch)
