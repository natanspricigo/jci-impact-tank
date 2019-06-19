
// https://willianjusten.com.br/como-fazer-seu-site-funcionar-offline-com-pwa/

if ('serviceWorker' in navigator) {
  console.log('ServiceWorker é suportado, vamos usar!');
} else {
  console.log('ServiceWorker não é suportado.');
}
const staticCacheName = "fonemas";

const FILES = [
	"/",
	"/javascripts/jogo-fonemas.js",
	"/javascripts/keys.js",
	"/stylesheets/style.css"
];

this.addEventListener("install", event => {
	this.skipWaiting();
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			return cache.addAll(FILES);
		})
	)
});

this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('willian-justen-')))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Serve from Cache
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline/index.html');
      })
  )
});