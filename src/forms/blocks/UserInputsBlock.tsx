import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import TextInput from '../inputs/TextInput'

export function UserInputsBlock() {
  return (
    <>
      <Row>
        <Col lg={6}>
          <TextInput name='titleBefore' label='Titul před jménem' />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TextInput name='name' label='Jméno' required />
        </Col>
        <Col lg={6}>
          <TextInput name='name2' label='Prostřední jméno' />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TextInput name='surname' label='Příjmení' required />
        </Col>
        <Col lg={6}>
          <TextInput name='titleAfter' label='Titul za jménem' />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <TextInput name='email' label='E-mail' required />
        </Col>
        <Col lg={6}>
          <TextInput name='phone' label='Telefon' required />
        </Col>
      </Row>
    </>
  )
}
