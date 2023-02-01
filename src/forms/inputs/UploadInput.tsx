import React, { useCallback, useEffect, useState } from 'react'
import { ErrorCode, FileRejection, useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import FileLink from '../../components/FileLink/FileLink'
import { useFormContextBase } from '../../context/FormContext'
import { FILE_MIME_TYPE } from '../../enums/enumFileExts'
import { useEffectStart } from '../../hooks/useEffectStart'
import { iFileData } from '../../interfaces/typesEformsApi'

// todo omezeni typ souboru, velikost, pocet
//TODO pri chybe nahrani nebo spatneho souboru vyhodit chybu do formu

interface ExtFile {
  index: number
  name: string
  loading: boolean
  cancel?: boolean
  data?: iFileData
  error?: string // todo vypsani chyby
}

interface iUploadInput {
  prefix: string
  acceptFileExts: string[]
  onlyOne?: boolean
  disabled?: boolean
}

const UploadInput = ({ prefix, acceptFileExts, onlyOne, disabled }: iUploadInput) => {
  const { formFiles, setFormFilesByPath } = useFormContextBase()

  const disabledInput = disabled

  const [files, setFiles] = useState<ExtFile[]>([])
  const [progress, setProgress] = useState<number[]>([])

  const uploadingFiles = files.filter((file) => file.loading && !file.cancel)
  const uploadedFiles = files.filter((file) => file.data && !file.cancel)

  const acceptFileMimeTypes = Object.values(acceptFileExts)
    .map((ext) => FILE_MIME_TYPE[ext])
    .reduce((prev, cur) => ({ ...prev, [cur]: [] }), {})

  // todo nastaveni error kdyz je prazdne a povinne
  const error = '' //'Špatný formát souboru'

  useEffectStart(() => {
    const formFilesId = formFiles[prefix] //.map(file => file.publicId)
    console.log('def files', formFilesId)
    if (formFilesId?.length) {
      formFilesId.forEach((file, index: number) => {
        const fileIndex = index
        const newFile = {
          name: file.publicId,
          index: fileIndex,
          loading: true,
        }
        console.log('Load file ', newFile)
        setFiles((files: any) => [...files, newFile])
        setProgress((ps) => [...ps, 0])
        setFileAttrs(fileIndex, { data: file, loading: false })
      })
    }
  })

  //TODO pockat dokud se soubory nenahraji
  //TODO zpracovani chyb - spatny typ souboru, velikost atd
  // const loading = files?.some(file => file.loading)

  useEffect(() => {
    const attchs = uploadedFiles.map((file) => file.data!)
    setFormFilesByPath(prefix, attchs)
  }, [files])

  const setFileAttrs = (fileIndex: number, attrs: Partial<ExtFile>) => {
    setFiles((files) => files.map((file) => (file.index === fileIndex ? { ...files[fileIndex], ...attrs } : file)))
  }

  const clickCancelFile = (fileIndex: number) => {
    console.log('cancel file', fileIndex)
    setFileAttrs(fileIndex, { cancel: true })
  }

  const setFileProgress = (fileIndex: number, progress: number) => {
    setProgress((ps) => ps.map((p, index) => (index === fileIndex ? progress : p)))
  }

  const onDropReject = useCallback(
    (rejectedFiles: any) => {
      rejectedFiles.forEach((file: FileRejection) => {
        const err = file.errors[0].code
        if (err === ErrorCode.FileInvalidType) {
          toast.error('Nepovolený typ souboru: ' + file.file.name)
        } else {
          toast.error('Chyba souboru: ' + file.file.name)
        }
      })
      console.log('reject', rejectedFiles)
    },
    [files],
  )

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      console.log('Accept', acceptedFiles)

      const indexBase = files.length

      acceptedFiles.forEach((file: File, index: number) => {
        const fileIndex = indexBase + index

        console.log('ADD file', file)
        const newFile = {
          name: file.name,
          index: fileIndex,
          loading: true,
        }
        console.log('New file ', newFile)

        setFiles((files) => [...files, newFile])
        setProgress((ps) => [...ps, 0])

        EformsApi.uploadFile(file, 'custom', prefix, (event) => {
          const percent = Math.round((100 * event.loaded) / event.total)
          // console.log('Percent', percent)
          setFileProgress(fileIndex, percent)
        })
          .then((resFile) => {
            console.log('uplodat done pro index', fileIndex, files)
            setFileAttrs(fileIndex, { data: resFile })
          })
          .catch((err) => {
            console.log('chyba nahrani souboru', err)
            setFileAttrs(fileIndex, { error: 'Chyba uploadu' })
          })
          .finally(() => {
            setFileAttrs(fileIndex, { loading: false })
          })
      })
    },
    [files],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected: onDropReject,
    disabled: disabledInput,
    // validator: nameLengthValidator(file)
    multiple: !onlyOne,
    maxFiles: onlyOne ? 1 : 0,
    accept: acceptFileMimeTypes,
    noClick: true,
  })

  const fullFiles = onlyOne ? uploadedFiles.length + uploadingFiles.length : false
  const filesFormatInfo = acceptFileExts.join(', ').toUpperCase()
  const [isFolder, setIsFolder] = useState(false)
  const inputDirAttr = isFolder ? { webkitdirectory: '', directory: '' } : {}

  const FilesList = () => {
    if (disabledInput && !uploadedFiles.length && !uploadingFiles.length) {
      return <div> Žádné soubory </div>
    }
    return (
      <div>
        {uploadedFiles.map((file) => (
          <div key={file.index}>
            {file.data && <FileLink fileData={file.data} />}
            {!disabledInput && (
              <button type='button' onClick={() => clickCancelFile(file.index)}>
                X
              </button>
            )}
          </div>
        ))}

        {uploadingFiles.map((file) => (
          <div key={file.index}>
            {/*todo hezci loading*/}
            <span>Loading .... {progress[file.index]} </span>-{file.index}-{file.name}
            {!disabledInput && (
              <button type='button' onClick={() => clickCancelFile(file.index)}>
                X
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={'gov-form-control gov-fileinput ' + (error ? 'gov-form-control--error' : '')}>
      <FilesList />
      {/*<p className="gov-fileinput__label">*/}
      {/*  {label}*/}
      {/*</p>*/}

      {!disabledInput && !fullFiles && (
        <div className='gov-fileinput__upload' {...getRootProps()}>
          <input
            id={'file-' + prefix}
            {...getInputProps()}
            className='gov-fileinput__upload-input d-block'
            aria-required='false'
            aria-disabled='false'
            {...inputDirAttr}
          />
          <div className='gov-fileinput__upload-content'>
            <p className='gov-fileinput__upload-copy'>
              {isDragActive ? 'Přetáhněte soubory sem ...' : 'Přetáhněte soubor nebo'}
            </p>
            <label className='gov-button gov-button--primary-outlined gov-fileinput__upload-btn'>
              Nahrajte ze zařízení
            </label>
            <p className='gov-fileinput__upload-note'>podporované formáty {filesFormatInfo}</p>

            {!onlyOne && (
              <p className='gov-fileinput__upload-note' style={{ position: 'absolute', zIndex: 99, width: 200 }}>
                <input
                  checked={isFolder}
                  onChange={(e) => setIsFolder(e.target.checked)}
                  type='checkbox'
                  id={'isFolder' + prefix}
                />
                <label className='ms-2' htmlFor={'isFolder' + prefix}>
                  nahrát celou složku
                </label>
              </p>
            )}
          </div>
        </div>
      )}

      {/*<ul className="gov-fileinput__attachments">*/}
      {/*  <li>Přílohy</li>*/}
      {/*</ul>*/}
      {/*TODO error - zobrazit */}
      {error && <span className='gov-form-control__message'>{error}</span>}
    </div>
  )
}

export default UploadInput
