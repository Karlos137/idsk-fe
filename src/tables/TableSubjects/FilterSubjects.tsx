import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useFilterContext } from '../../context/FilterContext'
import CheckFilterInput from '../filterInputs/CheckFilterInput'
import FilterBtns from '../filterInputs/FilterBtns'
import TextFilterInput from '../filterInputs/TextFilterInput'

const FilterSubjects = () => {
  const { openFilter } = useFilterContext()

  if (!openFilter) {
    return null
  }

  return (
    <fieldset className='mb-4'>
      <Row>
        <Col md={3}>
          <TextFilterInput name='name' label='Název' />
        </Col>
        {/*<Col md={3}>*/}
        {/*  <TextFilterInput name='ic' label='IČ - todo' />*/}
        {/*</Col>*/}
        {/*<Col md={3}>*/}
        {/*  <TextFilterInput name='subjects' label='Obce z adresy - todo' />*/}
        {/*</Col>*/}
      </Row>

      {/*<Row>*/}
      {/*  <Col md={3}>*/}
      {/*    <TextFilterInput name='contactName' label='Příjmení kontaktní osoby - todo' />*/}
      {/*  </Col>*/}
      {/*  <Col md={3}>*/}
      {/*    <TextFilterInput name='contactEmail' label='Email kontaktní osoby  - todo' type='email' />*/}
      {/*  </Col>*/}
      {/*  <Col md={3}>*/}
      {/*    <TextFilterInput name='contactTel' label='Telefon kontaktní ososby - todo' />*/}
      {/*  </Col>*/}
      {/*  <Col md={3}>*/}
      {/*    <CheckFilterInput name='withDleted' label='Včetně smazaných subjektů - todo' />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      <FilterBtns />
    </fieldset>
  )
}

export default FilterSubjects
