    self.addEventListener("install", e => {
        self.skipWaiting()
        e.waitUntil(
            caches.open('v1').then(cache => {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/styles.css',
                    '/app.js',
                    '/sw.js',
                    '/site.manifest.json',
                    '/assets/icon.png',
                    '/assets/logo.png',
                    '/assets/favicon.ico'
                ])
            })
        )
    });

    self.addEventListener("fetch", e => {
        e.respondWith(
            caches.match(e.request) || fetch(e.request)
        )
    });

    // const HOSTNAME_WHITELIST = [
    //     self.location.hostname,
    //     'fonts.gstatic.com',
    //     'fonts.googleapis.com',
    //     'cdn.jsdelivr.net'
    // ]

    // const getFixedUrl = (req) => {
    //     var now = Date.now()
    //     var url = new URL(req.url)
    //     url.protocol = self.location.protocol

    //     if (url.hostname === self.location.hostname) {
    //         url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
    //     }
    //     return url.href
    // }

    // self.addEventListener('activate', event => {
    //   event.waitUntil(self.clients.claim())
    // })

    // self.addEventListener('launch', (event) => {
    //   event.waitUntil(clients.openWindow('/index.html'));
    // });

    // self.addEventListener('fetch', event => {
    // if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
    //     const cached = caches.match(event.request)
    //     const fixedUrl = getFixedUrl(event.request)
    //     const fetched = fetch(fixedUrl, { cache: 'no-store' })
    //     const fetchedCopy = fetched.then(resp => resp.clone())

    //     event.respondWith(
    //     Promise.race([fetched.catch(_ => cached), cached])
    //         .then(resp => resp || fetched)
    //         .catch(_ => { /* eat any errors */ })
    //     )

    //     event.waitUntil(
    //     Promise.all([fetchedCopy, caches.open("pwa-cache")])
    //         .then(([response, cache]) => response.ok && cache.put(event.request, response))
    //         .catch(_ => { /* eat any errors */ })
    //     )
    // }
    // })
