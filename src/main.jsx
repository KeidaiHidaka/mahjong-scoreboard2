// src/main.jsx


// ========================================
// main.jsx - エントリーポイントでの共通CSS読み込み
// ========================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
