import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const Loading = () => (
  <div className='text-center my-5'>
    <Spinner className='m-2' animation='grow' variant='primary' />
    <Spinner className='m-2' animation='grow' variant='primary' />
    <Spinner className='m-2' animation='grow' variant='primary' />
  </div>
)

export default Loading
