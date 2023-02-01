import React from 'react'
import ButtonGov from '../../components/Btns/ButtonGov'
import { useFormContextBase } from '../../context/FormContext'
import { FILE_EXTENSION } from '../../enums/enumFileExts'
import { useModal } from '../../hooks/useModal'
import { usePermissions } from '../../hooks/usePermissions'

const ActionSignBlock = () => {
  const { fileMainContract } = useFormContextBase()
  const { openModalSign } = useModal()

  const { canSign } = usePermissions()

  if (!fileMainContract || !canSign) {
    return null
  }
  const isPdf = !!fileMainContract && [FILE_EXTENSION.PDF].indexOf(fileMainContract.file.extension) !== -1

  if (!isPdf) {
    return <div>Podepsat lze pouze soubory formátu PDF</div>
  }

  return (
    <>
      <ButtonGov variant='primary' onClick={openModalSign}>
        Podepsat smlouvu
      </ButtonGov>
    </>
  )
}

export default ActionSignBlock
