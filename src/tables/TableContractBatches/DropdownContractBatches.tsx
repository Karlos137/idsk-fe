import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownToogleDots from '../../components/DropdownToogleDots/DropdownToogleDots'

const DropdownContractBatches = () => {
  return (
    <Dropdown>
      <DropdownToogleDots />
      <Dropdown.Menu>
        {/*<Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>*/}
        <Dropdown.Item as='button' onClick={() => {}}>
          Action
        </Dropdown.Item>
        <Dropdown.Item as='button'>Another action</Dropdown.Item>
        <Dropdown.Item as='button'>Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DropdownContractBatches
