import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormProvider } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import { LINKS } from '../../components/App/LINKS'
import Error from '../../components/Error/Error'
import InputSelectGov from '../../components/Inputs/InputSelectGov'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase, withFormContextBase } from '../../context/FormContext'
import { CONTRACT_TYPES, contractTypeOptions } from '../../enums/enumContractTypes'
import { useFormActionsContract } from '../../hooks/useFormActionsContract'
import { useMainOrgs } from '../../hooks/useMainOrgs'
import { useOrgTypes } from '../../hooks/useOrgTypes'
import { usePermissions } from '../../hooks/usePermissions'
import { useUserAuth } from '../../hooks/useUserAuth'
import { iSubmissionDataContract } from '../../interfaces/ISubmissionData'
import { selectUserData } from '../../redux/user/selectors'
import { AuditInfoBlock } from '../blocks/AuditInfoBlock'
import CommentsBlock from '../blocks/CommentsBlock'
import FormContractModals from '../blocks/FormContractModals'
import UploadBlock from '../blocks/UploadBlock'
import WorkflowBlock from '../blockWorkflow/WorkflowBlock'
import CheckInput from '../inputs/CheckInput'
import DateInput from '../inputs/DateInput'
import HiddenInput from '../inputs/HiddenInput'
import RadioInput from '../inputs/RadioInput'
import SelectInput from '../inputs/SelectInput'
import TextAreaInput from '../inputs/TextAreaInput'
import TextInput from '../inputs/TextInput'
import LoadContractBlock from '../loaders/LoadContractBlock'
import SubjectWizard from '../loaders/SubjectWizard'
import FormSection from '../utils/FormSection'
import SubmitBtn from '../utils/SubmitBtn'
import FormContractTopButtons from './FormContractTopButtons'
import { iSchemaContract } from './SchemeContract'

interface iFormContract {
  id: string
  versionId?: string
}

export const VARIANTA_SMLOUVA = 'smlouva'
export const VARIANTA_DODATEK = 'dodatek'

export const POCET_STRAN_2 = 'dvoustranna'
export const POCET_STRAN_3 = 'tristranna'

const variantOptions = [
  { value: VARIANTA_SMLOUVA, label: 'Smlouva' },
  { value: VARIANTA_DODATEK, label: 'Dodatek' },
]

const pocetStranOptions = [
  { value: POCET_STRAN_2, label: 'Smlouva dvoustranná' },
  { value: POCET_STRAN_3, label: 'Smlouva třístranná' },
]

const finVysledekOptions = [
  { value: 'schvaleno', label: 'Schváleno' },
  { value: 'zamitnut', label: 'Zamítnut' },
]

const FormContract = ({ id, versionId }: iFormContract) => {
  const isNew = !id
  const isHistory = !!versionId

  const { onSubmitAction, setFormData, methods, dataLoading } = useFormActionsContract(id)
  const { setSubmissionData, editMode, setEditMode, keyIndex, submissionData, formDisabled } = useFormContextBase()
  const { orgTypesId } = useOrgTypes()

  const { mainOrgIdIdsk, mainOrgIdRopid, mainOrgIdLoading, mainOrgIdError } = useMainOrgs()

  const userData = useSelector(selectUserData)
  const { isReferent } = useUserAuth()

  //TODO nacist ostatni referenty + ulozit - jaka pouzit ID?
  const referentsOptions = isNew
    ? [{ value: userData!.id || '', label: userData!.username }]
    : [{ value: submissionData?.createdBy?.id, label: submissionData?.createdBy?.name }]

  const [referent, setReferent] = useState(referentsOptions[0].value)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = () => {
    if (isNew) {
      setLoading(false)
      return
    }

    const fetchFn = () => (versionId ? EformsApi.getVersionDetail(versionId) : EformsApi.getSubmission(id))

    setLoading(true)
    setError('')
    fetchFn()
      .then((data) => {
        setFormData(data)
        setSubmissionData(data)
        setReferent(data.createdBy?.id)
      })
      .catch((err) => {
        console.log('err', err, err.response.status)
        if (err.response.status === 403) {
          setError('Nemáte oprávnění zobrazit smlouvu')
        } else {
          setError('Chyba načtení smlouvy')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [keyIndex])

  const { canEditContract, canReadContract, canEditAttachMain, canEditAttachUsneseni, canEditAttachOther } =
    usePermissions()
  const canEditAttach = canEditAttachMain || canEditAttachUsneseni || canEditAttachOther

  useEffect(() => {
    if (isNew) {
      setEditMode(true)
    }
  }, [isNew])

  const onSubmit = async (data: iSchemaContract) => {
    onSubmitAction(data)
  }

  const onError = (err: any) => {
    toast.error('Vyplňte všechna povinná pole')
    console.log('err', err)
  }

  const isSubmitting = methods.formState.isSubmitting

  const watchParent = methods.watch('rodicovskaSmlouva')
  useEffect(() => {
    if (watchParent) {
      EformsApi.getSubmission(watchParent)
        .then((parentForm: iSubmissionDataContract) => {
          const parentData = parentForm.data
          methods.setValue('typ', parentData.typ)
          methods.setValue('pocetStran', parentData.pocetStran)
          methods.setValue('jeFinancniKontrola', parentData.jeFinancniKontrola)
          methods.setValue('subjektStranyA', parentData.subjektStranyA)
          methods.setValue('subjektStranyB', parentData.subjektStranyB)
          methods.setValue('subjektStranyC', parentData.subjektStranyC)
        })
        .catch((err) => {
          toast.error('Chyba načtení původní smlouvy')
        })
    } else {
      methods.setValue('typ', '')
      methods.setValue('pocetStran', '')
      methods.setValue('jeFinancniKontrola', true)
      methods.setValue('subjektStranyA', undefined)
      methods.setValue('subjektStranyB', undefined)
      methods.setValue('subjektStranyC', undefined)
    }
  }, [watchParent])

  if (error) {
    return <Error msg={error} />
  }
  if (mainOrgIdError) {
    return <Error msg={mainOrgIdError} />
  }
  if (loading || dataLoading || mainOrgIdLoading) {
    return <Loading />
  }
  if (!canReadContract) {
    return <Error msg={'Nemáte oprvávnění číst koncept smlouvy.'} />
  }
  if (editMode && !(canEditContract || canEditAttach)) {
    return <Error msg={'Nemáte oprvávnění upravit smlouvu.'} />
  }

  const watchType = methods.watch('typ')
  const watchVariant = methods.watch('varianta')
  const watchPocetStran = methods.watch('pocetStran')
  const watchFinancialControl = methods.watch('jeFinancniKontrola')

  const isTypeP01 = watchType === CONTRACT_TYPES.P01
  const isTypeP03 = watchType === CONTRACT_TYPES.P03
  const isTypeP05 = watchType === CONTRACT_TYPES.P05

  let supportSubject: string[] = []
  if (watchType === CONTRACT_TYPES.P01) {
    supportSubject = [orgTypesId.obec, orgTypesId.dso]
  } else if (watchType === CONTRACT_TYPES.P02) {
    supportSubject = [orgTypesId.dopravce]
  } else if (watchType === CONTRACT_TYPES.P05) {
    supportSubject = [orgTypesId.kraj]
  } else if (watchType === CONTRACT_TYPES.P06) {
    supportSubject = [orgTypesId.zeleznice]
  }

  const isVariantPartC = watchPocetStran === POCET_STRAN_3
  const isDodatek = watchVariant === VARIANTA_DODATEK
  const isFinancial = !!watchFinancialControl

  const defContractId = submissionData?.data?.rodicovskaSmlouva

  return (
    <>
      <FormProvider {...methods}>
        {!isNew && <FormContractTopButtons submissionId={id} />}

        <form className='mt-5' onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <HiddenInput name='pomocnaPocetPodpisu' />
          <HiddenInput name='pomocnaHodnotyPropsany' />

          <fieldset>
            <legend>Základní charakteristika dokladu</legend>

            <RadioInput
              name='varianta'
              columnCount={4}
              defaultValue={isNew ? VARIANTA_SMLOUVA : undefined}
              tooltip={'Lze smluvu nebo dodatek. Dodatek se váže na původní smlouvu, a přebírá některé její atributy.'}
              options={variantOptions}
            />
          </fieldset>

          {isDodatek && (
            <fieldset>
              <legend>Původní smlouva</legend>

              <LoadContractBlock
                name={'rodicovskaSmlouva'}
                label={'Vyberte smlouvu'}
                disabled={formDisabled}
                defaultValue={defContractId}
              />
              {!editMode && defContractId && (
                <small>
                  <Link to={LINKS.prehledSmluv + '/' + defContractId} target='_blank' rel='noopener noreferrer'>
                    Zobrazit smlouvu
                  </Link>
                </small>
              )}
            </fieldset>
          )}

          <fieldset>
            <legend>Podporované typy smluv</legend>

            <Row className='mb-4'>
              <RadioInput name='typ' columnCount={2} disabled={isDodatek} options={contractTypeOptions} />
            </Row>

            <Row className='mb-4'>
              <Col lg={6}>
                <RadioInput
                  disabled={isDodatek}
                  name='pocetStran'
                  columnCount={2}
                  defaultValue={isNew ? POCET_STRAN_2 : undefined}
                  options={pocetStranOptions}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <CheckInput
                  name='jeFinancniKontrola'
                  label='Bude vyžadována finanční kontrola'
                  defaultValue={isNew ? true : undefined}
                  tooltip={'Pokud bude vybráno, tak se na formuláři zobrazí sekce pro údaje finanční kontroly.'}
                />
              </Col>
            </Row>
          </fieldset>

          <fieldset>
            <legend>Smluvní strana A</legend>
            <FormSection name='subjektStranyA'>
              <SubjectWizard disabled={isDodatek} subjectLetter='A' defaultOrgId={isNew ? mainOrgIdIdsk : undefined} />
            </FormSection>
          </fieldset>

          <fieldset>
            <legend>Smluvní strana B</legend>
            <FormSection name='subjektStranyB'>
              <SubjectWizard disabled={isDodatek} subjectLetter='B' withCount={true} supportSubject={supportSubject} />
            </FormSection>
          </fieldset>

          {isVariantPartC && (
            <fieldset>
              <legend>Smluvní strana C</legend>
              <FormSection name='subjektStranyC'>
                <SubjectWizard
                  disabled={isDodatek}
                  subjectLetter='C'
                  defaultOrgId={isNew ? mainOrgIdRopid : undefined}
                />
              </FormSection>
            </fieldset>
          )}

          <fieldset>
            <legend>Údaje o smlouvě</legend>
            <FormSection name='smlouvaInfo'>
              <TextInput
                name='nazev'
                label='Název smlouvy / dodatku'
                required
                tooltip={'Název smlouvy / dodatku tak, jak je uveden v souboru s textem smlouvy / dodatku ke smlouvě'}
              />
              {isReferent && (
                <TextInput
                  name='poznamka'
                  label='Poznámka referenta'
                  tooltip={'Libovolná poznámka ke smlouvě / k dodatktu'}
                />
              )}

              {!isHistory && (
                <InputSelectGov
                  name='referent'
                  label='Referent smlouvy'
                  tooltip={'Referent, který bude mít smlouvu na starosti'}
                  options={referentsOptions}
                  value={referent}
                  onChange={(e) => setReferent(e.target.value)}
                  disabled={formDisabled}
                />
              )}
            </FormSection>
          </fieldset>

          {(isTypeP01 || isTypeP03 || isTypeP05) && (
            <fieldset>
              <legend>Schválení smlouvy / dodatku</legend>
              <FormSection name='schvaleni'>
                {isTypeP01 && (
                  <FormSection name='obec'>
                    <h3>Na obci / na DSO</h3>
                    <Row>
                      <Col lg={3}>
                        <DateInput
                          name='datumUsneseniObec'
                          label='Datum usnesení'
                          tooltip='Datum usnesení uvedené na dokumentu usnesení z obce'
                        />
                      </Col>
                      <Col>
                        <TextInput
                          name='cisloUsneseniObec'
                          label='Číslo usnesení'
                          tooltip='Číslo usnesení uvedené na dokumentu usnesení z obce'
                        />
                      </Col>
                    </Row>
                  </FormSection>
                )}

                {(isTypeP01 || isTypeP03 || isTypeP05) && (
                  <FormSection name='kraj'>
                    <h3>Na kraji</h3>
                    <Row>
                      <Col lg={3}>
                        <DateInput
                          name='datumUsneseniKraj'
                          label='Datum usnesení'
                          tooltip='Datum usnesení uvedené na dokumentu usnesení z kraje'
                        />
                      </Col>
                      <Col>
                        <TextInput
                          name='cisloUsneseniKraj'
                          label='Číslo usnesení'
                          tooltip='Číslo usnesení uvedené na dokumentu usnesení z kraje'
                        />
                      </Col>
                    </Row>
                  </FormSection>
                )}
              </FormSection>
            </fieldset>
          )}

          {isFinancial && (
            <fieldset>
              <legend>Finanční kontrola</legend>
              <FormSection name='financniKontrola'>
                <Row>
                  <Col lg={3}>
                    <DateInput
                      name='datumFinancniKontroly'
                      label='Datum'
                      tooltip='Finanční kontrola byla provedena dne'
                    />
                  </Col>
                  <Col>
                    <SelectInput
                      name='vysledekFinancniKontroly'
                      label='Výsledek'
                      tooltip='Výsledek finanční kontroly'
                      options={finVysledekOptions}
                    />
                  </Col>
                </Row>
                <TextAreaInput name='poznamkaFinancniKontroly' label='Zdůvodnění výsledku' />
              </FormSection>
            </fieldset>
          )}

          <fieldset>
            <legend>Přílohy</legend>
            <UploadBlock />
          </fieldset>

          {editMode && (
            <SubmitBtn
              title={isNew ? 'Založit smlouvu' : 'Uložit smlouvu a přílohy'}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          )}

          {!isNew && !editMode && (
            <>
              <fieldset>
                <legend>Poznámky uživatelů</legend>
                <CommentsBlock id={id} />
              </fieldset>

              <AuditInfoBlock
                createdAt={submissionData?.createdAt}
                createdBy={submissionData?.createdBy?.name}
                updatedAt={submissionData?.updatedAt}
                updatedBy={submissionData?.updatedBy?.name}
              />

              <fieldset>
                <legend>Stav a oběh smlouvy</legend>
                <WorkflowBlock contractType={watchType} hasPartC={isVariantPartC} />
              </fieldset>
            </>
          )}
        </form>
        <FormContractModals />
      </FormProvider>
    </>
  )
}

export default withFormContextBase(FormContract)
