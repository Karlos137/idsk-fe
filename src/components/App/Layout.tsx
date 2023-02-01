import React from 'react'
import { Outlet, useMatch } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import bg from './idsk_login_bg.jpg'
import { LINKS } from './LINKS'

const Layout = () => {
  const match = useMatch(LINKS.login)
  const bgStyle = match ? { background: 'url(' + bg + ') center no-repeat', backgroundSize: 'cover' } : {}

  return (
    <div className='app-wrap'>
      <Header />
      <div className='app-content' style={bgStyle}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
