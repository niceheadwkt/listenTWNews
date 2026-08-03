# listenTWNews — 聽台灣新聞

## 專案簡介
`listenTWNews` 是一個高品質的台灣新聞語音聚合與播報工具，能夠串接中央社及公視 RSS 內容，並透過極速 AI 摘要及 TTS 播放，提供使用者最直覺的「用聽的看新聞」體驗。

## 關鍵時程
- 專案初始化與主要結構建立：2026-07-27

## 語言與風格
- 所有使用者回應、專案文件、日誌皆使用 **繁體中文**。
- 設計遵循奢華的 Obsidian 黑色美學與流暢的 UI 微動畫。

## 技術架構
- **開發框架**：Vite 8 + Vanilla JS (不引入額外的多餘框架，確保極速載入)
- **CSS 系統**：原生 CSS 變數，配合 HSL 配色方案與 Glassmorphism 霧面毛玻璃效果。
- **RSS Proxy**：使用 Vite 內建的 `server.proxy` 將本機 API 映射至 `https://rss.cna.com.tw` 與 `https://news.pts.org.tw` 以完全繞過瀏覽器的 CORS 限制。
- **語音朗讀 (TTS)**：
  - 標準模式：使用瀏覽器標準內建的 `speechSynthesis` API，自動偵測台灣中文 (zh-TW) 發音。
  - 客製模式：保留連接至本地端語音複製伺服器 (`voxcpm2-voice-cloner`) 的介面（預設 API 位置 `http://localhost:5000/api/tts`）。
- **AI 摘要**：
  - 核心：Groq API (搭配 Llama-3.3-70b-versatile 模型，可達到毫秒級摘要生成)。
  - 備用：OpenAI API (gpt-4o-mini)。
  - 安全：所有金鑰皆使用 `localStorage` 直接儲存在使用者本地端瀏覽器中。

## 目前進度
- [x] 專案初始化 (`npm run dev` 骨架與專案依賴安裝)
- [x] 設定新聞 Proxy 機制 (`vite.config.js`)
- [x] 建立精緻的 Obsidian 黑色美學設計系統與動畫 (`src/style.css`)
- [x] 實作新聞 RSS 解析及聯合日期排序邏輯 (`src/api/news.js`)
- [x] 實作 Web Speech TTS 控制與本地語音複製串接邏輯 (`src/api/tts.js`)
- [x] 實作 Groq / OpenAI 摘要介面 (`src/api/ai.js`)
- [x] 實作 HTML 主畫面結構與高品質播放器版面 (`index.html`)
- [x] 實作核心狀態控制器與逐句追蹤播放佇列高亮功能 (`src/main.js`)
- [x] 重構【自訂頻道】版面，將『您的自訂頻道』前置展示，頂部按鈕改為觸發『新增自訂頻道』與『匯入/匯出 JSON』折疊面板 (`index.html`, `app.js`, `style.css`)
- [x] 實作自訂頻道雙模式 JSON 匯入（檔案選取 `.json` 與文字貼上匯入）與無縫渲染 (`app.js`, `index.html`)
- [x] 透過 AI 瀏覽器子代理深度除錯台視新聞台無聲問題，實測確定為台視官方設定第三方網站嵌入限制 (Error 153)，並於 UI 提供一鍵直連播放按鈕 (`app.js`)
- [x] 啟動與瀏覽器實測驗證完成
- [x] 盤點並整合專案開發過程之 6 大核心雷區（包含 YouTube 嵌入限制、自動播放政策、單例重構、跨域代理、JSON 容錯與 PWA 快取）至 Obsidian 的 [AI/listenTWNews_工作筆記.md](file:///c:/Users/ch26788/我的雲端硬碟/Obsidian/AI/listenTWNews_工作筆記.md) 筆記中。


## 關鍵設計決策
1. **免後端 RSS CORS 方案**：
   - 瀏覽器端直接 fetch 外部 RSS feed 會被 CORS 政策阻擋。由於這是一個本地運行與開發的專案，使用 Vite dev server 內建的代理服務是最穩定、不需要任何額外 node 後端的優雅解法。
2. **逐句切分播放佇列**：
   - 為了實作「邊聽邊追蹤文字高亮」的功能，且避免 Web Speech API 長文播放容易無故中斷或卡死的 Bug，我們在 `main.js` 中將文章以句號、問號、驚嘆號等符號分割成句子陣列，並以佇列方式一句接一句播放。這大幅提升了播放的穩定性與互動體驗。
3. **安全 API Key 管理**：
   - 為了完全保護使用者的 API Key 隱私，金鑰儲存在瀏覽器 `localStorage` 中，並由前端直接發送 HTTP 請求給 Groq / OpenAI，中間不經過任何中轉伺服器。

## 資料夾結構
```
listenTWNews/
├── index.html            # 主畫面結構
├── vite.config.js        # Vite 代理與打包設定
├── package.json          # 專案套件設定
├── README.md             # 專案架構說明
├── AGENTS.md             # 專案歷史與日誌 (本檔案)
└── src/
    ├── main.js           # 專案主控制代碼 (播放狀態、事件處理與高亮 UI)
    ├── style.css         # 進階 Obsidian 黑色設計變數與樣式
    └── api/
        ├── news.js       # CNA / PTS 新聞 RSS 獲取與 XML 解析
        ├── tts.js        # TTS 瀏覽器語音 & 本地複製語音管理器
        └── ai.js         # API 摘要生成服務
```

## 下次開工優先事項
1. **伺服器執行驗證**：執行 `npm run dev`，在瀏覽器中測試實際新聞拉取、搜尋過濾、內建語音朗讀與逐句高亮是否運作良好。
2. **安童哥語音串接測試**：確保本地語音複製伺服器在執行時，此 Web App 的 `custom` 模式能正常對接。

## 開發守則與約定
1. **不可隨意刪除定義資料**：嚴禁在未告知使用者的情況下隨意刪除程式碼中已定義的預設頻道、設定或任何資料。若因故需要移除，**必須先向使用者說明並取得確認同意**後，方可進行刪除。
2. **務必自行測試驗證**：所有關於頻道新增、修改或核心功能的調整，**必須由 AI 助理主動啟動本機伺服器，並使用瀏覽器子代理進行實際播放與功能驗證**，確認無誤後方能向使用者回報。

