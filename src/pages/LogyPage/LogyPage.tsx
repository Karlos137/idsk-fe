import { useState } from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableLogs from '../../tables/TableLogs/TableLogs'

const LogyPage = () => {
  const [tabSelected, setTabSelected] = useState('successLogin')

  const getTable = () => {
    switch (tabSelected) {
      case 'successLogin':
        return <TableLogs key={1} logType='successLogin' />
      case 'failedLogin':
        return <TableLogs key={2} logType='failedLogin' />
      case 'logout':
        return <TableLogs key={3} logType='logout' />
      case 'entityDeletion':
        return <TableLogs key={4} logType='entityDeletion' />
      default:
        return <TableLogs logType='successLogin' />
    }
  }
  return (
    <>
      <PageWrap title='Logy'>
        <div className='gov-tabs gov-js-tabs'>
          <div className='gov-tabs__links-holder' role='tablist' aria-label='Logy'>
            <button
              id='link-0'
              className={tabSelected === 'successLogin' ? 'gov-tabs__link is-active' : 'gov-tabs__link'}
              aria-selected={tabSelected === 'successLogin' ? 'true' : 'false'}
              role='tab'
              aria-controls='link-0-tab'
              tabIndex={0}
              onClick={() => {
                setTabSelected('successLogin')
              }}
            >
              Úspěšné přihlášení
            </button>
            <button
              id='link-1'
              className={tabSelected === 'failedLogin' ? 'gov-tabs__link is-active' : 'gov-tabs__link'}
              aria-selected={tabSelected === 'failedLogin' ? 'true' : 'false'}
              role='tab'
              aria-controls='link-1-tab'
              tabIndex={1}
              onClick={() => {
                setTabSelected('failedLogin')
              }}
            >
              Neúspěšné přihlášení
            </button>
            <button
              id='link-2'
              className={tabSelected === 'logout' ? 'gov-tabs__link is-active' : 'gov-tabs__link'}
              aria-selected={tabSelected === 'logout' ? 'true' : 'false'}
              role='tab'
              aria-controls='link-2-tab'
              tabIndex={2}
              onClick={() => {
                setTabSelected('logout')
              }}
            >
              Odhlášení
            </button>
            <button
              id='link-3'
              className={tabSelected === 'entityDeletion' ? 'gov-tabs__link is-active' : 'gov-tabs__link'}
              aria-selected={tabSelected === 'entityDeletion' ? 'true' : 'false'}
              role='tab'
              aria-controls='link-3-tab'
              tabIndex={3}
              onClick={() => {
                setTabSelected('entityDeletion')
              }}
            >
              Smazání subjektu
            </button>
            {/* <button
              id='link-2'
              className='gov-tabs__link '
              aria-selected='false'
              role='tab'
              aria-controls='link-2-tab'
              tabIndex={2}
            >
              Působnost v agendách
            </button>
            <button
              id='link-3'
              className='gov-tabs__link '
              aria-selected='false'
              role='tab'
              aria-controls='link-3-tab'
              tabIndex={3}
            >
              Zřizované organizace
            </button> */}
          </div>
        </div>
        {getTable()}
      </PageWrap>
    </>
  )
}

export default LogyPage
