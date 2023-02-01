import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ButtonGov from '../../components/Btns/ButtonGov'
import Error from '../../components/Error/Error'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import Loading from '../../components/Loading/Loading'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useFormContextBase } from '../../context/FormContext'
import { useFormInputValue } from '../../hooks/useFormHooks'
import { useOrganizations } from '../../hooks/useOrganizations'
import HiddenInput from '../inputs/HiddenInput'
import SelectInput from '../inputs/SelectInput'
import TextInput from '../inputs/TextInput'
import FormInputWrap from '../utils/FormInputWrap'

interface iSubjectWizard {
  subjectLetter: string
  withCount?: boolean
  defaultOrgId?: string
  supportSubject?: string[]
  disabled?: boolean
}

const pocetStranOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
]

const SubjectWizard = ({ subjectLetter, withCount, defaultOrgId, supportSubject, disabled }: iSubjectWizard) => {
  // const name = 'subject' + subjectLetter
  const name = ''
  const label = `Vyberte subjekt, který bude smluvní strannou ${subjectLetter}`
  const description = undefined
  const tooltip = undefined

  const { formDisabled } = useFormContextBase()

  const { searchOrganizations, organizations, defOrganization } = useOrganizations(defaultOrgId)

  const [selectId, setSelectId] = useState(defaultOrgId || '')

  const inputNazev = useFormInputValue('nazev')
  const inputIc = useFormInputValue('ic')
  const inputId = useFormInputValue('id')
  const block = useFormInputValue('')

  // kvuli nacteni do subject Wizardu pri dodatku
  const watchId = inputId.watchInput()
  useEffect(() => {
    if (watchId) {
      setSelectId(watchId)
    }
  }, [watchId])

  useEffect(() => {
    const id = inputId.getInputValue()
    if (id) {
      setSelectId(id)
    }
  }, [])

  const selectOrg = organizations[selectId]
  useEffect(() => {
    if (selectOrg) {
      inputNazev.setInputValue(selectOrg.name)
      inputIc.setInputValue(selectOrg.identifications?.ic)
      inputId.setInputValue(selectOrg.id)
    }
  }, [selectOrg])

  const changeOrg = () => {
    setSelectId('')
    block.setInputValue(undefined)
  }

  const [openLabel, setOpenLabel] = useState(false)

  if (defOrganization.loading) {
    return <Loading />
  }
  if (defOrganization.error) {
    return <Error msg={'Chyba načtení vychozí organizace'} />
  }

  if (!selectId) {
    return (
      <>
        <FormInputWrap name={name} description={description} tooltip={tooltip} openLabel={openLabel}>
          <SuggestInputFetch
            disabled={disabled}
            name={name}
            onChange={setSelectId}
            fetchFn={searchOrganizations(supportSubject)}
            setOpenLabel={setOpenLabel}
          />

          <InputGovLabel inputId={'typeahead-' + name} label={label} />
        </FormInputWrap>
      </>
    )
  }

  return (
    <>
      <HiddenInput name={'id'} />

      <Row>
        <Col lg={6}>
          <TextInput
            name='nazev'
            label='Název'
            disabled={true}
            tooltip={`Název subjektu smluvní strany ${subjectLetter}`}
          />
        </Col>
        <Col lg={3}>
          <TextInput name='ic' label='IČ' disabled={true} tooltip={`Ič subjektu smluvní straby ${subjectLetter}`} />
        </Col>
        <Col lg={3}>
          {!formDisabled && !disabled && (
            <ButtonGov variant='primary' onClick={changeOrg}>
              Změnit subjekt
            </ButtonGov>
          )}
        </Col>
      </Row>

      <Row>
        <Col lg={9}>
          <TextInput
            name={`cisloSmlouvyStrany${subjectLetter}`}
            label='Číslo smlouvy'
            tooltip={`Číslo smlouvy, pod kterým je smlouva evidována u smluvní strany ${subjectLetter}`}
          />
        </Col>
        <Col lg={3}>
          {withCount && (
            <SelectInput
              disabled={disabled}
              name={`pocetPodepisujicichStrany${subjectLetter}`}
              label='Počet podepisujících'
              options={pocetStranOptions}
              defaultValue={'1'}
              tooltip={`Počet podepisujících u smluvní strany ${subjectLetter} (například musí podepsat 2 statutární zástupci).`}
            />
          )}
        </Col>
      </Row>
    </>
  )
}

export default SubjectWizard
