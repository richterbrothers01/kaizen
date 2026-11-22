import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'
import { LenisRoot } from './LenisRoot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LenisRoot>
      <App />
    </LenisRoot>
  </StrictMode>,
)
