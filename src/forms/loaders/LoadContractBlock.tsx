import React, { useEffect, useState } from 'react'
import Error from '../../components/Error/Error'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import Loading from '../../components/Loading/Loading'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useContracts } from '../../hooks/useContracts'
import { useFormInputValue } from '../../hooks/useFormHooks'
import FormInputWrap from '../utils/FormInputWrap'

interface iLoadContractBlock {
  name: string
  label: string
  description?: string
  disabled?: boolean
  tooltip?: string
  defaultValue?: string
}

const LoadContractBlock = ({ name, label, description, disabled, tooltip, defaultValue }: iLoadContractBlock) => {
  const { setInputValue } = useFormInputValue(name)

  const { searchContracts, defContract, defContractOptions } = useContracts(defaultValue)

  useEffect(() => {
    setInputValue(defaultValue)
  }, [defaultValue])

  const [openLabel, setOpenLabel] = useState(false)

  if (defContract.error) {
    return <Error msg='Chyba načtení smlouvy' />
  }
  if (defContract.loading) {
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
        selectOptions={defContractOptions}
        fetchFn={searchContracts()}
        setOpenLabel={setOpenLabel}
      />

      <InputGovLabel inputId={'typeahead-' + name} label={label} />
    </FormInputWrap>
  )
}

export default LoadContractBlock
