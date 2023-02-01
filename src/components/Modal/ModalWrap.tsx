import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { useModal } from '../../hooks/useModal'

interface iModalWrap {
  type: string
  title: string
  children?: React.ReactNode
}

const ModalWrap = ({ type, title, children }: iModalWrap) => {
  const { open, closeModal } = useModal()

  return (
    <Modal show={open === type} onHide={closeModal} size='lg' centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      {children}

      {/*<Modal.Body>*/}
      {/*  {children}*/}
      {/*</Modal.Body>*/}
      {/*<Modal.Footer>*/}
      {/*  <Button variant="secondary" onClick={closeModal}>*/}
      {/*    Close*/}
      {/*  </Button>*/}
      {/*  <Button variant="primary" onClick={closeModal}>*/}
      {/*    Save Changes*/}
      {/*  </Button>*/}
      {/*</Modal.Footer>*/}
    </Modal>
  )
}

export default ModalWrap
