import React from 'react'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown'

const DropdownToogleDots = () => (
  <Dropdown.Toggle variant='' className='no-after text-primary'>
    <ThreeDotsVertical size={20} />
  </Dropdown.Toggle>
)

export default DropdownToogleDots
