# listenTWNews — 聽台灣新聞

## 專案簡介
`listenTWNews` 是一個高品質的台灣新聞影音與廣播收聽工具，整合 YouTube 電視直播及網路廣播串流，提供使用者直覺的台灣新聞收聽體驗。

## 關鍵時程
- 專案初始化與主要結構建立：2026-07-27

## 語言與風格
- 所有使用者回應、專案文件、日誌皆使用 **繁體中文**。
- 設計遵循奢華的 Obsidian 黑色美學與流暢的 UI 微動畫。

## 技術架構
- **前端架構**：根目錄靜態 HTML + Vanilla JavaScript，不依賴建置工具或 npm 套件。
- **CSS 系統**：原生 CSS 變數，配合 HSL 配色方案與 Glassmorphism 霧面毛玻璃效果。
- **影音播放**：YouTube Iframe Player API、HTML5 Audio API 與 Hls.js CDN。
- **外部動態解析**：使用 AllOrigins、Corsproxy.io 解析 YouTube 最新直播 ID 與 KISSRadio 動態 HLS 網址。
- **訪客統計**：背景載入 Firebase Firestore，並透過 ipapi.co 取得概略 IP 地理資訊。

## 目前進度
- [x] 建立精緻的 Obsidian 黑色美學設計系統與動畫 (`style.css`)
- [x] 實作 HTML 主畫面結構與高品質播放器版面 (`index.html`)
- [x] 實作核心狀態控制器與新聞頻道播放功能 (`app.js`)
- [x] 實作 YouTube 頻道最新直播解析、失效 ID 自動修復與嵌入限制外開處理 (`app.js`)
- [x] 實作 HLS、MP3/AAC 串流播放及 KISSRadio 動態網址解析 (`app.js`)
- [x] 實作 Firebase 訪客背景統計與裝置識別 (`app.js`)
- [x] 重構【自訂頻道】版面，將『您的自訂頻道』前置展示，頂部按鈕改為觸發『新增自訂頻道』與『匯入/匯出 JSON』折疊面板 (`index.html`, `app.js`, `style.css`)
- [x] 實作自訂頻道雙模式 JSON 匯入（檔案選取 `.json` 與文字貼上匯入）與無縫渲染 (`app.js`, `index.html`)
- [x] 透過 AI 瀏覽器子代理深度除錯台視新聞台無聲問題，實測確定為台視官方設定第三方網站嵌入限制 (Error 153)，並於 UI 提供一鍵直連播放按鈕 (`app.js`)
- [x] 啟動與瀏覽器實測驗證完成
- [x] 盤點並整合專案開發過程之 6 大核心雷區（包含 YouTube 嵌入限制、自動播放政策、單例重構、跨域代理、JSON 容錯與 PWA 快取）至 Obsidian 的 [AI/listenTWNews_工作筆記.md](file:///c:/Users/ch26788/我的雲端硬碟/Obsidian/AI/listenTWNews_工作筆記.md) 筆記中。
- [x] 新增預設廣播電台頻道：中廣新聞網、飛碟聯播網與 KISSRadio 聯播網 (`app.js`)
- [x] 修正東森新聞台 (51台) 的預設 YouTube Video ID 與正確的 Channel ID (`app.js`)
- [x] 實作行動端使用者「手勢解鎖 (User Gesture Unlock)」機制，解決非同步解析後播放被瀏覽器阻擋的問題 (`app.js`)
- [x] 將 PWA Service Worker 註冊改為相對路徑 `./sw.js` 以增加子目錄部署相容性 (`app.js`)
- [x] 調整行動端 RWD 版面並新增底部安全區域 (`safe-area-inset-bottom`) 支援 (`style.css`)
- [x] 實作 5 大 UI/UX 設計與行動端適配優化（包含 Obsidian 暗黑美學、CSS Grid 平滑高度手風琴展開、真實參差音波動畫、小螢幕 Icon+微文字 Tab 與物理按壓微縮放回饋），並通過實機驗證 (`index.html`, `app.js`, `style.css`)



## 關鍵設計決策
1. **純靜態前端**：
   - 專案不需要本地 Node 後端或建置步驟，使用靜態伺服器即可執行；瀏覽器直接載入第三方 CDN、YouTube 與廣播串流服務。
2. **使用者手勢優先播放**：
   - 頻道點擊時先同步初始化或解鎖播放器，再進行非同步直播網址解析，以降低瀏覽器自動播放政策造成的無聲或拒播問題。
3. **自訂頻道本機儲存**：
   - 自訂頻道只儲存在目前裝置的 `localStorage`；JSON 匯入會覆蓋現有自訂頻道清單，使用前會要求確認。
4. **PWA App Shell 快取**：
   - Service Worker 只快取同網域的介面檔案；YouTube、CDN 與外部廣播串流不會被快取，因此離線只能載入介面，不能保證播放內容可用。

## 資料夾結構
```
listenTWNews/
├── index.html            # 主畫面結構
├── app.js                # 頻道播放、事件處理與自訂頻道管理
├── style.css             # 介面樣式與響應式設計
├── sw.js                 # PWA Service Worker
├── manifest.json         # PWA 設定
├── icon.svg              # PWA 圖示
├── README.md             # 專案架構說明
└── AGENTS.md             # 專案歷史與日誌 (本檔案)
```

## 下次開工優先事項
1. **部署發佈與 PWA 安裝測試**：於實際手機設備（特別是 iOS Safari 及行動版 Chrome）上，測試由雲端託管端安裝此 PWA，驗證 Service Worker 離線快取功能。
2. **補充正式的隱私權說明**：明確說明 Firebase 訪客紀錄、ipapi.co 查詢、第三方 CDN、YouTube 與廣播服務的資料流向及保存政策。

## 開發守則與約定
1. **不可隨意刪除定義資料**：嚴禁在未告知使用者的情況下隨意刪除程式碼中已定義的預設頻道、設定或任何資料。若因故需要移除，**必須先向使用者說明並取得確認同意**後，方可進行刪除。
2. **務必自行測試驗證**：所有關於頻道新增、修改或核心功能的調整，**必須由 AI 助理主動啟動本機伺服器，並使用瀏覽器子代理進行實際播放與功能驗證，且「聽到聲音（或確認音訊物件無阻礙、持續維持在無靜音之播放狀態且無異常定時暫停）」為測試最核心重點**。回報時必須說明音訊驗證之依據，確認無誤後方能向使用者回報。
3. **收工時自動發布流程**：當使用者表示「收工」時，AI 助理應主動執行 Git Commit、Push 至 GitHub (`origin master`)，並透過 Vercel CLI (`npx vercel --prod --yes`) 自動將最新版本部署至 Vercel 正式環境。

