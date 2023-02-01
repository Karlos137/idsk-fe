import React, { useState } from 'react'
import { toast } from 'react-toastify'
import StckApi from '../../api/StckApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase } from '../../context/FormContext'
import { CONTRACT_TYPES } from '../../enums/enumContractTypes'
import { FILE_EXTENSION } from '../../enums/enumFileExts'
import { WORKFLOW_PLACES as WP } from '../../enums/enumWorkflowPlaces'
import { usePermissions } from '../../hooks/usePermissions'
import { ATTACH_SUBTYPE_SMLOUVA_PROPSANO } from '../blocks/UploadBlock'

const ActionProccessTemplateBlock = () => {
  const [loading, setLoading] = useState(false)
  const { fileMainContract, nextKeyIndex, submissionVersionId, editMode, submissionData } = useFormContextBase()
  const { canTemplateToDoc } = usePermissions()
  const place = submissionData.workflowPlaceCode
  const contractType = submissionData.data?.typ

  const isKraj =
    [CONTRACT_TYPES.P03, CONTRACT_TYPES.P05].includes(contractType) ||
    (contractType === CONTRACT_TYPES.P01 && [WP.KE_SCHVALENI_KRAJ, WP.PRIPRAVA_K_PODPISU_DAVKA].includes(place))

  if (
    !fileMainContract ||
    !canTemplateToDoc ||
    fileMainContract.subtype === ATTACH_SUBTYPE_SMLOUVA_PROPSANO ||
    editMode
  ) {
    return null
  }
  const isDocx = !!fileMainContract && [FILE_EXTENSION.DOCX].indexOf(fileMainContract.file.extension) !== -1

  if (!isDocx) {
    return <div>Propsat data usnesení lze pouze do souboru formátu DOCX</div>
  }

  if (loading) {
    return <Loading />
  }

  const proccessDocumentTempalte = () => {
    if (!fileMainContract?.id) {
      toast.error('Smlouva neobsahuje žádný dokument')
      return
    }

    if (isKraj) {
      const schvaleniKraj = submissionData.data.schvaleni?.kraj
      if (!schvaleniKraj?.cisloUsneseniKraj) {
        toast.error('Chybí číslo usnesení z kraje')
        return
      }
      if (!schvaleniKraj?.datumUsneseniKraj) {
        toast.error('Chybí datum usnesení z kraje')
        return
      }
    } else {
      const schvaleniObec = submissionData.data.schvaleni?.obec
      if (!schvaleniObec?.cisloUsneseniObec) {
        toast.error('Chybí číslo usnesení z obce')
        return
      }
      if (!schvaleniObec?.datumUsneseniObec) {
        toast.error('Chybí datum usnesení z obce')
        return
      }
    }

    setLoading(true)
    StckApi.proccessDocxTemplate(submissionVersionId, fileMainContract.id)
      .then((data) => {
        //TODO if code 204 -> zadna zmena smlouvy
        toast.success('Hodnoty propsány do dokumentu smlouvy')
        nextKeyIndex()
      })
      .catch((err) => {
        toast.error('Nezdařilo se propsat hodnoty do dokumentu smluvy')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <ButtonGov variant='primary' className='me-5 mb-3' onClick={() => proccessDocumentTempalte()}>
        Propsat hodnoty usnesení do dokumentu smlouvy
      </ButtonGov>
    </div>
  )
}

export default ActionProccessTemplateBlock
