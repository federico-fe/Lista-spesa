
const CACHE_NAME = 'spesa-cache-v1';
const URLS_TO_CACHE = [
  'index.html',
  'style.css',
  'script.js',
  'ingredienti.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.map(cache =>
        cache !== CACHE_NAME ? caches.delete(cache) : null
      ))
    )
  );
});
