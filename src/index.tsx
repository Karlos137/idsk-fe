import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './components/App/App'
import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import 'react-contexify/dist/ReactContexify.css'

import { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import cs from 'date-fns/locale/cs'

import moment from 'moment'
import 'moment/locale/cs'
moment.locale('cs')
moment.updateLocale(moment.locale(), { invalidDate: '-' })

registerLocale('cs', cs)
setDefaultLocale('cs')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
