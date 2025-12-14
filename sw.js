// Service Worker for Buku Pengurusan Digital v2
const CACHE_NAME = 'buku-pengurusan-v2';

// Install - skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate - claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch - cache local files only
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle http/https requests from same origin
  if (url.origin !== location.origin) {
    return;
  }
  
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        
        return cachedResponse || fetchPromise;
      });
    })
  );
});
