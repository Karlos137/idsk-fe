import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useFilterContext } from '../../context/FilterContext'
import { contractTypeOptions } from '../../enums/enumContractTypes'
import { workwlowPlaceOptions } from '../../enums/enumWorkflowPlaces'
import { POCET_STRAN_3, VARIANTA_DODATEK } from '../../forms/FormContract/FormContract'
import { useWorkflowsByVariantRole } from '../../hooks/useWorkflowsByVariantRole'
import CheckFilterInput from '../filterInputs/CheckFilterInput'
import DateFilterInput from '../filterInputs/DateFilterInput'
import FilterBtns from '../filterInputs/FilterBtns'
import SelectFilterInput from '../filterInputs/SelectFilterInput'
import TextFilterInput from '../filterInputs/TextFilterInput'

const FilterContracts = () => {
  const { openFilter } = useFilterContext()
  const validWorkflow = useWorkflowsByVariantRole()

  if (!openFilter) {
    return null
  }

  const worflowOptions = workwlowPlaceOptions.filter(({ value }) => validWorkflow.includes(value))
  return (
    <fieldset className='mb-4'>
      <Row>
        <Col md={4}>
          <SelectFilterInput name='data.typ' label='Typ smlouvy' options={contractTypeOptions} />
        </Col>
        <Col md={4}>
          <SelectFilterInput name='workflowPlace' label='Stav smlouvy' options={worflowOptions} />
        </Col>
        <Col md={2}>
          <CheckFilterInput name='data.varianta' label='Dodatek' filterValue={VARIANTA_DODATEK} />
        </Col>
        <Col md={2}>
          <CheckFilterInput name='data.pocetStran' label='Třístranná smlouva' filterValue={POCET_STRAN_3} />
        </Col>
      </Row>

      <Row>
        <Col>
          <TextFilterInput name='data.smlouvaInfo.nazev' label='Název smlouvy' />
        </Col>
        <Col md={4}>
          <TextFilterInput name='data.subjektStranyA.cisloSmlouvyStranyA' label='Číslo smlouvy IDSK' />
        </Col>
      </Row>

      <Row>
        <Col>
          <TextFilterInput name='data.subjektStranyB.nazev' label='Smluvní strana B' />
        </Col>
        <Col md={4}>
          <TextFilterInput name='data.subjektStranyB.cisloSmlouvyStranyB' label='Číslo smlouvy u smluvní strany B' />
        </Col>
      </Row>

      <Row>
        <Col>
          <TextFilterInput name='data.subjektStranyC.nazev' label='Smluvní strana C' />
        </Col>
        <Col md={4}>
          <TextFilterInput name='data.subjektStranyC.cisloSmlouvyStranyC' label='Číslo smlouvy u smluvní strany C' />
        </Col>
      </Row>

      <Row>
        {/*<Col md={3}>*/}
        {/*  <SelectFilterInput name="referent" label="Referent" options={[*/}
        {/*    { label: 'A', value: 'a' },*/}
        {/*    { label: 'B', value: 'b' }*/}
        {/*  ]}/>*/}
        {/*</Col>*/}
        <Col md={3}>
          <TextFilterInput name='variableId' label='Variabilní symbol' />
        </Col>
        <Col md={3}>
          <DateFilterInput
            name={'data.financniKontrola.datumFinancniKontroly[gte]'}
            label='Datum finanční kontroly OD'
          />
        </Col>
        <Col md={3}>
          <DateFilterInput
            name={'data.financniKontrola.datumFinancniKontroly[lte]'}
            label='Datum finanční kontroly DO'
          />
        </Col>
        <Col md={3}>
          <TextFilterInput name='data.schvaleni.obec.cisloUsneseniObec' label='Číslo usnesení z obce' />
        </Col>
      </Row>

      <FilterBtns />
    </fieldset>
  )
}

export default FilterContracts
