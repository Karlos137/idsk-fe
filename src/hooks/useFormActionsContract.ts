import { joiResolver } from '@hookform/resolvers/joi/dist/joi'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import EformsApi, { ORG_IDSK, SLUG_FORM_SMLOUVA } from '../api/EformsApi'
import { LINKS } from '../components/App/LINKS'
import { useFormContextBase } from '../context/FormContext'
import { iSchemaContract, schemaContract } from '../forms/FormContract/SchemeContract'
import { joiResolverOptions } from '../forms/joiResolverOptions'
import { iSubmissionDataContract } from '../interfaces/ISubmissionData'
import { selectUserOrg } from '../redux/user/selectors'
import { useTestIsLastSubmission } from './useTestIsLastSubmission'

export const useFormActionsContract = (id?: string) => {
  const [dataLoading, setDataLoading] = useState(!!id)
  const { testIsLastSubmission } = useTestIsLastSubmission()
  const { setEditMode } = useFormContextBase()
  const org = useSelector(selectUserOrg)
  const orgID = org?.id || ORG_IDSK

  const methods = useForm<iSchemaContract>({
    resolver: joiResolver(schemaContract, joiResolverOptions),
    shouldUnregister: true,
  })

  const setFormData = (data?: iSubmissionDataContract) => {
    const fomVal = data?.data
    if (fomVal) {
      methods.reset(fomVal)
      setDataLoading(false)
    }
  }

  const navigate = useNavigate()
  const { _getFilesIds, nextKeyIndex } = useFormContextBase()

  const onSubmitAction = async (data: iSchemaContract) => {
    const attachmentsIDs = _getFilesIds()

    //TODO - dodatek - data.rodicovskaSmlouva - pridat jako parentID??
    // TODO zmenit/nastavit referenta/vlastnika?
    const organizations = [
      data.subjektStranyA?.id, // todo - neposilat pokud to je IDSK, tzn vlastnik formulare
      data.subjektStranyB?.id,
      data.subjektStranyC?.id,
    ].filter((id) => !!id) as string[]

    if (id) {
      const isLast = await testIsLastSubmission()
      if (!isLast) {
        return
      }
      EformsApi.updateForm(id, data, attachmentsIDs, organizations)
        .then((_) => {
          toast.success('Smlouva uložena')
          nextKeyIndex()
          setEditMode(false)
        })
        .catch((err) => {
          console.log('chyba upraveni formu', err)
          toast.error('Chyba úpravy formuláře')
        })
    } else {
      EformsApi.newForm(SLUG_FORM_SMLOUVA, orgID, data, attachmentsIDs, organizations)
        .then((data) => {
          toast.success('Smlouva vytvořena')
          setEditMode(false)
          navigate(LINKS.prehledSmluv + '/' + data.id)
        })
        .catch((err) => {
          console.log('chyba vytvoreni formu', err)
          toast.error('Chyba vytvoření smlouvy')
        })
    }
    console.log(data)
  }

  return { onSubmitAction, setFormData, methods, dataLoading }
}
