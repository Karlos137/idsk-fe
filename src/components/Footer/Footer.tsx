import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserIsLoged } from '../../redux/user/selectors'

const VERSION = process.env.REACT_APP_VERSION

const Footer = () => {
  const isloged = useSelector(selectUserIsLoged)

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // <!-- https://designsystem.gov.cz/pl/?p=viewall-organisms--01-gov-footer -->
  return (
    <footer className='gov-container u-bg-color--grey-dark gov-footer'>
      <div className='gov-container__content'>
        <section className='gov-footer__upper u-screen--only mb-5'></section>
        <hr />
        <section className='gov-footer__lower'>
          <p className='gov-footnote'>
            2022 &copy; Ministerstvo vnitra • Informace jsou poskytovány v&nbsp;souladu se zákonem č.&nbsp;106/1999 Sb.,
            o&nbsp;svobodném přístupu k&nbsp;informacím.
          </p>
          <p className='gov-footnote'>
            Kontakt na uživatelskou podporu:{' '}
            <a style={{ color: 'inherit', fontSize: 'inherit' }} href='mailto:smlouvy.podpora@idsk.cz'>
              smlouvy.podpora@idsk.cz
            </a>
            . Verze {VERSION}
          </p>
        </section>
        {isloged && (
          <button
            onClick={goToTop}
            className='gov-button gov-button--primary-outlined gov-button--inversed gov-footer__scroll-up gov-js--scroll-up'
            aria-labelledby='fo-scrollBtn'
          >
            <span id='fo-scrollBtn' className='u-sr-only gov-button__label'>
              Zpět nahoru
            </span>
          </button>
        )}
      </div>
    </footer>
  )
}

export default Footer
