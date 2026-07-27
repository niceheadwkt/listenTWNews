# 台灣新聞全球收聽台 (TW News Reader)

這是一個極致美觀、操作流暢的單頁網頁應用程式 (SPA)，專為台灣新聞的影音直播與廣播收聽而設計。本專案已升級為 **PWA (Progressive Web App, 漸進式網頁應用程式)**，支援安裝至您的 Android 與 iOS 手機上，像原生 App 一樣使用。

## 🌟 特色功能

- **電視與廣播整合**：無縫切換 YouTube 電視直播與 HTML5/HLS 廣播音訊串流。
- **可安裝至手機 (PWA)**：支援在 Android (Chrome) 與 iOS (Safari) 設備上「安裝」或「加入主畫面」，擁有專屬桌面圖示，開啟時全螢幕顯示（無網址列）。
- **完全離線載入 UI**：透過 Service Worker 快取，即使離線也能瞬間載入 App 介面，連網時即時拉取新聞串流。
- **自訂頻道管理**：支援輸入 YouTube 網址或音訊串流網址 (`.mp3`、`.m3u8` 等)，新增後自動儲存至 LocalStorage。
- **純聽/影片切換模式**：針對 YouTube 電視直播，提供一鍵「純聽模式」（隱藏影片，僅留音量控制與動態音波視覺化特效），方便只聽新聞不看畫面的使用者。
- **極致現代美學**：採用暗色模式、Cyberpunk 霓虹發光漸層、玻璃擬態控制面板，並具備流暢的 CSS 動態音波跳動特效。
- **向量 icon 設計**：採用純向量 `icon.svg` 圖示，自動適配手機各種解析度與安裝大小。

## 🛠️ 技術架構

- **前端核心**：HTML5, Vanilla CSS, Vanilla JavaScript
- **PWA 技術**：Web App Manifest (`manifest.json`), Service Worker (`sw.js`)
- **影音 API**：YouTube Iframe Player API
- **廣播技術**：HTML5 Audio API, [Hls.js](https://github.com/video-dev/hls.js/) (支援 HLS `.m3u8` 格式串流)
- **圖示庫**：[Lucide Icons](https://lucide.dev/) (CDN 加載)

## 📱 手機安裝與使用

### 1️⃣ 本機開發與測試
- **啟動本機伺服器**（已於「技術架構」說明）：
  ```bash
  python -m http.server 8000
  # 或使用 Node.js
  npx serve .
  ```
- **在同一 Wi‑Fi 網路的手機上開啟** `http://<本機 IP>:8000`，即可預覽 UI。
- **Optional – 使用 ngrok 建立 HTTPS 隧道**（方便在 iOS Safari 測試 PWA 安裝）：
  ```bash
  npm install -g ngrok   # 若未安裝
  ngrok http 8000
  ```
  產生類似 `https://abcd1234.ngrok.io` 的安全 URL，手機直接訪問即可。

### 2️⃣ 部署至雲端（正式使用）
參考下方 **部署至雲端** 章節將專案推送至 GitHub Pages、Vercel 或 Netlify，取得公開的 HTTPS 網址。

### 3️⃣ 手機安裝 PWA
- **iOS (Safari)**：打開 HTTPS 網址 → 點擊底部「分享」按鈕 → 向下滑動 → 選擇 **「加入主畫面」**。
- **Android (Chrome)**：打開 HTTPS 網址 → 右上角選單 → 點選 **「安裝應用程式」**，或在瀏覽器底部彈出提示時直接安裝。

安裝完成後，手機桌面會出現霓虹發光的收音機圖示，點擊即可全螢幕使用，無瀏覽器工具列。

PWA 的安裝功能在手機上**必須透過 HTTPS 協定或本地 localhost 運行**才能被瀏覽器偵測並安裝。

### 步驟一：啟動本機伺服器
如果您在電腦本機開發或測試，可使用以下方式啟動伺服器：
```bash
python -m http.server 8000
```
或使用 Node.js:
```bash
npx serve .
```

### 步驟二：透過手機開啟與安裝
1. 確保您的手機與電腦連接至**同一個 Wi-Fi 網路**。
2. 找出您電腦的區域網路 IP 位址（例如 `192.168.1.100`）。
3. 用手機瀏覽器開啟網址：`http://192.168.1.100:8000`
4. **安裝步驟**：
   - **iOS (Safari)**：點選下方的「分享」按鈕 $\rightarrow$ 往下滑選擇 **「加入主畫面」 (Add to Home Screen)**。
   - **Android (Chrome)**：點選右上角選單 $\rightarrow$ 選擇 **「安裝應用程式」 (Install App)**，或依據瀏覽器底部彈出的安裝提示進行安裝。
5. 安裝完成後，您的手機桌面將會出現一個精美的霓虹發光收音機圖示！點擊它即可享受全螢幕、無瀏覽器外框的新聞收聽體驗。

---
## 📱 如何將此專案安裝至手機

以下說明適用於 Android (Chrome) 與 iOS (Safari)：

1. **啟動本機伺服器**（請參考上方「步驟一」）。
2. **在手機上開啟網址**：取得電腦的局域網 IP（例 `192.168.1.100`），於手機瀏覽器輸入 `http://<IP>:8000`。
3. **安裝 PWA**：
   - **iOS (Safari)**：點擊下方「分享」按鈕 → 向下滑動 → 選擇 **「加入主畫面」**。
   - **Android (Chrome)**：點擊右上角選單 → 選擇 **「安裝應用程式」**，或在瀏覽器底部彈出提示時直接安裝。
4. 完成安裝後，您的手機桌面會出現霓虹發光的收音機圖示，點擊即可全螢幕使用，無瀏覽器工具列。
---
## 🚀 部署至雲端 (免費且支援 HTTPS)

### Vercel（一步部署）

1. 前往 **Vercel** 官網，使用 GitHub 帳號登入，授權 Vercel 存取您的倉庫。
2. 點擊 **New Project**，在專案列表中找到 `niceheadwkt/listenTWNews`，點選 **Import**。
3. **Framework Preset** 選擇 **Other**（因為本專案是純靜態檔案），**Root Directory** 保持空白，**Output Directory** 設為 `/`（即根目錄）。
4. 若您希望自動部署每次 push，確保 **Git Integration** 已啟用（預設即為啟用）。
5. 點擊 **Deploy**，Vercel 會即時建立 **Preview** 部署，URL 形如 `https://<project>-<hash>.vercel.app`，您可點擊進入預覽。
6. 部署完成後，Vercel 會提供正式的 **Production** URL：`https://<project>.vercel.app`。此 URL 已支援 **HTTPS**，可直接用於手機安裝 PWA。
7. **自訂網域**（可選）：
   - 前往 Vercel 專案的 **Settings → Domains**，點 **Add**，輸入您已在 DNS 中指向 Vercel 的域名（CNAME 指向 `cname.vercel-dns.com`）。
   - 完成後即會得到 `https://yourdomain.com` 的安全連結。

> **提示**：Vercel 會自動快取靜態資源，且支援 Service Worker，無需額外設定。
> **注意**：若程式碼有變更，只需 `git push`，Vercel 會自動重新部署最新版本。

### Netlify（一步部署）

1. 前往 Netlify 官網，使用 GitHub 登入。
2. 點擊 **New site from Git**，選擇 `niceheadwkt/listenTWNews` 倉庫。
3. 保持建置指令空白（或 `npm run build` 若未使用），發佈目錄設為 `/`。
4. 完成部署後取得 `https://<project>.netlify.app` 的 HTTPS 連結。

> **備註**：若您使用 GitHub Actions 自動部署，請在 `manifest.json` 中的 `start_url` 與 `scope` 保持相對路徑，以免在不同網域產生 CORS/Service Worker 問題。
> **提示**：Netlify 會在每次 `git push` 後自動重新部署最新版本。

---

## 📦 部署平台與 `git push` 關係

- **GitHub**：執行 `git push origin <branch>` 只會把本機提交推送到 GitHub 上的遠端倉庫。
- **Vercel** 與 **Netlify**：透過 **GitHub Integration** 監控該倉庫，當 GitHub 收到新 commit 後會自動觸發部署，無需額外指令。
- 如需手動觸發，可使用各平台 CLI（`vercel --prod`、`netlify deploy --prod`）。

> **小提示**：只要完成 `git add . && git commit -m "..." && git push`，兩個平台都會自動重新部署最新版本。

## 🛠️ 開發環境設定

## 🛠️ 開發環境設定

```bash
# 啟動本機伺服器（已在上方說明）
python -m http.server 8000   # 或使用 Node.js
npx serve .
```

- 確保已安裝 **Node.js**（若使用 `npx serve`）或 **Python 3**。
- 本專案僅使用 **Vanilla** 前端，無需額外套件，即可直接在瀏覽器開啟 `index.html`。

## ⚙️ 功能說明

- **電視直播**：支援 YouTube **Channel ID** 與普通 **Video ID**，自動導向最新直播畫面。
- **廣播音訊**：支援 `.mp3`、`.m3u8` 等 HTTPS 串流，使用 HTML5 Audio 或 Hls.js 播放。
- **純聽模式**：隱藏影片畫面，只保留音量與視覺化音波特效。
- **自訂頻道**：使用者可自行新增 YouTube 或音訊串流，資料儲存於 `localStorage`。
- **離線快取**：透過 Service Worker (`sw.js`) 快取 UI 與資源，即使離線亦可使用介面。

## 🔧 常見問題與除錯

- **為何部分電視台無聲音？** 已改用 YouTube **Channel ID**，避免影片 ID 失效導致無聲。
- **CORS 錯誤**：確保所有串流使用 **HTTPS**；若仍出現跨域問題，可在 `manifest.json` 中確認 `start_url` 與 `scope` 為相對路徑。
- **Service Worker 未啟動**：檢查瀏覽器是否在 **HTTPS** 或 `localhost` 環境；在開發時可暫時關閉快取以便除錯。

## 🤝 貢獻指南

1. Fork 本倉庫。
2. 建立新分支並完成修改。
3. 提交 Pull Request，請在 PR 內說明變更內容與測試方式。
4. 盡可能遵循現有程式碼風格，保持 **ESLint**（若加入）的一致性。

## 📄 版權與授權

本專案採用 **MIT License**（`LICENSE`）。
- 圖示使用 **Lucide Icons**（MIT），向量圖 `icon.svg` 為自製。
- 音訊串流與 YouTube API 採用各自服務條款。

## 🙏 致謝

- **Lucide** 團隊提供精美開源圖示。
- **Hls.js** 開源社群讓我們能支援 `.m3u8` 串流。
- 感謝所有提供測試串流的電視台與廣播站。

## 📦 下載 / 直接體驗

- **GitHub Pages**：<https://niceheadwkt.github.io/listenTWNews/>（自動部署）
- **Vercel**：<https://listenTWNews.vercel.app/>（示範部署）

## 🗓️ 更新日誌

請參考 `CHANGELOG.md`（若尚未建立，可自行新增），紀錄每次功能更新與錯誤修正。

## 🚧 未來規劃

- 支援多語系介面（英文、繁體中文）。
- 離線音訊緩存與背景播放。
- 將專案打包為原生 Android/iOS 應用（使用 Capacitor / TWA）。
- 增加更多新聞頻道的自動抓取腳本。

---

## 📝 如何設定與加入自訂新聞

當您想要加入特定的新聞直播時，可以點選介面上的 **「自訂頻道」** 分頁，在表單中輸入以下資訊：

### 1. 頻道名稱
輸入您想在清單中顯示的名字（例如：`自訂華視新聞`、`自訂中視新聞`）。

### 2. 頻道類型
- **YouTube 直播**：如果您有 YouTube 直播連結。
- **廣播/音訊串流**：如果您有網路電台音訊來源（`.mp3` 或 HLS `.m3u8` 串流）。

### 3. 直播網址或 YouTube 影片 ID
根據您選擇的類型：
- **若是 YouTube 直播**，可輸入：
  - 完整 YouTube 網址：`https://www.youtube.com/watch?v=ylYJSBUgaMA`
  - 分享短網址：`https://youtu.be/ylYJSBUgaMA`
  - 直接輸入 11 位元影片 ID：`ylYJSBUgaMA`
- **若是廣播/音訊串流**，請輸入完整的網址，例如：
  - 中廣新聞網：`http://stream.bcc.com.tw:8000/bccnews`
  - ICRT 英文台：`https://icrt.fastcast4u.com/proxy/icrt?mp=/stream`
  - 若有自訂的 IPTV 新聞 HLS 串流：`https://example.com/live/news.m3u8`

點擊 **「加入頻道清單」** 後，頻道即刻儲存並顯示在下方的「您的自訂頻道」列表，點擊即可開始播放！
