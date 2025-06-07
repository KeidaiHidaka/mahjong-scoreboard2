// src/main.jsx


// ========================================
// main.jsx - エントリーポイントでの共通CSS読み込み
// ========================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 共通スタイルを最初に読み込み（順序重要）
import './styles/globals.css'      // グローバル設定
import './styles/themes.css'       // CSS変数・テーマ
import './styles/utility.css'      // ユーティリティクラス
import './styles/forms.css'        // フォーム共通スタイル
import './styles/responsive.css'   // レスポンシブ対応

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
