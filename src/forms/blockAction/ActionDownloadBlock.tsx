import React from 'react'
import ButtonGov from '../../components/Btns/ButtonGov'
import { useFormContextBase } from '../../context/FormContext'
import { useModal } from '../../hooks/useModal'

const ActionDownloadBlock = () => {
  const { formFiles, editMode } = useFormContextBase()
  const files = Object.values(formFiles)
    .filter((files) => files.length)
    .concat()
  const { openModalDownload } = useModal()

  if (!files.length || editMode) {
    return null
  }

  return (
    <>
      <ButtonGov variant='primary' onClick={openModalDownload}>
        Stáhnout přílohy
      </ButtonGov>
    </>
  )
}

export default ActionDownloadBlock
