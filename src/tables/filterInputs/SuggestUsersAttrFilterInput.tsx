import React, { useEffect, useState } from 'react'
import IamApi from '../../api/IamApi'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import WrapInputGov from '../../components/InputsUtils/WrapInputGov'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useFilterContextInput } from '../../context/FilterContext'

interface iSuggestUsersAttrFilterInput {
  name: string
  label: string
  description?: string
  tooltip?: string
}

const SuggestUsersAttrFilterInput = ({ name, label, tooltip, description }: iSuggestUsersAttrFilterInput) => {
  const { value, setValue } = useFilterContextInput(name)
  const [openLabel, setOpenLabel] = useState(!!value)
  const defValueOptions = value ? [{ label: value, value: value }] : undefined

  const searchUsers = (query?: string) =>
    IamApi.searchUsers({ [name]: query }).then((data) => {
      const values = data
        .map((user: any) => user[name])
        .filter((v: string, i: number, a: any) => v && a.indexOf(v) === i)
      // .sort((a: string, b: string) => a.localeCompare(b))

      return values.map((v: string) => ({ label: v, value: v }))
    })

  const [index, setIndex] = useState(1)
  useEffect(() => {
    if (!value) {
      setIndex(index + 1)
    }
  }, [value])

  return (
    <WrapInputGov value={value} description={description} tooltip={tooltip} openLabel={openLabel}>
      <SuggestInputFetch
        key={index}
        name={name}
        onChange={(val) => {
          setValue(val ? val : undefined)
        }}
        selectOptions={defValueOptions}
        fetchFn={searchUsers}
        setOpenLabel={setOpenLabel}
      />

      <InputGovLabel inputId={'typeahead-' + name} label={label} />
    </WrapInputGov>
  )
}

export default SuggestUsersAttrFilterInput
