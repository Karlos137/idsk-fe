import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useFilterContext } from '../../context/FilterContext'
import CheckFilterInput from '../filterInputs/CheckFilterInput'
import FilterBtns from '../filterInputs/FilterBtns'
import TextFilterInput from '../filterInputs/TextFilterInput'

const FilterDso = () => {
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
        {/*  TODO*/}
        {/*  <TextFilterInput name='ic' label='IČ' />*/}
        {/*</Col>*/}
        {/*<Col md={3}>*/}
        {/*  TODO*/}
        {/*  <TextFilterInput name='subjects' label='Obce' />*/}
        {/*</Col>*/}
        {/*<Col md={3}>*/}
        {/*  TODO*/}
        {/*  <CheckFilterInput name='withDleted' label='Včetně smazaných DSO' />*/}
        {/*</Col>*/}
      </Row>

      <FilterBtns />
    </fieldset>
  )
}

export default FilterDso
