import React, { useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import Loading from '../../components/Loading/Loading'
import { useFormContextBase } from '../../context/FormContext'
import { documentStateByWorkflow } from '../../enums/enumDocumentsState'
import { FILE_EXTENSION } from '../../enums/enumFileExts'
import { useEffectStart } from '../../hooks/useEffectStart'
import { usePermissions } from '../../hooks/usePermissions'
import { usePermissionsBatch } from '../../hooks/usePermissionsBatch'
import ActionConvertBlock from '../blockAction/ActionConvertBlock'
import ActionDownloadBlock from '../blockAction/ActionDownloadBlock'
import ActionSignBlock from '../blockAction/ActionSignBlock'
import UploadInput from '../inputs/UploadInput'

export const ATTACH_SUBTYPE = {
  SMLOUVA: 'smlouva',
  PRILOHA: 'priloha',
  USNESENI: 'usneseni',
}

export const ATTACH_SUBTYPE_SMLOUVA_PROPSANO = 'smlouva-propsano'

interface iUploadBlock {
  isBatch?: boolean
}

const UploadBlock = ({ isBatch }: iUploadBlock) => {
  const [atchLoaded, setAtchLoaded] = useState(false)

  const { fileMainContract, setFormFilesByPath, submissionData, submissionVersionId, editMode } = useFormContextBase()
  const { canEditAttachMain, canEditAttachUsneseni, canEditAttachOther } = usePermissions()
  const { canEditAttachUsneseniBatch, canEditAttachOtherBatch } = usePermissionsBatch()

  useEffectStart(() => {
    if (submissionVersionId) {
      EformsApi.getAttachments(submissionVersionId)
        .then((data) => {
          const sortFiles = data.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
          Object.values(ATTACH_SUBTYPE).forEach((type) => {
            const files = sortFiles.filter((d) => d.subtype?.startsWith(type))
            setFormFilesByPath(type, files)
          })
        })
        .catch(() => {
          toast.error('Chyba načtení souborů')
        })
        .finally(() => {
          setAtchLoaded(true)
        })
    } else {
      setAtchLoaded(true)
    }
  })

  if (!atchLoaded) {
    return <Loading />
  }

  const docState = documentStateByWorkflow(submissionData.workflowPlaceCode, submissionData.data?.pomocnaPocetPodpisu)

  return (
    <>
      <>
        {!isBatch && (
          <fieldset>
            <legend>Smlouva</legend>

            {fileMainContract && (
              <div className='mb-3'>
                Stav dokumentu: <Badge>{docState}</Badge>
              </div>
            )}
            <UploadInput
              acceptFileExts={[FILE_EXTENSION.DOCX]}
              onlyOne={true}
              prefix={ATTACH_SUBTYPE.SMLOUVA}
              disabled={!editMode || !canEditAttachMain}
            />
            {fileMainContract && (
              <>
                <ActionConvertBlock />

                <ActionSignBlock />
              </>
            )}
          </fieldset>
        )}
        <fieldset>
          <legend>{'Usnesení'}</legend>
          <UploadInput
            acceptFileExts={[FILE_EXTENSION.PDF, FILE_EXTENSION.DOCX]}
            onlyOne={true}
            prefix={ATTACH_SUBTYPE.USNESENI}
            disabled={!editMode || (isBatch ? !canEditAttachUsneseniBatch : !canEditAttachUsneseni)}
          />
        </fieldset>
      </>

      <fieldset>
        <legend>{isBatch ? 'Přílohy k dávce smluv' : 'Soubory související se smlouvou / smluvním dodatkem'}</legend>
        <UploadInput
          acceptFileExts={[FILE_EXTENSION.PDF, FILE_EXTENSION.DOCX, FILE_EXTENSION.XLSX]}
          prefix={ATTACH_SUBTYPE.PRILOHA}
          disabled={!editMode || (isBatch ? !canEditAttachOtherBatch : !canEditAttachOther)}
        />
      </fieldset>
      <ActionDownloadBlock />
    </>
  )
}

export default UploadBlock
