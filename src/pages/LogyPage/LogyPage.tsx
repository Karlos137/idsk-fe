import { useState } from 'react'
import PageWrap from '../../components/PageWrap/PageWrap'
import TableLogsLogins from '../../tables/TableLogs/TableLogsLogins'

const LogyPage = () => {
  const [tabSelected, setTabSelected] = useState('successLogins')

  const getTable = () => {
    switch (tabSelected) {
      case 'successLogins':
        return <TableLogsLogins result='SUCCESS' />
      case 'failedLogins':
        return <TableLogsLogins result='FAILURE' />
      default:
        return <TableLogsLogins result='SUCCESS' />
    }
  }
  return (
    <>
      <PageWrap title='Logy'>
        <div className='gov-tabs gov-js-tabs'>
          <div className='gov-tabs__links-holder' role='tablist' aria-label='Logy'>
            <button
              id='link-0'
              className={tabSelected === 'successLogins' ? 'gov-tabs__link is-active' : 'gov-tabs__link'}
              aria-selected={tabSelected === 'successLogins' ? 'true' : 'false'}
              role='tab'
              aria-controls='link-0-tab'
              tabIndex={0}
              onClick={() => {
                setTabSelected('successLogins')
              }}
            >
              Úspěšné přihlášení
            </button>
            <button
              id='link-1'
              className={tabSelected === 'failedLogins' ? 'gov-tabs__link is-active' : 'gov-tabs__link'}
              aria-selected={tabSelected === 'failedLogins' ? 'true' : 'false'}
              role='tab'
              aria-controls='link-1-tab'
              tabIndex={1}
              onClick={() => {
                setTabSelected('failedLogins')
              }}
            >
              Neúspěšné přihlášení
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
