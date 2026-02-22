import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider.tsx'
import './index.css'

const root = document.getElementById('root')

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>
  )
}
