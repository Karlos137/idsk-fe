import React from 'react'
import Alert from 'react-bootstrap/Alert'

interface iNoData {
  msg?: string
}

const NoData = ({ msg = 'Žádná data' }: iNoData) => {
  return (
    <Alert variant='info' className='text-center'>
      <Alert.Heading>{msg}</Alert.Heading>
    </Alert>
  )
}

export default NoData
