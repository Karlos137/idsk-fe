import { useSelector } from 'react-redux'
import { setModalClose, setModalOpen } from '../redux/global/globalSlice'
import { selectModalOpen } from '../redux/global/selectors'
import { useAppDispatch } from '../redux/store'

export const MODAL_TYPE = {
  sign: 'sign',
  convert: 'convert',
  download: 'download',
  generate: 'generate',
}

export const useModal = () => {
  const dispatch = useAppDispatch()

  const open = useSelector(selectModalOpen)

  const closeModal = () => {
    dispatch(setModalClose())
  }

  const openModal = (type: string) => {
    dispatch(setModalOpen(type))
  }

  const openModalSign = () => openModal(MODAL_TYPE.sign)
  const openModalConvert = () => openModal(MODAL_TYPE.convert)
  const openModalDownload = () => openModal(MODAL_TYPE.download)
  const openModalGenerate = () => openModal(MODAL_TYPE.generate)

  return { open, openModal, closeModal, openModalSign, openModalConvert, openModalDownload, openModalGenerate }
}
