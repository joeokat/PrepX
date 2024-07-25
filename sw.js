// const HOSTNAME_WHITELIST = [
//     self.location.hostname,
//     'fonts.gstatic.com',
//     'fonts.googleapis.com',
//     'cdn.jsdelivr.net'
// ];

// const getFixedUrl = (req) => {
//     const now = Date.now();
//     const url = new URL(req.url);
//     url.protocol = self.location.protocol;

//     if (url.hostname === self.location.hostname) {
//         url.search += `${url.search ? '&' : '?'}cache-bust=${now}`;
//     }
//     return url.href;
// };

// self.addEventListener('install', event => {
//     self.skipWaiting();
// });

// self.addEventListener('activate', event => {
//     event.waitUntil(
//         caches.keys().then(cacheNames => 
//             Promise.all(
//                 cacheNames.map(cacheName => {
//                     if (cacheName !== 'pwa-cache') {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             )
//         ).then(() => self.clients.claim())
//     );
// });

// self.addEventListener('fetch', event => {
//     const requestUrl = new URL(event.request.url);
//     if (HOSTNAME_WHITELIST.includes(requestUrl.hostname)) {
//         const cachedResponse = caches.match(event.request);
//         const fixedUrl = getFixedUrl(event.request);
//         const networkFetch = fetch(fixedUrl, { cache: 'no-store' }).then(response => response.clone());

//         event.respondWith(
//             Promise.race([networkFetch.catch(() => cachedResponse), cachedResponse])
//                 .then(response => response || networkFetch)
//                 .catch(() => { /* eat any errors */ })
//         );

//         event.waitUntil(
//             Promise.all([networkFetch, caches.open('pwa-cache')])
//                 .then(([response, cache]) => {
//                     if (response.ok) {
//                         return cache.put(event.request, response);
//                     }
//                 })
//                 .catch(() => { /* eat any errors */ })
//         );
//     }
// });

const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
]

    const getFixedUrl = (req) => {
        var now = Date.now()
        var url = new URL(req.url)
        url.protocol = self.location.protocol

        if (url.hostname === self.location.hostname) {
            url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
        }
        return url.href
    }

    self.addEventListener('activate', event => {
      event.waitUntil(self.clients.claim())
    })

    self.addEventListener('launch', (event) => {
      event.waitUntil(clients.openWindow('/index.html'));
    });

    self.addEventListener('fetch', event => {
    if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        const cached = caches.match(event.request)
        const fixedUrl = getFixedUrl(event.request)
        const fetched = fetch(fixedUrl, { cache: 'no-store' })
        const fetchedCopy = fetched.then(resp => resp.clone())

        event.respondWith(
        Promise.race([fetched.catch(_ => cached), cached])
            .then(resp => resp || fetched)
            .catch(_ => { /* eat any errors */ })
        )

        event.waitUntil(
        Promise.all([fetchedCopy, caches.open("pwa-cache")])
            .then(([response, cache]) => response.ok && cache.put(event.request, response))
            .catch(_ => { /* eat any errors */ })
        )
    }
    })

// Force a service worker update periodically
//setInterval(() => {
//    self.registration.update();
//}, 3600000); // Check for updates every hour