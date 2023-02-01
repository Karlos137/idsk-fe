import React, { useState } from 'react'
import { toast } from 'react-toastify'
import EformsApi from '../../api/EformsApi'
import ButtonGov from '../../components/Btns/ButtonGov'
import Error from '../../components/Error/Error'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { iCommnetData } from '../../interfaces/ICommnetData'
import { dateFormatFull } from '../../utils/dateFormat'

interface iHistoryBlock {
  id: string
}

const CommentsBlock = ({ id }: iHistoryBlock) => {
  const { data, error, loading, fetchData } = useFetch<iCommnetData[]>(() => EformsApi.getSubmissionComments(id))

  const [msg, setMsg] = useState('')

  const [loadingAdd, setLoadingAdd] = useState(false)
  const send = () => {
    setLoadingAdd(true)
    EformsApi.addSubmissionComment(id, msg)
      .then((data) => {
        toast.success('Komentář přidán')
        setMsg('')
        fetchData()
      })
      .catch((err) => {
        toast.error('Nepodařilo se přidat komentář')
      })
      .finally(() => {
        setLoadingAdd(false)
      })
  }

  if (error) {
    return <Error msg={'Nepodařilo se načíst komentáře'} />
  }
  if (loading) {
    return <Loading />
  }

  return (
    <>
      <table>
        <tbody>
          {data?.map((com, index) => (
            <tr key={index}>
              <td>{com.message}</td>
              <td>{com.createdBy.name}</td>
              <td>{dateFormatFull(com.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data && data.length <= 50 && (
        <>
          <div className={'gov-form-control ' + (msg ? 'not-empty' : '')}>
            <textarea
              id='textrea-komentar'
              className='gov-form-control__input'
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              aria-required='false'
              aria-disabled='false'
            />
            <label className='gov-form-control__label ' htmlFor='textrea-komentar'>
              Komentář
            </label>
          </div>

          <ButtonGov variant='primary-outlined' disabled={!msg || loadingAdd} onClick={send}>
            Přidat komentář
          </ButtonGov>
        </>
      )}
    </>
  )
}

export default CommentsBlock
