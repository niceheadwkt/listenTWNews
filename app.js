/* ==========================================
   台灣新聞收聽 App - 核心應用程式邏輯 (純聽無螢幕版)
   ========================================== */

// 預設電視新聞頻道 (可以使用 Video ID 或 Channel ID。對於經常更換 ID 的電視台，使用 Channel ID 可以一勞永逸自動導向直播)
const DEFAULT_TV_CHANNELS = [
    { id: 'tv-ftv', name: '民視新聞台', desc: 'Formosa TV News 24小時線上直播', type: 'youtube', value: 'ylYJSBUgaMA' },
    { id: 'tv-set', name: '三立新聞台', desc: 'SET News 24小時線上直播 (最新連結)', type: 'youtube', value: 'yeYC0mbSIOo' },
    { id: 'tv-ebc', name: '東森新聞台', desc: 'EBC News 24小時線上直播 (永不失效)', type: 'youtube', value: 'UCR3asjvr_WAaxwJYEDV_Bfw' },
    { id: 'tv-tvbs', name: 'TVBS 新聞台', desc: 'TVBS News 55頻道 24小時直播 (永不失效)', type: 'youtube', value: 'UC15iL3VpP6f2x_t71bH0oLA' },
    { id: 'tv-cts', name: '華視新聞台', desc: 'CTS News 資訊台 24小時直播 (永不失效)', type: 'youtube', value: 'UCDCJyLpbfgeVE9iZiEam-Kg' },
    { id: 'tv-pts', name: '公視新聞台', desc: 'PTS News 24小時線上直播 (永不失效)', type: 'youtube', value: 'UCyV76eYq5n1R9qF9rG9Z-0A' },
    { id: 'tv-cti', name: '中天新聞台', desc: 'CTI News 24小時線上直播 (永不失效)', type: 'youtube', value: 'UCpu3bemTQwAU8PqM4kJdoEQ' }
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
    
    // 表單
    addChannelForm: document.getElementById('add-channel-form'),
    newChannelName: document.getElementById('new-channel-name'),
    newChannelType: document.getElementById('new-channel-type'),
    newChannelUrl: document.getElementById('new-channel-url')
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
        state.youtubePlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: DEFAULT_TV_CHANNELS[0].value, // 預載第一個電視頻道
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                origin: window.location.origin
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
    dom.playerChannelDesc.innerText = channel.desc || (channel.type === 'youtube' ? 'YouTube 影片/直播' : '廣播電台/串流音訊');
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

// 播放 YouTube 影片直播 (採用 Singleton 模式以確保使用者同步點擊時直接播放，100% 有聲)
function playYoutubeVideo(videoId) {
    const isChannelId = videoId.length === 24 && videoId.startsWith('UC');
    
    // 如果是頻道 ID，因為 loadVideoById 不能載入 Channel，我們必須重新建立整個播放器
    if (isChannelId) {
        recreateYoutubePlayer(videoId);
        return;
    }

    if (state.youtubePlayer && typeof state.youtubePlayer.loadVideoById === 'function') {
        try {
            // 同步在 click 的 event stack 中加載與播放，避免瀏覽器 Autoplay Policy 判定為非同步自動播放而靜音
            state.youtubePlayer.loadVideoById(videoId);
            state.youtubePlayer.setVolume(state.volume);
            state.youtubePlayer.playVideo();
        } catch (e) {
            console.error("使用 loadVideoById 播放失敗，嘗試重建播放器:", e);
            recreateYoutubePlayer(videoId);
        }
    } else {
        recreateYoutubePlayer(videoId);
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
                origin: window.location.origin
            },
            events: {
                onReady: (event) => {
                    event.target.setVolume(state.volume);
                    if (!isChannelId) {
                        event.target.playVideo();
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

// 解析 YouTube 網址取得 Video ID
function extractYoutubeId(url) {
    if (!url) return '';
    
    // 如果長度為 11 且不包含網址特殊字元，可能已經是 ID
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
        return url;
    }
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

// 新增自訂頻道
function addCustomChannel(name, type, urlVal) {
    let resolvedValue = urlVal.trim();
    let desc = '';
    
    if (type === 'youtube') {
        const videoId = extractYoutubeId(resolvedValue);
        if (!videoId) {
            alert('無法解析 YouTube 影片 ID，請輸入正確的 YouTube 直播網址或 11 位元 ID！');
            return;
        }
        resolvedValue = videoId;
        desc = '自訂 YouTube 頻道 (僅聽音訊)';
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
    
    // 重設表單
    dom.addChannelForm.reset();
    
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
}

// 啟動 App
document.addEventListener('DOMContentLoaded', initApp);
