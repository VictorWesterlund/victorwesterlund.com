const activeCaches = [
	"content-v1"
];

const root = "/victorwesterlund.com/public/";

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open("content-v1").then(cache => cache.addAll([
			root,
			root + "assets/css/style.css",
			root + "assets/img/favicon.png",
			root + "assets/js/script.js",
			root + "assets/fonts/RobotoMono-Bold.woff2",
			root + "assets/fonts/RobotoMono-Regular.woff2"
		]))
	)
});

self.addEventListener("activate", event => {
	event.waitUntil(
		// Delete inactive caches
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if(!activeCaches.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			)
		})
	)
});

/* ---- */

function handleRequest(event) {
	const networkFetch = fetch(event.request);

	event.waitUntil(
		networkFetch.then(response => {
			const responseClone = response.clone();
			caches.open("downloaded").then(cache => cache.put(event.request, responseClone));
		})
	);

	return caches.match(event.request).then(response => response || networkFetch);
}

self.addEventListener("fetch", event => {
	const url = new URL(event.request.url);

	console.log(url);
	if(url.origin != location.origin) {
		event.respondWith(fetch(url.href));
	}

	// if(url.origin == location.origin && url.pathname == root) {
	// 	event.respondWith(caches.match("index.html"));
	// 	return;
	// }

	event.respondWith(caches.match(url.pathname) || handleRequest(event));
});
// Victor Westerlund
