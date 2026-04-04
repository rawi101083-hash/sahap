const CACHE_NAME = 'sahab-pos-dynamic-v2';

self.addEventListener('install', (event) => {
    // Aggressive auto-update: force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Tell the active service worker to take control of the page immediately.
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network First Strategy to Ensure Immediate Updates upon Push
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Cache the fresh response for offline use, if successful
                if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return networkResponse;
            })
            .catch(() => {
                // If offline or network fails, fallback to cached version
                return caches.match(event.request);
            })
    );
});
