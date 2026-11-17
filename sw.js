const CACHE_NAME = 'vtaper-cache-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './bodyweight-box.png',
  './controlled-bodyweight-squat.png',
  './controlled-deadbug.png',
  './decline-push-up.png',
  './incline-floor-press.png',
  './isometric-glute-bridge.png',
  './negative-pull-up.png',
  './overhead-shoulder-press.png',
  './pike-push-up.png',
  './posterior-pelvic-tilt.png',
  './prone-ytw-raises.png',
  './pull-up.png',
  './side-lying-hip-abduction.png',
  './single-arm-lateral-raise.png',
  './stomach-vacuum.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.log('PWA cache pre-load note:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => caches.match('./index.html'))
  );
});
