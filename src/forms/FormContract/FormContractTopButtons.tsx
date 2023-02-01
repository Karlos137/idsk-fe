import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import { LINKS } from '../../components/App/LINKS'
import ButtonGov from '../../components/Btns/ButtonGov'
import ButtonGovConfirm from '../../components/Btns/ButtonGovConfirm'
import ButtonGovLink from '../../components/Btns/ButtonGovLink'
import { useFormContextBase } from '../../context/FormContext'
import { usePermissions } from '../../hooks/usePermissions'

interface iFormContractTopButtons {
  submissionId: string
}

const FormContractTopButtons = ({ submissionId }: iFormContractTopButtons) => {
  const navigate = useNavigate()
  const {
    canDeleteContract,
    canReadHistory,
    canEditContract,
    canEditAttachMain,
    canEditAttachUsneseni,
    canEditAttachOther,
  } = usePermissions()

  const canEditAttach = canEditAttachMain || canEditAttachUsneseni || canEditAttachOther
  const canEdit = canEditContract || canEditAttach

  const { editMode, setEditMode, nextKeyIndex } = useFormContextBase()

  const clickDelete = () => {
    EformsApi.deleteForm(submissionId)
      .then(() => {
        toast.success('Smlouva smazána')
        navigate(LINKS.prehledSmluv)
      })
      .catch((err) => {
        toast.error('Chyba smazání smlouvy')
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
        <ButtonGovLink variant='primary-outlined' className='me-3' to={LINKS.prehledSmluv}>
          Zpět na přehled
        </ButtonGovLink>

        {canReadHistory && (
          <ButtonGovLink
            variant='primary-outlined'
            className='me-3'
            to={LINKS.prehledSmluv + '/' + submissionId + LINKS.prehledSmluvHistorie}
          >
            Historie
          </ButtonGovLink>
        )}
        {canEdit && (
          <ButtonGov variant='primary' className='me-3' onClick={clickOpenEdit}>
            Editovat smlouvu a přílohy
          </ButtonGov>
        )}
      </div>
      <div className='text-end'>
        {canDeleteContract && (
          <ButtonGovConfirm
            variant='primary-outlined'
            confirmText='Opravdu smazat smlouvu?'
            className='button-delete'
            onClick={clickDelete}
          >
            Smazat smlouvu
          </ButtonGovConfirm>
        )}
      </div>
    </>
  )
}

export default FormContractTopButtons
