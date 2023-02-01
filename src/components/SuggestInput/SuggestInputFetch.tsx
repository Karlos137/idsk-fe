import React, { useState } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css'

import 'react-bootstrap-typeahead/css/Typeahead.css'

interface iOption {
  label: string
  value: string
}

interface iSuggestInputFetch {
  name: string
  disabled?: boolean
  selectOptions?: iOption[]
  fetchFn: (query?: string) => Promise<iOption[]>
  onChange: (optVal: string) => void
  disabledOptions?: string[]
  clearOnSelect?: boolean
  setOpenLabel: (openLabel: boolean) => void
}

const SuggestInputFetch = ({
  name,
  disabled,
  selectOptions,
  fetchFn,
  onChange,
  disabledOptions,
  clearOnSelect,
  setOpenLabel,
}: iSuggestInputFetch) => {
  const [singleSelections, setSingleSelections] = useState<any[]>(selectOptions ? selectOptions : [])

  const handleChange = (opts: any[]) => {
    onChange(opts[0]?.value || '')
    if (!clearOnSelect) {
      setSingleSelections(opts)
    }
  }

  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<iOption[]>(selectOptions || [])

  const opts = options.filter((opt) => !disabledOptions?.includes(opt.value))

  const handleSearch = (query?: string) => {
    setIsLoading(true)
    setInputText(query || '')
    console.log('handle search', query)

    fetchFn(query).then((data) => {
      setOptions(data)
      setIsLoading(false)
    })
  }

  const handleInputChange = (text: string) => {
    console.log('handle change', text)
    if (!text) {
      handleSearch(undefined)
    }
  }

  const onFocus = () => {
    if (!inputText) {
      handleSearch(undefined)
    }
    setOpenLabel(true)
  }

  const onBlur = () => {
    if (!inputText) {
      setOpenLabel(false)
    }
  }

  return (
    <AsyncTypeahead
      onSearch={handleSearch}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      onChange={handleChange}
      options={opts}
      selected={singleSelections}
      minLength={0}
      onFocus={onFocus}
      onBlur={onBlur}
      isInvalid={!singleSelections.length && !!inputText}
      disabled={disabled}
      filterBy={() => true}
      // useCache={!disabledOptions?.length}
      useCache={false} //vypnuti kvuli zmene typu smlouvy - jiny seznam organizaci
      delay={300}
      caseSensitive={false}
      ignoreDiacritics={true}
      id={'basic-typeahead-single-' + name}
      inputProps={{
        id: 'typeahead-' + name,
        className: 'gov-form-control__input',
      }}
      // filterBy={['label', 'value']}
      // labelKey="label"

      promptText={'Zadejte text pro vyhledání'}
      // placeholder="Hledat..."
      searchText={'Vyhledávání...'}
      emptyLabel={'Žádné položky'}
      paginationText={'Více...'}
      clearButton={true}
      // paginate={true}
    />
  )
}

export default SuggestInputFetch
