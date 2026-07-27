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

## 🚀 手機安裝與運行指南

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

本專案可部署至提供免費 HTTPS 的靜態網站託管平台，例如 **GitHub Pages、Vercel、Netlify**，只要將專案推送至遠端倉庫即可自動部署。

### GitHub Pages（推薦步驟）

1. 前往 GitHub 倉庫的 **Settings → Pages**。
2. 在 **Source** 選擇 `gh‑pages` 分支（或 `master` / `main` 並設定根目錄 `/`）。
3. 點擊 **Save**，GitHub 會在 `https://<username>.github.io/<repo>/` 建立 HTTPS 網站。
4. 若需要自訂域名，於 **Custom domain** 欄位填入您的域名，並在 DNS 中新增 `CNAME` 記錄指向 GitHub 提供的主機名。

### Vercel / Netlify（一步部署）

1. 前往 Vercel（或 Netlify）官網，使用 GitHub 帳號登入。
2. 點擊 **New Project**，選擇 `niceheadwkt/listenTWNews` 倉庫。
3. 保持預設建置指令（`npm run build` 若有，若為純靜態則留空）與發佈目錄（`/`）。
4. 部署完成後會取得 `https://<project>.vercel.app`（或 `*.netlify.app`）的 HTTPS 連結。

> **備註**：若您使用 GitHub Actions 自動部署，記得在 `manifest.json` 中的 `start_url` 與 `scope` 保持相對路徑，以免在不同網域產生 CORS/Service Worker 問題。

---

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
