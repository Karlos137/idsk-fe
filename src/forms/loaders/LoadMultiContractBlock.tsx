import React, { useState } from 'react'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import WrapInputGov from '../../components/InputsUtils/WrapInputGov'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { WORKFLOW_PLACES } from '../../enums/enumWorkflowPlaces'
import { useContracts } from '../../hooks/useContracts'
import { iSubmissionDataContract } from '../../interfaces/ISubmissionData'

interface iLoadMultiContractBlock {
  contracts: iSubmissionDataContract[]
  setContracts: (contracts: iSubmissionDataContract[]) => void
  subjectId?: string
}

const LoadMultiContractBlock = ({ contracts, setContracts, subjectId }: iLoadMultiContractBlock) => {
  const name = 'multiContract'
  const label = 'Vyhledat smlouvy'

  const { searchContracts, contractsList } = useContracts()
  const [openLabel, setOpenLabel] = useState(false)

  const dataFilter = { 'data.pomocnaHodnotyPropsany': true }

  return (
    <WrapInputGov openLabel={openLabel}>
      <SuggestInputFetch
        name={name}
        onChange={(val) => {
          setContracts([...contracts, contractsList[val]])
        }}
        disabledOptions={contracts.map((org) => org.id)}
        clearOnSelect={true}
        fetchFn={searchContracts(subjectId, WORKFLOW_PLACES.PRIPRAVA_DAVKY, dataFilter)}
        setOpenLabel={setOpenLabel}
      />

      <InputGovLabel inputId={'typeahead-' + name} label={label} />
    </WrapInputGov>
  )
}

export default LoadMultiContractBlock
