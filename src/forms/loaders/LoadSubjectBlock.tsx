import React, { useEffect, useState } from 'react'
import Error from '../../components/Error/Error'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import Loading from '../../components/Loading/Loading'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useFormInputValue } from '../../hooks/useFormHooks'
import { useOrganizations } from '../../hooks/useOrganizations'
import FormInputWrap from '../utils/FormInputWrap'

interface iLoadSubjectBlock {
  name: string
  label: string
  description?: string
  disabled?: boolean
  tooltip?: string
  defaultValue?: string
}

const LoadSubjectBlock = ({ name, label, description, disabled, tooltip, defaultValue }: iLoadSubjectBlock) => {
  const { setInputValue } = useFormInputValue(name)
  const { searchOrganizations, defOrganization, defOrganizationOptions } = useOrganizations(defaultValue)

  useEffect(() => {
    setInputValue(defaultValue)
  }, [defaultValue])

  const [openLabel, setOpenLabel] = useState(false)

  if (defOrganization.error) {
    return <Error msg='Chyba načtení organizace' />
  }
  if (defOrganization.loading) {
    return <Loading />
  }

  return (
    <FormInputWrap name={name} description={description} tooltip={tooltip} openLabel={openLabel}>
      <SuggestInputFetch
        name={name}
        disabled={disabled}
        onChange={(val) => {
          setInputValue(val)
        }}
        selectOptions={defOrganizationOptions}
        fetchFn={searchOrganizations()}
        setOpenLabel={setOpenLabel}
      />

      <InputGovLabel inputId={'typeahead-' + name} label={label} />
    </FormInputWrap>
  )
}

export default LoadSubjectBlock
