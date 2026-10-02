const CACHE_NAME = "money-journal-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./icons/icon-192.png",
  "./icons/icon-512.png",

  "./fonts/DMSans-Regular.woff2",
  "./fonts/DMSans-Medium.woff2",
  "./fonts/DMSans-SemiBold.woff2",

  "./fonts/CormorantGaramond-Medium.woff2",
  "./fonts/CormorantGaramond-SemiBold.woff2",
  "./fonts/CormorantGaramond-Bold.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request);
    })
  );
});
