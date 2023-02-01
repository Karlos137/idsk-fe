import { joiResolver } from '@hookform/resolvers/joi/dist/joi'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import EformsApi, { ORG_IDSK, SLUG_FORM_DAVKA, SLUG_FORM_SMLOUVA } from '../api/EformsApi'
import { LINKS } from '../components/App/LINKS'
import { useFormContextBase } from '../context/FormContext'
import { WORKFLOW_PLACES as WP } from '../enums/enumWorkflowPlaces'
import { iSchemaContractBatch, schemaContractBatch } from '../forms/FormContractBatch/SchemeContractBatch'
import { joiResolverOptions } from '../forms/joiResolverOptions'
import { iSubmissionDataContract, iSubmissionDataContractBatch } from '../interfaces/ISubmissionData'
import { selectUserOrg } from '../redux/user/selectors'
import { useTestIsLastSubmission } from './useTestIsLastSubmission'

const PATH_ATTR_DAVKA_ID = '/davkaId'
export const setLinkDavkaSmlouva = (contractIds: string[], batchId: string) => {
  if (contractIds.length) {
    const dataJsonPatchAdd = [{ op: 'add', path: PATH_ATTR_DAVKA_ID, value: batchId }]
    EformsApi.bulkEdit(SLUG_FORM_SMLOUVA, { id: contractIds }, dataJsonPatchAdd, WP.KE_SCHVALENI_KRAJ_DAVKA).catch(() =>
      toast.error('Chyba přiřázení smluv do dávky'),
    )
  }
}

export const removeLinkDavkaSmlouva = (contractIds: string[]) => {
  if (contractIds.length) {
    const dataJsonPatchRemove = [{ op: 'remove', path: PATH_ATTR_DAVKA_ID }]
    EformsApi.bulkEdit(SLUG_FORM_SMLOUVA, { id: contractIds }, dataJsonPatchRemove, WP.PRIPRAVA_DAVKY).catch(() =>
      toast.error('Chyba odebrání smluv z dávky'),
    )
  }
}

export const useFormActionsContractBatch = (id?: string) => {
  const [dataLoading, setDataLoading] = useState(!!id)
  const { testIsLastSubmission } = useTestIsLastSubmission()
  const { submissionDataBatch, setEditMode } = useFormContextBase()
  const org = useSelector(selectUserOrg)
  const orgID = org?.id || ORG_IDSK

  const methods = useForm<iSchemaContractBatch>({
    resolver: joiResolver(schemaContractBatch, joiResolverOptions),
    shouldUnregister: true,
  })

  const setFormData = (data?: iSubmissionDataContractBatch) => {
    const fomVal = data?.data
    if (fomVal) {
      methods.reset(fomVal)
      setDataLoading(false)
    }
  }

  const navigate = useNavigate()
  const { _getFilesIds, nextKeyIndex } = useFormContextBase()

  const onSubmitAction = async (data: iSchemaContractBatch, childContracts: iSubmissionDataContract[]) => {
    const attachmentsIDs = _getFilesIds()

    const oldContracts = submissionDataBatch?.data?.smlouvy || []
    const addContracts = childContracts.map((c) => c.id).filter((cid) => oldContracts.every((ocid) => ocid !== cid))
    const removeContracts = oldContracts.filter((cid) => childContracts.every((c) => c.id !== cid))

    const setParentContracts = (davkaId: string) => {
      //TODO pockat na vykonani dotazu
      setLinkDavkaSmlouva(addContracts, davkaId)
      removeLinkDavkaSmlouva(removeContracts)
    }

    if (addContracts.length) {
      const contractsToAdd = await EformsApi.getSubmissionsSearch(SLUG_FORM_SMLOUVA, 1, 200, { id: addContracts })
      for (const contract of contractsToAdd.data as iSubmissionDataContract[]) {
        if (contract.data.davkaId) {
          toast.error(`Smlouva '${contract.data.smlouvaInfo?.nazev}' je již přiřazená k jiné dávce`)
          return
        }
      }
    }

    if (id) {
      const isLast = await testIsLastSubmission()
      if (!isLast) {
        return
      }
      EformsApi.updateForm(id, data, attachmentsIDs)
        .then((_) => {
          toast.success('Dávka uložena')
          setParentContracts(id)
          nextKeyIndex()
          setEditMode(false)
        })
        .catch((err) => {
          console.log('chyba upraveni davky', err)
          toast.error('Chyba úpravy dávky')
        })
    } else {
      EformsApi.newForm(SLUG_FORM_DAVKA, orgID, data, attachmentsIDs)
        .then((data) => {
          toast.success('Dávka vytvořena')
          setParentContracts(data.id)
          setEditMode(false)
          navigate(LINKS.prehledDavekSmluv + '/' + data.id)
        })
        .catch((err) => {
          console.log('chyba vytvoreni davky', err)
          toast.error('Chyba vytvoření dávky')
        })
    }
    console.log(data)
  }

  return { onSubmitAction, setFormData, methods, dataLoading }
}
