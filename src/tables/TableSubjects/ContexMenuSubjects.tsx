import React from 'react'
import { Item, Menu } from 'react-contexify'
import { useContextMenuApp } from '../../hooks/useContextMenuApp'

const ContexMenuSubjects = () => {
  const handleItemClick = ({ event, props, triggerEvent, data }: any) => {
    console.log(event, props, triggerEvent, data)
  }

  const { contextMenuData, contextName } = useContextMenuApp()

  return (
    <Menu id={contextName} animation={false}>
      <Item onClick={handleItemClick} data={'aaaaaaaaaaa'}>
        Item 1
      </Item>
      <Item onClick={handleItemClick}>Delete {contextMenuData.id}</Item>
      {/*<Separator/>*/}
      {/*<Item disabled>Disabled</Item>*/}
      {/*<Separator/>*/}
      {/*<Submenu label="Foobar">*/}
      {/*  <Item onClick={handleItemClick}>Sub Item 1</Item>*/}
      {/*  <Item onClick={handleItemClick}>Sub Item 2</Item>*/}
      {/*</Submenu>*/}
    </Menu>
  )
}

export default ContexMenuSubjects
