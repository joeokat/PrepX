const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
];

const getFixedUrl = (req) => {
    const now = Date.now();
    const url = new URL(req.url);
    url.protocol = self.location.protocol;

    if (url.hostname === self.location.hostname) {
        url.search += `${url.search ? '&' : '?'}cache-bust=${now}`;
    }
    return url.href;
};

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => 
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== 'pwa-cache') {
                        return caches.delete(cacheName);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    if (HOSTNAME_WHITELIST.includes(requestUrl.hostname)) {
        const cachedResponse = caches.match(event.request);
        const fixedUrl = getFixedUrl(event.request);
        const networkFetch = fetch(fixedUrl, { cache: 'no-store' }).then(response => response.clone());

        event.respondWith(
            Promise.race([networkFetch.catch(() => cachedResponse), cachedResponse])
                .then(response => response || networkFetch)
                .catch(() => { /* eat any errors */ })
        );

        event.waitUntil(
            Promise.all([networkFetch, caches.open('pwa-cache')])
                .then(([response, cache]) => {
                    if (response.ok) {
                        return cache.put(event.request, response);
                    }
                })
                .catch(() => { /* eat any errors */ })
        );
    }
});

// Force a service worker update periodically
setInterval(() => {
    self.registration.update();
}, 3600000); // Check for updates every hour
