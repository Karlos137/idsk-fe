import React from 'react'
import ButtonGov from '../../components/Btns/ButtonGov'
import { useFormContextBase } from '../../context/FormContext'
import { useModal } from '../../hooks/useModal'
import { usePermissionsBatch } from '../../hooks/usePermissionsBatch'

const FILE_GENERATED_NAME = 'soupiska-pro-radu-kraje'

const ActionGenerateListBlock = () => {
  const { openModalGenerate } = useModal()
  const { editMode, filesOther } = useFormContextBase()
  const exist = filesOther?.some((file) => (file.file.safeName = FILE_GENERATED_NAME))

  const { canGenerateList } = usePermissionsBatch()

  if (!canGenerateList || editMode || exist) {
    return null
  }

  return (
    <ButtonGov variant='primary' className='me-5' onClick={openModalGenerate}>
      Vygenerovat soupisku smluv
    </ButtonGov>
  )
}

export default ActionGenerateListBlock
