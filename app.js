/* ==========================================
   台灣新聞收聽 App - 核心應用程式邏輯 (純聽無螢幕版)
   ========================================== */

const DEFAULT_TV_CHANNELS = [
    { id: 'tv-ftv', name: '民視新聞台', desc: 'Formosa TV News 24小時線上直播 (訊號正常發聲)', type: 'youtube', value: 'ylYJSBUgaMA', channelId: 'UC2VmWn8dAqkzlQqvy02E1PA' },
    { id: 'tv-ebc57', name: '東森財經新聞台 (57台)', desc: 'EBC 57台 24小時線上直播 (東森電視官方線上直播訊號)', type: 'youtube', value: 'AEBeWMM1atA', channelId: 'UC5money57' },
    { id: 'tv-ttv', name: '台視新聞台', desc: 'TTV News 資訊台 24小時直播 (訊號正常發聲)', type: 'youtube', value: '9iRAqBMakXY', fallback: 'MaTO_CAzqJA', channelId: 'UC8ROUUjHzEQm-ndb69CX8Ww' },
    { id: 'tv-ctv', name: '中視新聞台', desc: 'CTV News 資訊台 24小時直播 (訊號正常發聲)', type: 'youtube', value: 'TCnaIE_SAtM', channelId: 'UCmH4q-YjeazayYCVHHkGAMA' },
    { id: 'tv-cts', name: '華視新聞台 (52台)', desc: 'CTS News CH52 資訊台 24小時直播 (訊號正常發聲)', type: 'youtube', value: 'wM0g8EoUZ_E', channelId: 'UCDCJyLpbfgeVE9iZiEam-Kg' },
    { id: 'tv-pts', name: '公視新聞台', desc: 'PTS News 24小時線上直播 (訊號正常發聲)', type: 'youtube', value: 'quwqlazU-c8', channelId: 'UCexpzYDEnfmAvPSfG4xbcjA' },
    { id: 'tv-cti', name: '中天新聞台', desc: 'CTI News 24小時線上直播 (訊號正常發聲)', type: 'youtube', value: 'vr3XyVCR4T0', channelId: 'UCpu3bemTQwAU8PqM4kJdoEQ' },
    { id: 'tv-set', name: '三立新聞台', desc: 'SET News 24小時線上直播 (訊號正常發聲)', type: 'youtube', value: 'yeYC0mbSIOo', channelId: 'UC2TuODJhC03pLgd6MpWP0iw' },
    { id: 'tv-tvbs', name: 'TVBS 新聞台', desc: 'TVBS News 55頻道 24小時直播 (訊號正常發聲)', type: 'youtube', value: 'm_dhMSvUCIc', channelId: 'UC5nwNW4KdC0SzrhF9BXEYOQ' }
];

// 預設廣播新聞頻道 (音訊串流)
const DEFAULT_RADIO_CHANNELS = [
    { id: 'radio-icrt', name: 'ICRT 英文電台', desc: '台北國際社區廣播電台 英語新聞與流行樂', type: 'audio', value: 'https://stream.rcs.revma.com/nkdfurztxp3vv' },
    { id: 'radio-taipei', name: '台北廣播電台', desc: 'FM 93.1 台北市政、即時新聞與生活資訊 (HLS 串流)', type: 'audio', value: 'https://stream.ginnet.cloud/live0130lo-yfyo/_definst_/fm/playlist.m3u8' },
    { id: 'radio-goodnews', name: '佳音廣播電台', desc: 'FM 90.9 溫馨心靈音樂、生活資訊與經典民歌 (HLS 串流)', type: 'audio', value: 'https://stream.ginnet.cloud/live0119lo-p4rb/_definst_/fm909/playlist.m3u8' }
];

// 應用程式狀態
const state = {
    currentChannel: null,
    isPlaying: false,
    volume: 80,
    youtubePlayer: null,
    isYoutubeReady: false,
    hlsInstance: null,
    customChannels: []
};

// DOM 元素引用
const dom = {
    audioPlayer: document.getElementById('audio-player'),
    youtubePlayerContainer: document.getElementById('youtube-player'),
    audioVisualizer: document.getElementById('audio-visualizer'),
    visualizerStatusText: document.getElementById('visualizer-status-text'),
    
    // 控制列
    playPauseBtn: document.getElementById('play-pause-btn'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    volumeIcon: document.getElementById('volume-icon'),
    
    // 當前播放頻道資訊
    playerChannelType: document.getElementById('player-channel-type'),
    playerChannelTitle: document.getElementById('player-channel-title'),
    playerChannelDesc: document.getElementById('player-channel-desc'),
    
    // 清單容器
    tvChannelList: document.getElementById('tv-channel-list'),
    radioChannelList: document.getElementById('radio-channel-list'),
    customChannelList: document.getElementById('custom-channel-list'),
    
    // 表單與自訂管理
    addChannelForm: document.getElementById('add-channel-form'),
    newChannelName: document.getElementById('new-channel-name'),
    newChannelType: document.getElementById('new-channel-type'),
    newChannelUrl: document.getElementById('new-channel-url'),
    toggleAddPaneBtn: document.getElementById('toggle-add-pane-btn'),
    toggleTransferPaneBtn: document.getElementById('toggle-transfer-pane-btn'),
    addChannelPane: document.getElementById('add-channel-pane'),
    transferChannelPane: document.getElementById('transfer-channel-pane'),
    exportJsonFileBtn: document.getElementById('export-json-file-btn'),
    importJsonTriggerBtn: document.getElementById('import-json-trigger-btn'),
    importJsonFileInput: document.getElementById('import-json-file-input'),
    customChannelsTextInput: document.getElementById('custom-channels-text-input'),
    importTextBtn: document.getElementById('import-text-btn')
};

/* ==========================================
   初始化與 YouTube API
   ========================================== */

// 初始化應用程式
function initApp() {
    loadCustomChannels();
    renderChannelLists();
    setupEventListeners();
    initLucideIcons();
}

// 註冊 YouTube Iframe API Ready 全域回呼
window.onYouTubeIframeAPIReady = function() {
    state.isYoutubeReady = true;
    console.log("YouTube Player API Ready.");
    initYoutubePlayerSingleton();
};

// 初始化單例 YouTube 播放器 (用以在使用者點擊時同步加載有聲音的影片，繞過瀏覽器限制)
function initYoutubePlayerSingleton() {
    if (!state.isYoutubeReady) return;
    try {
        let initialVideoId = DEFAULT_TV_CHANNELS[0]?.value || 'ylYJSBUgaMA';
        if (initialVideoId.length === 24 && initialVideoId.startsWith('UC')) {
            initialVideoId = DEFAULT_TV_CHANNELS[0]?.fallback || 'ylYJSBUgaMA';
        }

        state.youtubePlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: initialVideoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                enablejsapi: 1
            },
            events: {
                onReady: (event) => {
                    console.log("Singleton YouTube Player 已建立並就緒");
                    event.target.setVolume(state.volume);
                },
                onStateChange: (event) => {
                    handleYoutubePlayerStateChange(event.data);
                }
            }
        });
    } catch (e) {
        console.error("初始化 Singleton YouTube Player 失敗:", e);
    }
}

// 重新整理 Lucide 圖示
function initLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/* ==========================================
   資料持久化與 LocalStorage
   ========================================== */

function loadCustomChannels() {
    const raw = localStorage.getItem('tw_news_custom_channels');
    if (raw) {
        try {
            state.customChannels = JSON.parse(raw);
        } catch (e) {
            console.error("無法解析 localStorage 中的自訂頻道:", e);
            state.customChannels = [];
        }
    } else {
        state.customChannels = [];
    }
}

function saveCustomChannels() {
    localStorage.setItem('tw_news_custom_channels', JSON.stringify(state.customChannels));
}

function normalizeImportedChannels(raw) {
    let parsed;

    try {
        parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
        throw new Error('檔案內容並非合法的 JSON 格式，請檢查檔案內容。');
    }

    // 相容多種 JSON 結構：陣列、{ customChannels: [] }, { channels: [] }, { items: [] }, 或單一物件
    let channelArray = [];
    if (Array.isArray(parsed)) {
        channelArray = parsed;
    } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.customChannels)) {
            channelArray = parsed.customChannels;
        } else if (Array.isArray(parsed.channels)) {
            channelArray = parsed.channels;
        } else if (Array.isArray(parsed.items)) {
            channelArray = parsed.items;
        } else if ((parsed.name || parsed.title) && (parsed.value || parsed.url || parsed.link)) {
            channelArray = [parsed];
        } else {
            throw new Error('JSON 格式中未找到有效的頻道資料清單。');
        }
    } else {
        throw new Error('設定內容格式不正確，應該為 JSON 頻道資料清單。');
    }

    if (channelArray.length === 0) {
        throw new Error('JSON 檔案中沒有找到任何自訂頻道資料。');
    }

    return channelArray.map((channel, index) => {
        const name = typeof channel.name === 'string' && channel.name.trim() 
            ? channel.name.trim() 
            : (typeof channel.title === 'string' && channel.title.trim() ? channel.title.trim() : `自訂頻道 ${index + 1}`);
        
        let type = channel.type;
        let rawVal = typeof channel.value === 'string' && channel.value.trim() 
            ? channel.value.trim() 
            : (typeof channel.url === 'string' && channel.url.trim() 
                ? channel.url.trim() 
                : (typeof channel.link === 'string' ? channel.link.trim() : ''));

        const desc = typeof channel.desc === 'string' ? channel.desc.trim() : '';

        // 類型自動判定
        if (!['youtube', 'audio'].includes(type)) {
            if (rawVal.includes('youtube.com') || rawVal.includes('youtu.be') || (rawVal.length === 11 && !rawVal.includes('.'))) {
                type = 'youtube';
            } else {
                type = 'audio';
            }
        }

        // 如果是 YouTube 類型，嘗試自動提煉影片/頻道 ID
        if (type === 'youtube') {
            const extractedId = extractYoutubeId(rawVal);
            if (extractedId) {
                rawVal = extractedId;
            }
        }

        if (!name || !rawVal) {
            throw new Error(`第 ${index + 1} 筆頻道資料不完整 (缺乏頻道名稱或網址/ID)。`);
        }

        return {
            id: typeof channel.id === 'string' && channel.id.trim() ? channel.id.trim() : `custom-imported-${Date.now()}-${index}`,
            name,
            desc: desc || (type === 'youtube' ? '自訂 YouTube 頻道 (僅聽音訊)' : '自訂音訊串流廣播'),
            type,
            value: rawVal
        };
    });
}

/* ==========================================
   UI 渲染邏輯
   ========================================== */

// 渲染所有頻道列表
function renderChannelLists() {
    // 渲染電視頻道
    renderGrid(DEFAULT_TV_CHANNELS, dom.tvChannelList, 'tv');
    
    // 渲染廣播頻道
    renderGrid(DEFAULT_RADIO_CHANNELS, dom.radioChannelList, 'radio');
    
    // 渲染自訂頻道
    renderCustomGrid();
}

// 渲染單個 Channel Grid
function renderGrid(channels, container, category) {
    container.innerHTML = '';
    channels.forEach(channel => {
        const card = createChannelCard(channel, category);
        container.appendChild(card);
    });
}

// 渲染自訂頻道 Grid
function renderCustomGrid() {
    const container = dom.customChannelList;
    if (state.customChannels.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="heart"></i>
                <p>目前沒有自訂頻道，請在上方新增！</p>
            </div>
        `;
        initLucideIcons();
        return;
    }
    
    container.innerHTML = '';
    state.customChannels.forEach(channel => {
        const card = createChannelCard(channel, 'custom');
        container.appendChild(card);
    });
    initLucideIcons();
}

// 建立頻道卡片 DOM
function createChannelCard(channel, category) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.dataset.id = channel.id;
    if (state.currentChannel && state.currentChannel.id === channel.id) {
        card.classList.add('playing');
    }
    
    // 根據類型選擇圖示
    let iconName = 'tv';
    if (channel.type === 'audio') {
        iconName = 'mic';
    }
    
    card.innerHTML = `
        <div class="channel-main">
            <div class="channel-icon-wrapper">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="channel-details">
                <h4>${escapeHtml(channel.name)}</h4>
                <p>${escapeHtml(channel.desc || (channel.type === 'youtube' ? 'YouTube 自訂頻道' : '自訂音訊串流'))}</p>
            </div>
        </div>
        <div class="play-state-indicator">
            ${state.currentChannel && state.currentChannel.id === channel.id && state.isPlaying 
                ? '<i data-lucide="volume-2"></i>' 
                : '<i data-lucide="play" class="hover-play-icon"></i>'}
        </div>
    `;
    
    // 如果是自訂分頁，加入刪除按鈕
    if (category === 'custom') {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-channel-btn';
        deleteBtn.title = '刪除頻道';
        deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>';
        
        // 阻止冒泡，避免點擊刪除按鈕觸發播放
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCustomChannel(channel.id);
        });
        
        card.appendChild(deleteBtn);
    }
    
    // 點選卡片播放
    card.addEventListener('click', () => {
        playChannel(channel);
    });
    
    return card;
}

// 安全 HTML 跳脫
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================
   播放器控制核心
   ========================================== */

// 播放指定頻道
function playChannel(channel) {
    console.log("Playing channel:", channel);
    
    // 若點選相同的頻道，且正在播放，則執行暫停；若暫停，則執行播放
    if (state.currentChannel && state.currentChannel.id === channel.id) {
        togglePlayPause();
        return;
    }
    
    // 停止目前播放中的所有音訊/影片
    stopAllPlayers();
    
    state.currentChannel = channel;
    state.isPlaying = true;
    
    // 更新控制按鈕狀態
    dom.playPauseBtn.disabled = false;
    dom.playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
    
    // 更新當前頻道文字資訊
    dom.playerChannelTitle.innerText = channel.name;
    const baseDesc = channel.desc || (channel.type === 'youtube' ? 'YouTube 影片/直播' : '廣播電台/串流音訊');
    if (channel.type === 'youtube') {
        dom.playerChannelDesc.innerHTML = `${escapeHtml(baseDesc)} · <a href="https://www.youtube.com/watch?v=${channel.value}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-neon); text-decoration: underline;">開啟 YouTube 直播頁</a>`;
    } else {
        dom.playerChannelDesc.innerText = baseDesc;
    }
    dom.playerChannelType.innerText = channel.type === 'youtube' ? '電視直播 (僅聽音訊)' : '廣播電台';
    
    // 啟動音波動畫
    dom.audioVisualizer.classList.add('playing');
    
    if (channel.type === 'youtube') {
        // 電視新聞 (YouTube 直播) 模式 - 後台播放音訊
        dom.visualizerStatusText.innerText = '電視直播音訊載入中...';
        playYoutubeVideo(channel.value);
    } else {
        // 廣播新聞 (Audio 串流) 模式
        dom.visualizerStatusText.innerText = '廣播電台播放中...';
        playAudioStream(channel.value);
    }
    
    // 更新所有清單的選取狀態
    updatePlayingStatusUI();
    initLucideIcons();
}

// 停止所有播放器 (優化為 Singleton 模式，避免頻繁銷毀 YouTube 播放器導致非同步加載被瀏覽器靜音)
function stopAllPlayers() {
    // 停止 HTML5 Audio
    dom.audioPlayer.pause();
    dom.audioPlayer.src = '';
    
    // 銷毀 HLS.js 實例
    if (state.hlsInstance) {
        state.hlsInstance.destroy();
        state.hlsInstance = null;
    }
    
    // 暫停 YouTube 播放器，而不是銷毀它
    if (state.youtubePlayer && typeof state.youtubePlayer.pauseVideo === 'function') {
        try {
            state.youtubePlayer.pauseVideo();
        } catch (e) {
            console.error("暫停 YouTube 播放器失敗:", e);
        }
    }
    
    state.isPlaying = false;
    dom.playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
    dom.audioVisualizer.classList.remove('playing');
    dom.visualizerStatusText.innerText = '請選擇頻道開始收聽';
    initLucideIcons();
}

// 播放/暫停切換
function togglePlayPause() {
    if (!state.currentChannel) return;
    
    if (state.isPlaying) {
        // 暫停
        if (state.currentChannel.type === 'youtube') {
            if (state.youtubePlayer && typeof state.youtubePlayer.pauseVideo === 'function') {
                state.youtubePlayer.pauseVideo();
            }
        } else {
            dom.audioPlayer.pause();
        }
        state.isPlaying = false;
        dom.playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
        dom.audioVisualizer.classList.remove('playing');
        dom.visualizerStatusText.innerText = '已暫停播放';
    } else {
        // 播放
        if (state.currentChannel.type === 'youtube') {
            if (state.youtubePlayer && typeof state.youtubePlayer.playVideo === 'function') {
                state.youtubePlayer.playVideo();
            }
        } else {
            dom.audioPlayer.play().catch(err => {
                console.error("無法播放音訊:", err);
            });
        }
        state.isPlaying = true;
        dom.playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
        dom.audioVisualizer.classList.add('playing');
        dom.visualizerStatusText.innerText = state.currentChannel.type === 'youtube' ? '電視直播音訊播放中...' : '廣播電台播放中...';
    }
    
    updatePlayingStatusUI();
    initLucideIcons();
}

// 透過全域跨域代理動態解析 Channel ID 或 Handle 的當下最新直播 Video ID (/live)
async function resolveLiveVideoId(channelOrHandle) {
    try {
        let liveUrl = '';
        if (channelOrHandle.startsWith('UC')) {
            liveUrl = `https://www.youtube.com/channel/${channelOrHandle}/live`;
        } else if (channelOrHandle.startsWith('@')) {
            liveUrl = `https://www.youtube.com/${channelOrHandle}/live`;
        }
        if (liveUrl) {
            const proxies = [
                `https://api.allorigins.win/raw?url=${encodeURIComponent(liveUrl)}`,
                `https://corsproxy.io/?${encodeURIComponent(liveUrl)}`
            ];
            for (const proxyUrl of proxies) {
                try {
                    const res = await fetch(proxyUrl);
                    if (res.ok) {
                        const html = await res.text();
                        const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
                        if (match && match[1]) {
                            console.log("動態解析到最新直播 Video ID:", match[1]);
                            return match[1];
                        }
                    }
                } catch (err) {}
            }
        }
    } catch (e) {
        console.warn("自動解析最新直播 ID 失敗:", e);
    }
    return null;
}

// 播放 YouTube 影片直播 (採用 Singleton 模式以確保使用者同步點擊時直接播放，100% 有聲)
async function playYoutubeVideo(videoId) {
    let targetVideoId = videoId;
    const isChannelId = videoId.length === 24 && videoId.startsWith('UC');
    const isHandle = videoId.startsWith('@');

    // 如果傳入的是 Channel ID 或 Handle，嘗試非同步動態抓取當下最新的直播 Video ID
    if (isChannelId || isHandle) {
        const resolvedId = await resolveLiveVideoId(videoId);
        if (resolvedId) {
            targetVideoId = resolvedId;
        } else if (state.currentChannel && state.currentChannel.fallback) {
            targetVideoId = state.currentChannel.fallback;
        } else {
            recreateYoutubePlayer(videoId);
            return;
        }
    }

    if (state.youtubePlayer && typeof state.youtubePlayer.loadVideoById === 'function') {
        try {
            // 同步在 click 的 event stack 中加載與播放，避免瀏覽器 Autoplay Policy 判定為非同步自動播放而靜音
            if (typeof state.youtubePlayer.unMute === 'function') {
                state.youtubePlayer.unMute();
            }
            state.youtubePlayer.setVolume(state.volume);
            state.youtubePlayer.loadVideoById(targetVideoId);
            state.youtubePlayer.playVideo();
        } catch (e) {
            console.error("使用 loadVideoById 播放失敗，嘗試重建播放器:", e);
            recreateYoutubePlayer(targetVideoId);
        }
    } else {
        recreateYoutubePlayer(targetVideoId);
    }
}

// 當 Singleton 播放器不存在或出錯時的重建/初始化方法
function recreateYoutubePlayer(videoId) {
    const wrapper = document.getElementById('video-wrapper');
    wrapper.innerHTML = '<div id="youtube-player"></div>';
    createYoutubePlayer(videoId);
}

// 建立影片 ID 或頻道直播播放器 (備用方法，在初次初始化或單例失效時使用)
function createYoutubePlayer(videoId) {
    if (!state.isYoutubeReady) {
        console.warn("YouTube API 尚未就緒，一秒後重試...");
        setTimeout(() => createYoutubePlayer(videoId), 1000);
        return;
    }

    try {
        const isChannelId = videoId.length === 24 && videoId.startsWith('UC');
        
        let playerOptions = {
            height: '100%',
            width: '100%',
            playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                enablejsapi: 1
            },
            events: {
                onReady: (event) => {
                    if (typeof event.target.unMute === 'function') {
                        event.target.unMute();
                    }
                    event.target.setVolume(state.volume);
                    event.target.playVideo();
                },
                onError: async (event) => {
                    console.warn("YouTube 播放器發生錯誤 (Error Code: " + event.data + ")");
                    // 當影片過期(100/2)或嵌入受限(101/150/153)時，自動對 channelId 發起最新 /live 直播 ID 自癒檢索
                    if (state.currentChannel && state.currentChannel.channelId) {
                        console.log(`[${state.currentChannel.name}] 直播 ID 可能失效，啟動動態自癒檢索...`);
                        const freshVideoId = await resolveLiveVideoId(state.currentChannel.channelId);
                        if (freshVideoId && freshVideoId !== state.currentChannel.value) {
                            state.currentChannel.value = freshVideoId;
                            playYoutubeVideo(freshVideoId);
                            return;
                        }
                    }
                    if (state.currentChannel && state.currentChannel.fallback) {
                        playYoutubeVideo(state.currentChannel.fallback);
                        return;
                    }
                    // 若為嵌入限制錯誤 (101、150、153)，直接在新分頁開啟 YouTube 直播頁面
                    if ([101, 150, 153].includes(event.data)) {
                        const externalUrl = `https://www.youtube.com/watch?v=${videoId}`;
                        console.warn("嵌入受限，於新分頁開啟 YouTube ", externalUrl);
                        window.open(externalUrl, "_blank");
                    }
                },
                onStateChange: (event) => {
                    handleYoutubePlayerStateChange(event.data);
                }
            }
        };

        if (isChannelId) {
            // 如果是頻道 ID，我們必須手動把 iframe 的 src 設定為 live_stream
            const wrapper = document.getElementById('video-wrapper');
            wrapper.innerHTML = `<iframe id="youtube-player" width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=${videoId}&enablejsapi=1&autoplay=1&mute=0&controls=0&origin=${window.location.origin}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            
            // 然後我們用 YT.Player 來綁定這個 iframe 以控制音量和狀態
            state.youtubePlayer = new YT.Player('youtube-player', {
                events: playerOptions.events
            });
        } else {
            // 如果是普通的影片 ID，正常建立播放器
            state.youtubePlayer = new YT.Player('youtube-player', {
                ...playerOptions,
                videoId: videoId
            });
        }
    } catch (e) {
        console.error("建立 YouTube Player 失敗:", e);
    }
}

// 處理 YouTube 狀態更新
function handleYoutubePlayerStateChange(playerState) {
    if (playerState === YT.PlayerState.PLAYING) {
        state.isPlaying = true;
        
        // 確保播放時強迫解開靜音並同步設定音量
        if (state.youtubePlayer) {
            try {
                if (typeof state.youtubePlayer.unMute === 'function') {
                    state.youtubePlayer.unMute();
                }
                if (typeof state.youtubePlayer.setVolume === 'function') {
                    state.youtubePlayer.setVolume(state.volume);
                }
            } catch (e) {}
        }

        dom.playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
        dom.audioVisualizer.classList.add('playing');
        dom.visualizerStatusText.innerText = '電視直播音訊播放中...';
    } else if (playerState === YT.PlayerState.PAUSED) {
        state.isPlaying = false;
        dom.playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
        dom.audioVisualizer.classList.remove('playing');
        dom.visualizerStatusText.innerText = '已暫停播放';
    }
    initLucideIcons();
}

// 播放廣播/音訊串流
function playAudioStream(url) {
    const audio = dom.audioPlayer;
    audio.volume = state.volume / 100;
    
    if (state.hlsInstance) {
        state.hlsInstance.destroy();
        state.hlsInstance = null;
    }
    
    // 統一的錯誤處理機制，用以在播放失敗時重置 UI 狀態
    const handlePlayError = (err) => {
        console.error("音訊播放失敗，可能是失效的網址或有 CORS 安全限制:", err);
        state.isPlaying = false;
        dom.playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
        dom.audioVisualizer.classList.remove('playing');
        dom.visualizerStatusText.innerText = '播放失敗！此電台可能暫時斷訊或有跨域限制';
        updatePlayingStatusUI();
        initLucideIcons();
    };

    // 檢查是否為 HLS 串流 (.m3u8)
    if (url.includes('.m3u8') || url.includes('.M3U8')) {
        if (Hls.isSupported()) {
            state.hlsInstance = new Hls();
            state.hlsInstance.loadSource(url);
            state.hlsInstance.attachMedia(audio);
            state.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(handlePlayError);
            });
            state.hlsInstance.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("HLS 致命錯誤:", data.type);
                    handlePlayError(data);
                }
            });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari 原生支援播放 HLS
            audio.src = url;
            audio.addEventListener('canplay', () => {
                audio.play().catch(handlePlayError);
            });
        } else {
            alert("您的瀏覽器不支援播放 HLS 串流新聞。");
        }
    } else {
        // 一般 MP3 / AAC 串流音訊
        audio.src = url;
        audio.play().catch(handlePlayError);
    }
}

// 調整音量
function setVolume(val) {
    state.volume = val;
    dom.volumeSlider.value = val;
    dom.volumeValue.innerText = `${val}%`;
    
    // 同步更新圖示
    if (val == 0) {
        dom.volumeIcon.setAttribute('data-lucide', 'volume-x');
    } else if (val < 40) {
        dom.volumeIcon.setAttribute('data-lucide', 'volume');
    } else if (val < 80) {
        dom.volumeIcon.setAttribute('data-lucide', 'volume-1');
    } else {
        dom.volumeIcon.setAttribute('data-lucide', 'volume-2');
    }
    initLucideIcons();
    
    // 更新 YouTube 音量
    if (state.youtubePlayer && typeof state.youtubePlayer.setVolume === 'function') {
        try {
            state.youtubePlayer.setVolume(val);
        } catch (e) {}
    }
    
    // 更新 HTML5 Audio 音量
    dom.audioPlayer.volume = val / 100;
}

// 更新所有頻道卡片的播放狀態 UI
function updatePlayingStatusUI() {
    const cards = document.querySelectorAll('.channel-card');
    cards.forEach(card => {
        const id = card.dataset.id;
        const indicator = card.querySelector('.play-state-indicator');
        
        if (state.currentChannel && id === state.currentChannel.id) {
            card.classList.add('playing');
            if (state.isPlaying) {
                indicator.innerHTML = '<i data-lucide="volume-2"></i>';
            } else {
                indicator.innerHTML = '<i data-lucide="play"></i>';
            }
        } else {
            card.classList.remove('playing');
            indicator.innerHTML = '<i data-lucide="play" class="hover-play-icon"></i>';
        }
    });
    initLucideIcons();
}

/* ==========================================
   自訂頻道新增與刪除
   ========================================== */

// 解析 YouTube 網址取得 Video ID 或 Channel ID (支援 /channel/UC.../live 直播捷徑)
function extractYoutubeId(url) {
    if (!url) return '';
    
    const trimmed = url.trim();
    
    // 如果長度為 11 且不包含網址特殊字元，可能已經是 Video ID
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
        return trimmed;
    }
    
    // 如果長度為 24 且以 UC 開頭，可能已經是 Channel ID
    if (trimmed.length === 24 && trimmed.startsWith('UC') && !trimmed.includes('/') && !trimmed.includes('.')) {
        return trimmed;
    }
    
    // 檢查 Channel ID 網址 (包含 /channel/UC.../live 或 /channel/UC...)
    const channelMatch = trimmed.match(/(?:youtube\.com\/channel\/)(UC[a-zA-Z0-9_-]{22})(?:\/live)?/);
    if (channelMatch && channelMatch[1]) {
        return channelMatch[1];
    }
    
    // 檢查一般影片 ID 網址 (11 位)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

// 新增自訂頻道
function addCustomChannel(name, type, urlVal) {
    let resolvedValue = urlVal.trim();
    let desc = '';
    
    if (type === 'youtube') {
        const youtubeId = extractYoutubeId(resolvedValue);
        if (!youtubeId) {
            alert('無法解析 YouTube 影片或頻道 ID！請輸入正確的直播/影片網址 (例如包含 /channel/UC.../live) 或 11/24 字元 ID。');
            return;
        }
        resolvedValue = youtubeId;
        desc = youtubeId.startsWith('UC') ? '自訂 YouTube 頻道直播 (僅聽音訊)' : '自訂 YouTube 影片 (僅聽音訊)';
    } else {
        // 音訊串流
        if (!resolvedValue.startsWith('http://') && !resolvedValue.startsWith('https://')) {
            alert('音訊串流網址必須以 http:// 或 https:// 開頭！');
            return;
        }
        desc = '自訂音訊串流廣播';
    }
    
    const newChannel = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        desc: desc,
        type: type,
        value: resolvedValue
    };
    
    state.customChannels.push(newChannel);
    saveCustomChannels();
    renderCustomGrid();
    
    // 重設表單並收起面板
    dom.addChannelForm.reset();
    if (dom.addChannelPane) {
        dom.addChannelPane.style.display = 'none';
    }
    if (dom.toggleAddPaneBtn) {
        dom.toggleAddPaneBtn.classList.remove('active');
    }
    
    // 自動切換到自訂頻道分頁，方便觀看新增結果
    switchTab('custom');
}

// 刪除自訂頻道
function deleteCustomChannel(id) {
    if (confirm('確定要刪除此頻道嗎？')) {
        // 如果目前正在播放這個頻道，先停止播放
        if (state.currentChannel && state.currentChannel.id === id) {
            stopAllPlayers();
            dom.playPauseBtn.disabled = true;
            dom.playerChannelTitle.innerText = '請選擇頻道開始收聽';
            dom.playerChannelDesc.innerText = '支援電視新聞音訊與廣播電台串流，節省手機螢幕頻寬電力';
            dom.playerChannelType.innerText = '準備就緒';
            dom.audioVisualizer.classList.remove('playing');
            dom.visualizerStatusText.innerText = '請點選下方新聞頻道';
        }
        
        state.customChannels = state.customChannels.filter(c => c.id !== id);
        saveCustomChannels();
        renderCustomGrid();
    }
}

// 折疊面板切換 (新增面板 / 轉移面板)
function toggleCustomPane(paneType) {
    if (!dom.addChannelPane || !dom.transferChannelPane) return;

    if (paneType === 'add') {
        const isHidden = dom.addChannelPane.style.display === 'none';
        dom.addChannelPane.style.display = isHidden ? 'block' : 'none';
        dom.transferChannelPane.style.display = 'none';
        
        dom.toggleAddPaneBtn.classList.toggle('active', isHidden);
        dom.toggleTransferPaneBtn.classList.remove('active');
    } else if (paneType === 'transfer') {
        const isHidden = dom.transferChannelPane.style.display === 'none';
        dom.transferChannelPane.style.display = isHidden ? 'block' : 'none';
        dom.addChannelPane.style.display = 'none';
        
        dom.toggleTransferPaneBtn.classList.toggle('active', isHidden);
        dom.toggleAddPaneBtn.classList.remove('active');
    }
    initLucideIcons();
}

// 匯出自訂頻道 JSON 檔案
function exportCustomChannelsJson() {
    if (state.customChannels.length === 0) {
        alert('目前沒有自訂頻道可供匯出。');
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.customChannels, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tw_news_custom_channels_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// 讀取 JSON 檔案並匯入頻道
function importCustomChannelsJson(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const rawContent = e.target.result;
            const importedChannels = normalizeImportedChannels(rawContent);

            const confirmed = confirm(`即將匯入 ${importedChannels.length} 個自訂頻道，將覆蓋目前裝置上的自訂頻道清單。是否繼續？`);
            if (!confirmed) return;

            if (state.currentChannel && state.currentChannel.id.startsWith('custom-')) {
                stopAllPlayers();
                dom.playPauseBtn.disabled = true;
                dom.playerChannelTitle.innerText = '請選擇頻道開始收聽';
                dom.playerChannelDesc.innerText = '支援電視新聞音訊與廣播電台串流，節省手機螢幕頻寬電力';
                dom.playerChannelType.innerText = '準備就緒';
            }

            state.customChannels = importedChannels;
            saveCustomChannels();
            renderCustomGrid();
            
            // 收起轉移面板
            dom.transferChannelPane.style.display = 'none';
            dom.toggleTransferPaneBtn.classList.remove('active');
            
            alert('自訂頻道已成功由 JSON 檔案讀取匯入！');
        } catch (err) {
            alert(`JSON 檔案讀取失敗：${err.message}`);
        }
    };
    reader.readAsText(file);
}

// 讀取貼上的 JSON 文字內容並匯入頻道
function importCustomChannelsText() {
    if (!dom.customChannelsTextInput) return;
    const rawContent = dom.customChannelsTextInput.value.trim();
    if (!rawContent) {
        alert('請先在文字框貼上 JSON 設定內容！');
        return;
    }

    try {
        const importedChannels = normalizeImportedChannels(rawContent);
        const confirmed = confirm(`即將匯入 ${importedChannels.length} 個自訂頻道，將覆蓋目前裝置上的自訂頻道清單。是否繼續？`);
        if (!confirmed) return;

        if (state.currentChannel && state.currentChannel.id.startsWith('custom-')) {
            stopAllPlayers();
            dom.playPauseBtn.disabled = true;
            dom.playerChannelTitle.innerText = '請選擇頻道開始收聽';
            dom.playerChannelDesc.innerText = '支援電視新聞音訊與廣播電台串流，節省手機螢幕頻寬電力';
            dom.playerChannelType.innerText = '準備就緒';
        }

        state.customChannels = importedChannels;
        saveCustomChannels();
        renderCustomGrid();
        
        // 清空輸入並收起轉移面板
        dom.customChannelsTextInput.value = '';
        dom.transferChannelPane.style.display = 'none';
        dom.toggleTransferPaneBtn.classList.remove('active');
        
        alert(`成功匯入 ${importedChannels.length} 個自訂頻道！`);
    } catch (err) {
        alert(`JSON 內容解析失敗：${err.message}`);
    }
}

/* ==========================================
   事件監聽與分頁切換
   ========================================== */

// 分頁切換
function switchTab(tabId) {
    // 切換 Tab 按鈕狀態
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 切換 Tab 內容顯示
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === `tab-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

function setupEventListeners() {
    // Tab 切換事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // 播放/暫停按鈕
    dom.playPauseBtn.addEventListener('click', () => {
        togglePlayPause();
    });
    
    // 音量滑桿
    dom.volumeSlider.addEventListener('input', (e) => {
        setVolume(parseInt(e.target.value));
    });
    
    // 靜音切換 (點擊音量圖示)
    let previousVolume = 80;
    dom.volumeIcon.addEventListener('click', () => {
        if (state.volume > 0) {
            previousVolume = state.volume;
            setVolume(0);
        } else {
            setVolume(previousVolume);
        }
    });
    
    // 新增頻道表單送出
    dom.addChannelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addCustomChannel(
            dom.newChannelName.value,
            dom.newChannelType.value,
            dom.newChannelUrl.value
        );
    });

    // 自訂頻道折疊面板切換按鈕
    if (dom.toggleAddPaneBtn) {
        dom.toggleAddPaneBtn.addEventListener('click', () => toggleCustomPane('add'));
    }
    if (dom.toggleTransferPaneBtn) {
        dom.toggleTransferPaneBtn.addEventListener('click', () => toggleCustomPane('transfer'));
    }

    // JSON 檔案匯出與匯入
    if (dom.exportJsonFileBtn) {
        dom.exportJsonFileBtn.addEventListener('click', exportCustomChannelsJson);
    }
    if (dom.importJsonTriggerBtn && dom.importJsonFileInput) {
        dom.importJsonTriggerBtn.addEventListener('click', () => {
            dom.importJsonFileInput.value = '';
            dom.importJsonFileInput.click();
        });
        dom.importJsonFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                importCustomChannelsJson(e.target.files[0]);
            }
        });
    }

    // 文字貼上匯入
    if (dom.importTextBtn) {
        dom.importTextBtn.addEventListener('click', importCustomChannelsText);
    }
}

// 啟動 App
document.addEventListener('DOMContentLoaded', initApp);

// Register PWA service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('✅ Service Worker registered'))
    .catch(err => console.error('❌ Service Worker registration failed', err));
}
