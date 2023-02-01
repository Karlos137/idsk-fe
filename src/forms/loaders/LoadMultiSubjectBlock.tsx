import React, { useState } from 'react'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import WrapInputGov from '../../components/InputsUtils/WrapInputGov'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useOrgTypes } from '../../hooks/useOrgTypes'
import { iOrgData } from '../../interfaces/IOrgData'

interface iLoadMultiSubjectBlock {
  orgs: iOrgData[]
  setOrgs: (orgs: iOrgData[]) => void
}

const LoadMultiSubjectBlock = ({ orgs, setOrgs }: iLoadMultiSubjectBlock) => {
  const name = 'multiSubject'
  const label = 'Přidat obec do DSO'

  const { orgTypesId } = useOrgTypes()
  const { searchOrganizations, organizations } = useOrganizations()

  const [openLabel, setOpenLabel] = useState(false)

  return (
    <WrapInputGov openLabel={openLabel}>
      <SuggestInputFetch
        name={name}
        onChange={(val) => {
          setOrgs([...orgs, organizations[val]])
        }}
        disabledOptions={orgs.map((org) => org.id)}
        clearOnSelect={true}
        fetchFn={searchOrganizations([orgTypesId.obec])}
        setOpenLabel={setOpenLabel}
      />

      <InputGovLabel inputId={'typeahead-' + name} label={label} />
    </WrapInputGov>
  )
}

export default LoadMultiSubjectBlock
