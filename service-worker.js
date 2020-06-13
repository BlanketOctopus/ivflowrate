const CACHE_NAME = "ivform-v1.1";
const assets = [
  '/',
  '/index.html',
  '/components/IVForm.js',
  '/icons/icon-192.png',
  '/icons/icon-512.ong',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  'https://unpkg.com/react@16/umd/react.production.min.js',
  'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
  '',
];
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});