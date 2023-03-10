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
    toast.error('Vypl??te v??echna povinn?? pole')
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
            <legend>Z??kladn?? ??daje o u??ivateli</legend>
            <FormSection name='basicInfo'>
              <LoadSubjectBlock
                name='subject'
                label='Vyhledat subjekt u??ivatele'
                disabled={isProfil || !isReferent}
                description='Subjekt pod kter??m bude u??ivatel registrov??n'
                defaultValue={defOrgId}
              />
              <TextInput name='position' label='Funk??n?? pozice' />

              <UserInputsBlock />

              <Row>
                <Col lg={6}>
                  <TextInput name='login' label='P??ihla??ovac?? jm??no' required />
                </Col>
              </Row>
            </FormSection>
          </fieldset>

          <Row>
            <Col>
              <fieldset>
                <legend>Stav u??ivatele v Port??lu</legend>
                <FormSection name='stateBox'>
                  {watchState === USER_STATES.NOT_ACTIVATED ? (
                    <div>U??ivatel nen?? aktivov??n</div>
                  ) : isProfil || isNew ? (
                    <div className='mb-4 mx-3'>AKTIVN??</div>
                  ) : (
                    <RadioInput disabled={isThisUser} name='state' label='P??ehled stav??' options={userStatesOptions} />
                  )}

                  {(watchState === USER_STATES.ACTIVE || isProfil) && (
                    <>
                      <DateInput
                        disabled={isThisUser}
                        name='activeFrom'
                        label='Pozastaven?? do'
                        tooltip={'Pozastavit ????et u??ivatele do'}
                      />
                      {/*<DateInput name="suspendedTo" label="Pozastaveny od"/>*/}
                    </>
                  )}
                </FormSection>
              </fieldset>
            </Col>
            <Col>
              <fieldset>
                <legend>Role u??ivatele v Port??lu</legend>
                <FormSection name='roleBox'>
                  <RadioInput
                    name='role'
                    label='P??ehled rol??'
                    options={roleTypesOptions}
                    disabledOptions={disabledOptions}
                    disabled={isProfil}
                  />
                </FormSection>
              </fieldset>
            </Col>
          </Row>

          <TextAreaInput name='basicInfo.note' label='Pozn??mka' />

          {!isNew && (
            <>
              {/*TODO logovani*/}

              {/*<fieldset>*/}
              {/*  <legend>Posledn?? akce</legend>*/}
              {/*  <table>*/}
              {/*    <tbody>*/}
              {/*      <tr>*/}
              {/*        <td>Posledn?? p??ihl????en?? do Port??lu:</td>*/}
              {/*        <td>TODO</td>*/}
              {/*        <td></td>*/}
              {/*      </tr>*/}
              {/*      <tr>*/}
              {/*        <td>Posledn?? operace v Port??lu:</td>*/}
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
            title={isNew ? 'Vytvo??it u??ivatele' : 'Ulo??it u??ivatele'}
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </form>
      </FormProvider>
    </>
  )
}

export default FormUser
