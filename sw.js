// if("ServiceWorker" in navigator){
//     navigator.serviceWorker.register("sw.js").then(registration => {
//       console.log("SW Registered:");
//       console.log(registration);
//     }).catch(
//       error => console.error("SW Registration Failed:", error)
//     )
//   }
   
//  self.addEventListener("install", e => {
//         self.skipWaiting()
//         e.waitUntil(
//             caches.open('v1').then(cache => {
//                 return cache.addAll([
//                     '/',
//                     '/index.html',
//                     '/styles.css',
//                     '/app.js',
//                     '/sw.js',
//                     '/site.manifest.json',
//                     '/assets/icon.png',
//                     '/assets/logo.png',
//                     '/assets/favicon.ico'
//                 ])
//             })
//         )
//     });

//     self.addEventListener("fetch", e => {
//         e.respondWith(
//             caches.match(e.request) || fetch(e.request)
//         )
//     });

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== 'pwa-cache') {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        const cached = caches.match(event.request);
        const fixedUrl = getFixedUrl(event.request);
        const fetched = fetch(fixedUrl, { cache: 'no-store' });
        const fetchedCopy = fetched.then(resp => resp.clone());

        event.respondWith(
            Promise.race([fetched.catch(_ => cached), cached])
                .then(resp => resp || fetched)
                .catch(_ => { /* eat any errors */ })
        );

        event.waitUntil(
            Promise.all([fetchedCopy, caches.open("pwa-cache")])
                .then(([response, cache]) => response.ok && cache.put(event.request, response))
                .catch(_ => { /* eat any errors */ })
        );
    }
});

// Optional: Force a service worker update periodically
setInterval(() => {
    self.registration.update();
}, 3600000); // Check for updates every hour
