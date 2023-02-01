import React, { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormProvider } from 'react-hook-form'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { useFormActionsSubject } from '../../hooks/useFormActionsSubject'
import { useWatchFullName } from '../../hooks/useFormHooks'
import { useOrgTypes } from '../../hooks/useOrgTypes'
import { iOrgData } from '../../interfaces/IOrgData'
import AresLoaderBlock from '../blocks/AresLoaderBlock'
import { AuditInfoBlock } from '../blocks/AuditInfoBlock'
import SubjectsListBlock from '../blocks/SubjectsListBlock'
import { UserInputsBlock } from '../blocks/UserInputsBlock'
import CheckInput from '../inputs/CheckInput'
import SelectInput from '../inputs/SelectInput'
import TextAreaInput from '../inputs/TextAreaInput'
import TextInput from '../inputs/TextInput'
import LoadMultiSubjectBlock from '../loaders/LoadMultiSubjectBlock'
import FormSection from '../utils/FormSection'
import Repeater from '../utils/Repeater'
import SubmitBtn from '../utils/SubmitBtn'
import { iSchemaSubject } from './SchemeSubject'

interface iFormContract {
  id: string
}

const DEFAULT_STATE = 'cz'
const statesOptions = [
  { value: 'cz', label: 'Česká republika' },
  { value: 'sk', label: 'Slovenská republika' },
]

const SectionContractPersons = ({ isNew }: { isNew: boolean }) => {
  const watchIsStatutory = useWatchFullName('isStatutory')
  const watchEstablishAccount = useWatchFullName('establishAccount')
  return (
    <div>
      <Row>
        <Col sm={4}>
          <CheckInput name='isStatutory' label='Statutární zástupce' />
        </Col>
        <Col sm={4}>
          <CheckInput name='isMainContact' label='Hlavní osoba pro komunikaci' />
        </Col>
      </Row>
      <UserInputsBlock />

      {isNew && watchIsStatutory && (
        <Row>
          <Col lg={3}>
            <CheckInput name='establishAccount' label='Založit účet podepisujícímu' />
          </Col>
          <Col lg={3}>{watchEstablishAccount && <TextInput name='login' label='Přihlašovací jméno' required />}</Col>
        </Row>
      )}
    </div>
  )
}

const FormSubject = ({ id }: iFormContract) => {
  const isNew = !id

  const { onSubmitAction, setFormData, methods, dataLoading } = useFormActionsSubject(id)

  const { data, error, loading } = useFetch<iOrgData>(
    id
      ? () =>
          IamApi.getOrg(id).then((data) => {
            setFormData(data)
            setOrgs(data.childrenOrganizations)
            return data
          })
      : undefined,
  )

  const [orgs, setOrgs] = useState<iOrgData[]>([])

  const { orgTypesOptions, orgTypesId } = useOrgTypes()

  const onSubmit = async (data: iSchemaSubject) => {
    const orgTypeId = data.basicInfo.subjectType
    onSubmitAction(data, orgTypeId, orgs, typeIsDso)
  }

  const onError = (err: any) => {
    toast.error('Vyplňte všechna povinná pole')
    console.log('err', err)
  }

  const isSubmitting = methods.formState.isSubmitting

  const watchType = methods.watch('basicInfo.subjectType')
  const typeIsDso = watchType === orgTypesId.dso

  if (error) {
    return <Error msg={error} />
  }
  if (loading || dataLoading) {
    return <Loading />
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <fieldset>
            <legend>Základní údaje</legend>
            <FormSection name='basicInfo'>
              <Row>
                <Col lg={4}>
                  <SelectInput name='subjectType' label='Typ subjektu' required options={orgTypesOptions} />
                </Col>
                <Col lg={4}>
                  <TextInput name='ic' label='IČ' required />
                </Col>
                <Col lg={4}>
                  <AresLoaderBlock />
                </Col>
              </Row>
              <TextInput name='name' label='Název' required />
            </FormSection>
          </fieldset>

          {typeIsDso ? (
            <fieldset>
              <legend>Obce zařazené v DSO</legend>
              <SubjectsListBlock orgs={orgs} setOrgs={setOrgs} />
              <LoadMultiSubjectBlock orgs={orgs} setOrgs={setOrgs} />
            </fieldset>
          ) : (
            <fieldset>
              <legend>Adresa</legend>
              <FormSection name='address'>
                <Row>
                  <Col lg={6}>
                    <TextInput name='street' label='Ulice' required />
                  </Col>
                  <Col lg={3}>
                    <TextInput name='landRegistryNumber' label='Číslo popisné' required />
                  </Col>
                  <Col lg={3}>
                    <TextInput name='houseNumber' label='Číslo orientační' />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <TextInput name='psc' label='PSČ' required />
                  </Col>
                  <Col lg={6}>
                    <TextInput name='municipality' label='Obec' required />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <SelectInput
                      name='stateCode'
                      label='Stát'
                      defaultValue={isNew ? DEFAULT_STATE : undefined}
                      options={statesOptions}
                    />
                  </Col>
                </Row>
              </FormSection>
            </fieldset>
          )}

          <fieldset>
            <legend>Kontaktní osoby</legend>

            <Repeater sectionName='contactPersons' min={0}>
              <SectionContractPersons isNew={isNew} />
            </Repeater>
          </fieldset>

          <TextAreaInput name='basicInfo.note' label='Poznámka' />

          {!isNew && (
            <AuditInfoBlock createdAt={data?.createdAt} createdBy={data?.createdBy} updatedAt={data?.updatedAt} />
          )}

          <SubmitBtn
            title={isNew ? 'Vytvořit subjekt' : 'Uložit subjekt'}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </form>
      </FormProvider>
    </>
  )
}

export default FormSubject
