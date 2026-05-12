const CACHE_NAME = "app-cache-v1";
const OFFLINE_FALLBACK = "/";

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching offline page");
      return cache.addAll(["/", "/offline.html"]).catch(() => {
        // If offline.html doesn't exist, just cache root
        return cache.addAll(["/"]);
      });
    })
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim all clients
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and external requests
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((fetchResponse) => {
        // Don't cache error responses
        if (!fetchResponse || fetchResponse.status !== 200) {
          return fetchResponse;
        }

        // Clone and cache successful responses
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return fetchResponse;
      })
      .catch(() => {
        // Try to return cached version first
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("[SW] Serving from cache:", request.url);
            return cachedResponse;
          }

          // For navigation requests, return offline page
          if (request.mode === "navigate") {
            console.log("[SW] Network error - returning fallback");
            return caches.match(OFFLINE_FALLBACK);
          }

          // For other requests, return empty response
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});