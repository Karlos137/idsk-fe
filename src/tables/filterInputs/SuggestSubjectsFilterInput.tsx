import React, { useEffect, useState } from 'react'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import WrapInputGov from '../../components/InputsUtils/WrapInputGov'
import Loading from '../../components/Loading/Loading'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useFilterContextInput } from '../../context/FilterContext'
import { useOrganizations } from '../../hooks/useOrganizations'

interface iSuggestSubjectsFilterInput {
  name: string
  label: string
  description?: string
  tooltip?: string
}

const SuggestSubjectsFilterInput = ({ name, label, tooltip, description }: iSuggestSubjectsFilterInput) => {
  const { value, setValue } = useFilterContextInput(name)
  const [openLabel, setOpenLabel] = useState(!!value)
  const { searchOrganizations, defOrganization, defOrganizationOptions } = useOrganizations(value)

  const [index, setIndex] = useState(1)
  useEffect(() => {
    if (!value) {
      setIndex(index + 1)
    }
  }, [value])

  if (defOrganization.loading) {
    return <Loading />
  }

  return (
    <WrapInputGov value={value} description={description} tooltip={tooltip} openLabel={openLabel}>
      <SuggestInputFetch
        key={index}
        name={name}
        onChange={(val) => {
          setValue(val ? val : undefined)
        }}
        selectOptions={defOrganizationOptions}
        fetchFn={searchOrganizations()}
        setOpenLabel={setOpenLabel}
      />

      <InputGovLabel inputId={'typeahead-' + name} label={label} />
    </WrapInputGov>
  )
}

export default SuggestSubjectsFilterInput
