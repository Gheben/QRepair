const CACHE_NAME = 'qrepair-v1';
const urlsToCache = [
  '/login',
  '/dashboard',
  '/index.html',
  '/clients.html',
  '/users.html',
  '/settings.html',
  '/info.html',
  '/style.css',
  '/QRepair.png',
  '/api-client.js'
];

// Installazione del service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log('Service Worker: Cache failed', err))
  );
  self.skipWaiting();
});

// Attivazione del service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Strategia di caching: Network First, fallback su Cache
self.addEventListener('fetch', (event) => {
  // Ignora richieste non-GET e richieste Chrome extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se la richiesta ha successo, aggiorna la cache
        const responseClone = response.clone();
        
        // Cache solo risposte valide
        if (response.status === 200 && response.type === 'basic') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        
        return response;
      })
      .catch(() => {
        // Se la rete fallisce, usa la cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          // Se non c'è in cache, mostra una pagina offline personalizzata
          if (event.request.destination === 'document') {
            return new Response(
              `<!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - QRepair</title>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                    padding: 20px;
                  }
                  .offline-container {
                    max-width: 400px;
                  }
                  h1 { font-size: 3em; margin: 0 0 20px 0; }
                  p { font-size: 1.2em; margin: 10px 0; }
                  button {
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: white;
                    color: #667eea;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <div class="offline-container">
                  <h1>📡</h1>
                  <h2>You're Offline</h2>
                  <p>No internet connection detected.</p>
                  <p>Please check your connection and try again.</p>
                  <button onclick="location.reload()">🔄 Retry</button>
                </div>
              </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          }
        });
      })
  );
});
