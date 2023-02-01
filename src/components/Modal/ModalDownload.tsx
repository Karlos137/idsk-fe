import fileDownload from 'js-file-download'
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import EformsApi from '../../api/EformsApi'
import { useFormContextBase } from '../../context/FormContext'
import { ATTACH_SUBTYPE } from '../../forms/blocks/UploadBlock'
import { useEffectStart } from '../../hooks/useEffectStart'
import { useModal } from '../../hooks/useModal'
import { iFileData } from '../../interfaces/typesEformsApi'
import ButtonGov from '../Btns/ButtonGov'
import ErrorBlock from '../Error/Error'
import FileLink from '../FileLink/FileLink'
import InputGov from '../Inputs/InputGov'
import Loading from '../Loading/Loading'

const ModalDownload = () => {
  const { submissionData, submissionDataBatch, submissionVersionId, isBatch } = useFormContextBase()
  const name = isBatch ? submissionDataBatch.data.davkaInfo.nazev : submissionData.variableId

  const { closeModal } = useModal()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isInit, setIsInit] = useState(false)
  const [archiveFilename, setArchiveFilename] = useState((isBatch ? 'davka_' + name : 'smlouva_' + name) + '_prilohy')

  const [formFiles, setFormFiles] = useState<{ [type: string]: iFileData[] }>({})

  const [checked, setChecked] = useState<string[]>([])

  useEffectStart(() => {
    initDownload()
  })

  const initDownload = () => {
    setLoading(true)
    setError('')
    EformsApi.getAttachments(submissionVersionId)
      .then((data) => {
        const sortFiles = data.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
        Object.values(ATTACH_SUBTYPE).forEach((type) => {
          const files = sortFiles.filter((d) => d.subtype?.startsWith(type))
          setFormFiles((f) => ({ ...f, [type]: files }))
        })
        setIsInit(true)
      })
      .catch(() => {
        setError('Chyba načtení souborů ke stáhnutí')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const clickDownload = () => {
    setLoading(true)
    setError('')
    const aFilename = archiveFilename ? archiveFilename + '.zip' : 'archiv_priloh.zip'
    EformsApi.downloadFiles(submissionVersionId, checked, aFilename)
      .then((data) => {
        fileDownload(data, aFilename)
      })
      .catch((err) => {
        setError('Chyba stažení souborů.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return <Loading />
  }

  const switchChecked = (id: string) => {
    if (checked.includes(id)) {
      setChecked((checked) => [...checked.filter((cid) => cid !== id)])
    } else {
      setChecked((checked) => [...checked, id])
    }
  }

  const ModalBody = () => {
    if (error) {
      return <ErrorBlock msg={error} />
    }

    return (
      <div>
        Vyberte soubory ke stažení:
        <br />
        {[
          { title: 'Smlouva', files: formFiles[ATTACH_SUBTYPE.SMLOUVA] || [] },
          { title: 'Usnesení', files: formFiles[ATTACH_SUBTYPE.USNESENI] || [] },
          { title: 'Další soubory', files: formFiles[ATTACH_SUBTYPE.PRILOHA] || [] },
        ].map(({ title, files }, index) => (
          <div key={index} className='mb-3 ms-3'>
            <strong>{title}</strong>
            {files.map((file) => (
              <div className='ms-3' key={file.id}>
                <span className='gov-form-control gov-form-control--custom'>
                  <input
                    id={'check-' + file.id}
                    className='gov-form-control__checkbox'
                    type='checkbox'
                    checked={checked.includes(file.id)}
                    onChange={(e) => switchChecked(file.id)}
                    name={file.id}
                    aria-required='false'
                    aria-disabled='false'
                  />
                  <label className='gov-form-control__label' htmlFor={'check-' + file.id}>
                    &nbsp;
                  </label>
                  <span className='gov-form-control__indicator'></span>
                </span>

                <FileLink fileData={file} />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const ModalBtn = () => {
    if (isInit) {
      return (
        <ButtonGov disabled={checked.length === 0} variant='primary' onClick={clickDownload}>
          Stáhnout
        </ButtonGov>
      )
    } else {
      return (
        <ButtonGov variant='primary' onClick={initDownload}>
          Načíst znovu
        </ButtonGov>
      )
    }
  }

  return (
    <>
      <Modal.Body>
        <ModalBody />
      </Modal.Body>
      <Modal.Footer>
        <div style={{ width: 350 }}>
          <InputGov
            label={'Název archivu'}
            name={'archiveFilename'}
            onChange={(e) => setArchiveFilename(e.target.value)}
            value={archiveFilename}
          />
        </div>
        <ModalBtn />
        <ButtonGov onClick={closeModal}>Zrušit</ButtonGov>
      </Modal.Footer>
    </>
  )
}

export default ModalDownload
