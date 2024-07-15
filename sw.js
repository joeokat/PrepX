if("ServiceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then(registration => {
      console.log("SW Registered:");
      console.log(registration);
    }).catch(
      error => console.error("SW Registration Failed:", error)
    )
  }
   
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