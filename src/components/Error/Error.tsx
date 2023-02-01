import React from 'react'
import Alert from 'react-bootstrap/Alert'

interface iError {
  msg: string
}

const Error = ({ msg }: iError) => <Alert variant='danger'>{msg}</Alert>

export default Error
