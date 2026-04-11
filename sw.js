const CACHE_NAME = 'sahab-pos-offline-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js?v=7.0',
    './logo.png',
    'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching critical static assets for OFFLINE PWA...');
                // We use catch for each asset to prevent a single 404 from blocking the entire cache
                return Promise.allSettled(ASSETS_TO_CACHE.map(url => {
                    return fetch(url).then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return cache.put(url, response);
                    }).catch(err => console.warn('[Service Worker] Failed to cache:', url, err));
                }));
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Always bypass cached assets on Firebase Cloud APIs.
    if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
        return; // Let browser handle it directly (Network Only)
    }

    // Cache First, falling back to network (AGGRESSIVE OFFLINE FIRST)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Found perfectly matching cache! Return it instantly (Insane offline speed)
            if (cachedResponse) {
                // Background update using Stale-While-Revalidate pattern (optional but awesome for PWA)
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                }).catch(() => { /* Ignore background fetch failures when offline */ });
                
                return cachedResponse;
            }

            // Not found in cache. Fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Cache the newly fetched resource for future offline usage
                if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If network fails (OFFLINE) and not in cache, fallback gracefully
                console.warn('[Service Worker] Offline and asset not found in cache:', event.request.url);
            });
        })
    );
});
