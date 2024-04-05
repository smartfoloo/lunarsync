const cacheName = "GoGoMan-Bosses Skibidi vs Cameramen-1.0.1";
const contentToCache = [
    "Build/BossesSkibidiVsAgents.loader.js",
    "Build/BossesSkibidiVsAgents.framework.js.unityweb",
    "Build/BossesSkibidiVsAgents.data.unityweb",
    "Build/BossesSkibidiVsAgents.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
