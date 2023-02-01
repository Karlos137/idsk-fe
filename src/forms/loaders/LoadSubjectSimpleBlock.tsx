import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ButtonGov from '../../components/Btns/ButtonGov'
import InputGovLabel from '../../components/InputsUtils/InputGovLabel'
import WrapInputGov from '../../components/InputsUtils/WrapInputGov'
import SuggestInputFetch from '../../components/SuggestInput/SuggestInputFetch'
import { useOrganizations } from '../../hooks/useOrganizations'
import { useOrgTypes } from '../../hooks/useOrgTypes'

interface iLoadSubjectBlockSimple {
  value: string
  setValue: (valuse: string) => void
  label: string
  description?: string
  tooltip?: string
}

const LoadSubjectSimpleBlock = ({ value, setValue, label, description, tooltip }: iLoadSubjectBlockSimple) => {
  const name = 'simpleSubject'
  const { orgTypesId } = useOrgTypes()

  const { searchOrganizations, defOrganizationOptions } = useOrganizations()

  const [openLabel, setOpenLabel] = useState(false)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setValue('')
  }, [open])

  if (!open) {
    return (
      <div className='text-end pb-4'>
        <ButtonGov size='small' variant='primary-outlined' onClick={() => setOpen(true)}>
          Filtrovat dle smluvní strany
        </ButtonGov>
      </div>
    )
  }

  return (
    <Row>
      <Col>
        <WrapInputGov value={value} description={description} tooltip={tooltip} openLabel={openLabel}>
          <SuggestInputFetch
            name={name}
            onChange={(val) => {
              setValue(val)
            }}
            selectOptions={defOrganizationOptions}
            fetchFn={searchOrganizations([orgTypesId.obec, orgTypesId.dso])}
            setOpenLabel={setOpenLabel}
          />

          <InputGovLabel inputId={'typeahead-' + name} label={label} />
        </WrapInputGov>
      </Col>

      <Col xs={3} className='align-items-end justify-content-end text-end'>
        <ButtonGov size='small' variant='primary-outlined' onClick={() => setOpen(false)}>
          Zrušit filtr
        </ButtonGov>
      </Col>
    </Row>
  )
}

export default LoadSubjectSimpleBlock
