import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useFilterContext } from '../../context/FilterContext'
import { workwlowPlaceBatchOptions } from '../../enums/enumWorkflowPlaces'
import DateFilterInput from '../filterInputs/DateFilterInput'
import FilterBtns from '../filterInputs/FilterBtns'
import SelectFilterInput from '../filterInputs/SelectFilterInput'
import TextFilterInput from '../filterInputs/TextFilterInput'

const FilterContractBatches = () => {
  const { openFilter } = useFilterContext()

  if (!openFilter) {
    return null
  }

  const worflowBatchOptions = workwlowPlaceBatchOptions

  return (
    <fieldset className='mb-4'>
      <Row>
        <Col md={3}>
          <TextFilterInput name='data.davkaInfo.nazev' label='Název dávky' />
        </Col>
        <Col md={3}>
          <SelectFilterInput name='workflowPlace' label='Stav dávky' options={worflowBatchOptions} />
        </Col>
        <Col md={3}>
          <DateFilterInput name='data.davkaInfo.datumPlatnostiOd[gte]' label='Platí OD' />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <TextFilterInput name='data.davkaInfo.cisloUsneseniKraj' label='Číslo usnesení z kraje' />
        </Col>
        <Col md={3}>
          <DateFilterInput name='data.davkaInfo.datumUsneseniKraj' label='Datum usnesení z kraje' />
        </Col>
        <Col md={3}>{/*<CheckFilterInput name="data.withDleted" label="Včetně smazaných dávek"/>*/}</Col>
      </Row>

      <FilterBtns />
    </fieldset>
  )
}

export default FilterContractBatches
