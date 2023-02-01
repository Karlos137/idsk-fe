import React, { useCallback, useState } from 'react'
import { ErrorCode, FileRejection, useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import ButtonGovConfirm from '../../components/Btns/ButtonGovConfirm'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { AvatarData, loadAvatar } from '../../utils/loadAvatar'

//TODO test na velikost pred uploadem

const AvatarBlock = () => {
  const { data, error, loading, fetchData } = useFetch<AvatarData>(() => loadAvatar())

  const hasImage = !!data?.avatarId

  const [loadingAction, setLoadingAction] = useState(false)

  const clickDelete = () => {
    if (!hasImage) {
      return
    }
    setLoadingAction(true)
    IamApi.deleteAvatar(data.avatarId)
      .then((_) => {
        toast.success('Avatar smazán')
      })
      .catch((_) => {
        toast.error('Chyba smazání avatara')
      })
      .finally(() => {
        fetchData()
        setLoadingAction(false)
      })
  }

  const onDropReject = useCallback((rejectedFiles: any) => {
    rejectedFiles.forEach((file: FileRejection) => {
      const err = file.errors[0].code
      if (err === ErrorCode.FileInvalidType) {
        toast.error('Nepovolený typ souboru: ' + file.file.name)
      } else {
        toast.error('Chyba souboru: ' + file.file.name)
      }
    })
    console.log('reject', rejectedFiles)
  }, [])

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log('Accept', acceptedFiles)
    setLoadingAction(true)

    acceptedFiles.forEach((file: File) => {
      IamApi.uploadAvatar(file)
        .then((data) => {
          toast.success('Avatar úspěšně nahrán')
        })
        .catch((err) => {
          const msg =
            err.response?.data?.error.code === 2204
              ? 'Podpisový avatar je již nastaven. Pokud chcete nastavit nový, smažte nejprve současný.'
              : 'Chyba nahrání avatara'
          toast.error(msg)
        })
        .finally(() => {
          fetchData()
          setLoadingAction(false)
        })
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected: onDropReject,
    multiple: false,
    maxFiles: 1,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    noClick: true,
  })

  const filesFormatInfo = 'PNG, JPG'
  const errorInput = false

  if (error) {
    return <Error msg={'Chyba načtení souboru'} />
  }
  if (loading || loadingAction) {
    return <Loading />
  }

  return (
    <fieldset>
      <legend>Profilový obrázek uživatele</legend>

      {hasImage ? (
        <>
          <div className='mb-3'>
            <img src={data.base64} alt='Avatar' style={{ maxWidth: 400 }} />
          </div>
          <ButtonGovConfirm variant='primary-outlined' confirmText={'Opravdu smazat avatara?'} onClick={clickDelete}>
            Smazat
          </ButtonGovConfirm>
        </>
      ) : (
        <div className={'gov-form-control gov-fileinput ' + (errorInput ? 'gov-form-control--error' : '')}>
          <div className='gov-fileinput__upload' {...getRootProps()}>
            <input
              id={'file-avatar'}
              {...getInputProps()}
              className='gov-fileinput__upload-input d-block'
              aria-required='false'
              aria-disabled='false'
            />
            <div className='gov-fileinput__upload-content'>
              <p className='gov-fileinput__upload-copy'>
                {isDragActive ? 'Přetáhněte soubory sem ...' : 'Přetáhněte soubor nebo'}
              </p>
              <label className='gov-button gov-button--primary-outlined gov-fileinput__upload-btn'>
                Nahrajte ze zařízení
              </label>
              <p className='gov-fileinput__upload-note'>podporované formáty {filesFormatInfo}</p>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  )
}

export default AvatarBlock
