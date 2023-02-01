import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useFilterContext } from '../../context/FilterContext'
import { userStatesAllOptions } from '../../enums/enumUserStates'
import { useUserRolesTypes } from '../../hooks/useUserRolesTypes'
import FilterBtns from '../filterInputs/FilterBtns'
import SelectFilterInput from '../filterInputs/SelectFilterInput'
import SuggestSubjectsFilterInput from '../filterInputs/SuggestSubjectsFilterInput'
import SuggestUsersAttrFilterInput from '../filterInputs/SuggestUsersAttrFilterInput'

const FilterUsers = () => {
  const { openFilter } = useFilterContext()
  const { userRolesTypesOptions } = useUserRolesTypes()

  if (!openFilter) {
    return null
  }

  return (
    <fieldset className='mb-4'>
      <Row>
        <Col md={6}>
          <SuggestSubjectsFilterInput name='organization' label='Subjekt' />
        </Col>
        <Col md={3}>
          <SelectFilterInput name='accountStatus' label='Stav' options={userStatesAllOptions} />
        </Col>
        <Col md={3}>
          <SelectFilterInput name='userRoles.role.identifier' label='Role' options={userRolesTypesOptions} />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <SuggestUsersAttrFilterInput name='firstName' label='Jméno' />
        </Col>
        <Col md={3}>
          <SuggestUsersAttrFilterInput name='lastName' label='Příjmení' />
        </Col>
        <Col md={3}>
          <SuggestUsersAttrFilterInput name='username' label='Login' />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <SuggestUsersAttrFilterInput name='email' label='E-mail' />
        </Col>
        <Col md={3}>
          <SuggestUsersAttrFilterInput name='phone' label='Telefon' />
        </Col>
      </Row>

      {/*<Row>*/}
      {/*  <Col md={3}>*/}
      {/*    TODO*/}
      {/*    <DateFilterInput name='lastLoginFrom' label='Poslední přihlášení OD' />*/}
      {/*  </Col>*/}
      {/*  <Col md={3}>*/}
      {/*    TODO*/}
      {/*    <DateFilterInput name='lastLoginTo' label='Poslední přihlášení DO' />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      <FilterBtns />
    </fieldset>
  )
}

export default FilterUsers
