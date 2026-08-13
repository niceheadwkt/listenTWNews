const CACHE_NAME = 'tw-news-reader-v10'; // 升級快取版本至 v10
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.svg'
];

// 安裝 Service Worker 並快取基本 UI 資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 激活 Service Worker 並清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 攔截請求
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // 只處理同網域 (本機) 資源的快取，避免快取 YouTube 直播或外部音訊串流
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // 返回快取資源，同時在背景更新 (Stale-While-Revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {/* 忽略背景更新失敗，例如離線時 */});
          
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
  } else {
    // 外部請求 (YouTube 直播 iframe, 音訊串流, 外部 CDN 資源如 Lucide / Hls.js)
    // 這些資源使用 Network-First 或直接請求，不進行快取
    event.respondWith(
      fetch(event.request).catch((err) => {
        // 如果外部 CDN 資源載入失敗且有快取則使用快取 (例如 CDN js/css)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          throw err;
        });
      })
    );
  }
});
