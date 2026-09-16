import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './styles/tokens.css'
import './styles/base.css'
import './styles/aluno.css'
import './styles/gestor.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
