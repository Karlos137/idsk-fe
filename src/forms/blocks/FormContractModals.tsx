import React from 'react'
import ModalConvert from '../../components/Modal/ModalConvert'
import ModalDownload from '../../components/Modal/ModalDownload'
import ModalGenerateList from '../../components/Modal/ModalGenerateList'
import ModalSign from '../../components/Modal/ModalSign'
import ModalWrap from '../../components/Modal/ModalWrap'
import { MODAL_TYPE } from '../../hooks/useModal'

const FormContractModals = () => {
  return (
    <>
      <ModalWrap type={MODAL_TYPE.sign} title='Podepsat smlouvu'>
        <ModalSign />
      </ModalWrap>
      <ModalWrap type={MODAL_TYPE.convert} title='Konvertovat do PDF'>
        <ModalConvert />
      </ModalWrap>
      <ModalWrap type={MODAL_TYPE.download} title='Stažení souborů'>
        <ModalDownload />
      </ModalWrap>
      <ModalWrap type={MODAL_TYPE.generate} title='Vygenerovat soupisku smluv'>
        <ModalGenerateList />
      </ModalWrap>
    </>
  )
}

export default FormContractModals
