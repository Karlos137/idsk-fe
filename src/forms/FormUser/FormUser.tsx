import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormProvider } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { IDSK_SUBJEKT_TYPES } from '../../enums/enumSubjektTypes'
import { IDSK_ROLES } from '../../enums/enumUserRolesTypes'
import { USER_STATES, userStatesOptions } from '../../enums/enumUserStates'
import { useFetch } from '../../hooks/useFetch'
import { useFormActionsUser } from '../../hooks/useFormActionsUser'
import { useMainOrgs } from '../../hooks/useMainOrgs'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useUserRolesTypes } from '../../hooks/useUserRolesTypes'
import { iUserData } from '../../interfaces/iUserData'
import { selectUserData } from '../../redux/user/selectors'
import { AuditInfoBlock } from '../blocks/AuditInfoBlock'
import { UserInputsBlock } from '../blocks/UserInputsBlock'
import DateInput from '../inputs/DateInput'
import RadioInput from '../inputs/RadioInput'
import TextAreaInput from '../inputs/TextAreaInput'
import TextInput from '../inputs/TextInput'
import LoadSubjectBlock from '../loaders/LoadSubjectBlock'
import FormSection from '../utils/FormSection'
import SubmitBtn from '../utils/SubmitBtn'
import { iSchemaUser } from './SchemeUser'

interface iFormUser {
  id: string
  isProfil?: boolean
}

const FormUser = ({ id, isProfil }: iFormUser) => {
  const isNew = !id

  const { onSubmitAction, setFormData, methods, dataLoading } = useFormActionsUser(id)
  const userData = useSelector(selectUserData)
  const { isReferent, isAdmin } = useUserAuth()
  const { mainOrgIdIdsk } = useMainOrgs()

  const { data, error, loading } = useFetch<iUserData>(
    id
      ? () =>
          IamApi.getUser(id).then((data) => {
            setFormData(data)
            return data
          })
      : undefined,
  )

  const { userRolesTypesOptions } = useUserRolesTypes()

  const watchState = methods.watch('stateBox.state')
  const watchOrgId = methods.watch('basicInfo.subject')

  const defOrgId = id ? data?.organization?.id : userData?.organization?.id
  const defOrgType = id
    ? data?.organization?.organizationType.identifier
    : userData?.organization?.organizationType.identifier
  const isIdsk = mainOrgIdIdsk === watchOrgId || (watchOrgId === defOrgId && defOrgType === IDSK_SUBJEKT_TYPES.IDSK)

  const roleTypesOptions = userRolesTypesOptions.filter((role) =>
    isIdsk
      ? ![IDSK_ROLES.SUBJEKT_NAHLIZEJICI, IDSK_ROLES.SUBJEKT_PODEPISUJICI].includes(role.value)
      : ![IDSK_ROLES.IDSK_NAHLIZEJICI, IDSK_ROLES.IDSK_PODEPISUJICI].includes(role.value),
  )

  const disabledOptions = isAdmin
    ? []
    : isReferent
    ? [IDSK_ROLES.ADMIN, IDSK_ROLES.REFERENT]
    : [IDSK_ROLES.ADMIN, IDSK_ROLES.REFERENT, IDSK_ROLES.SUBJEKT_PODEPISUJICI, IDSK_ROLES.IDSK_PODEPISUJICI]

  const onSubmit = async (data: iSchemaUser) => {
    onSubmitAction(data, isProfil)
  }
  const onError = (err: any) => {
    toast.error('Vyplňte všechna povinná pole')
    console.log('err', err)
  }

  const isSubmitting = methods.formState.isSubmitting

  if (error) {
    return <Error msg={error} />
  }
  if (loading || dataLoading) {
    return <Loading />
  }

  const isThisUser = id === userData?.id

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <fieldset>
            <legend>Základní údaje o uživateli</legend>
            <FormSection name='basicInfo'>
              <LoadSubjectBlock
                name='subject'
                label='Vyhledat subjekt uživatele'
                disabled={isProfil || !isReferent}
                description='Subjekt pod kterým bude uživatel registrován'
                defaultValue={defOrgId}
              />
              <TextInput name='position' label='Funkční pozice' />

              <UserInputsBlock />

              <Row>
                <Col lg={6}>
                  <TextInput name='login' label='Přihlašovací jméno' required />
                </Col>
              </Row>
            </FormSection>
          </fieldset>

          <Row>
            <Col>
              <fieldset>
                <legend>Stav uživatele v Portálu</legend>
                <FormSection name='stateBox'>
                  {watchState === USER_STATES.NOT_ACTIVATED ? (
                    <div>Uživatel není aktivován</div>
                  ) : isProfil || isNew ? (
                    <div className='mb-4 mx-3'>AKTIVNÍ</div>
                  ) : (
                    <RadioInput disabled={isThisUser} name='state' label='Přehled stavů' options={userStatesOptions} />
                  )}

                  {(watchState === USER_STATES.ACTIVE || isProfil) && (
                    <>
                      <DateInput
                        disabled={isThisUser}
                        name='activeFrom'
                        label='Pozastavený do'
                        tooltip={'Pozastavit účet uživatele do'}
                      />
                      {/*<DateInput name="suspendedTo" label="Pozastaveny od"/>*/}
                    </>
                  )}
                </FormSection>
              </fieldset>
            </Col>
            <Col>
              <fieldset>
                <legend>Role uživatele v Portálu</legend>
                <FormSection name='roleBox'>
                  <RadioInput
                    name='role'
                    label='Přehled rolí'
                    options={roleTypesOptions}
                    disabledOptions={disabledOptions}
                    disabled={isProfil}
                  />
                </FormSection>
              </fieldset>
            </Col>
          </Row>

          <TextAreaInput name='basicInfo.note' label='Poznámka' />

          {!isNew && (
            <>
              {/*TODO logovani*/}

              {/*<fieldset>*/}
              {/*  <legend>Poslední akce</legend>*/}
              {/*  <table>*/}
              {/*    <tbody>*/}
              {/*      <tr>*/}
              {/*        <td>Poslední přihlášení do Portálu:</td>*/}
              {/*        <td>TODO</td>*/}
              {/*        <td></td>*/}
              {/*      </tr>*/}
              {/*      <tr>*/}
              {/*        <td>Poslední operace v Portálu:</td>*/}
              {/*        <td>TODO</td>*/}
              {/*        <td></td>*/}
              {/*      </tr>*/}
              {/*    </tbody>*/}
              {/*  </table>*/}
              {/*</fieldset>*/}

              <AuditInfoBlock createdAt={data?.createdAt} createdBy={data?.createdBy} updatedAt={data?.updatedAt} />
            </>
          )}

          <SubmitBtn
            title={isNew ? 'Vytvořit uživatele' : 'Uložit uživatele'}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </form>
      </FormProvider>
    </>
  )
}

export default FormUser
