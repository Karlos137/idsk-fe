import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import { LINKS } from '../../components/App/LINKS'
import ButtonGov from '../../components/Btns/ButtonGov'
import ButtonGovConfirm from '../../components/Btns/ButtonGovConfirm'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import { useFormContextBase } from '../../context/FormContext'
import { removeLinkDavkaSmlouva } from '../../hooks/useFormActionsContractBatch'
import { usePermissionsBatch } from '../../hooks/usePermissionsBatch'

const FormContractBatchTopButtons = () => {
  const { submissionDataBatch, editMode, setEditMode, nextKeyIndex } = useFormContextBase()
  const id = submissionDataBatch.id
  const { canDeleteContractBatch, canEditContractBatch, canEditAttachUsneseniBatch, canEditAttachOtherBatch } =
    usePermissionsBatch()

  const canEditAttach = canEditAttachUsneseniBatch || canEditAttachOtherBatch
  const canEdit = canEditContractBatch || canEditAttach

  const navigate = useNavigate()

  const clickDelete = () => {
    removeLinkDavkaSmlouva(submissionDataBatch.data?.smlouvy || [])
    EformsApi.deleteForm(id)
      .then(() => {
        toast.success('Dávka smazána')
        navigate(LINKS.prehledDavekSmluv)
      })
      .catch((err) => {
        toast.error('Chyba smazání dávky')
      })
  }

  const clickCloseEdit = () => {
    nextKeyIndex()
    setEditMode(false)
  }

  const clickOpenEdit = () => {
    setEditMode(true)
  }

  if (editMode) {
    return (
      <>
        <div>
          <ButtonGov variant='primary-outlined' className='me-3' onClick={clickCloseEdit}>
            Zrušit
          </ButtonGov>
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <ButtonGovLink variant='primary-outlined' className='me-3' to={LINKS.prehledDavekSmluv}>
          Zpět na přehled
        </ButtonGovLink>
        {canEdit && (
          <ButtonGov variant='primary' className='me-3' onClick={clickOpenEdit}>
            Editovat dávku a přílohy
          </ButtonGov>
        )}
      </div>
      <div className='text-end'>
        {canDeleteContractBatch && (
          <ButtonGovConfirm
            variant='primary-outlined'
            confirmText='Opravdu smazat dávku?'
            className='button-delete'
            onClick={clickDelete}
          >
            Smazat dávku
          </ButtonGovConfirm>
        )}
      </div>
    </>
  )
}

export default FormContractBatchTopButtons
