const VERSION='ride-care-shell-v4';const FILES=['./','./index.html','./style.css','./app.mjs','./logic.mjs','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('ride-care-shell-')&&name!==VERSION).map(name=>caches.delete(name)))));self.clients.claim()});
// Cache app shell only. Firestore records, Firebase authentication, maps, tiles,
// road routes, and GPS positions are never intercepted or persisted by the worker.
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;if(!FILES.some(file=>new URL(file,self.registration.scope).pathname===url.pathname))return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request)))});
