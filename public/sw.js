const version = "12140809";
const root = "/";

let activeCaches = [
	`content-${version}`
];

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(`content-${version}`).then(cache => cache.addAll([
			root,
			root + "assets/css/style.css",
			root + "assets/img/favicon.png",
			root + "assets/js/script.js",
			root + "assets/img/pattern.gif",
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

// Fetch and save content to bucket
async function fetchContent(event) {
	const networkFetch = fetch(event.request);

	event.waitUntil(
		networkFetch.then(response => {
			const responseClone = response.clone();
			caches.open("bucket").then(cache => cache.put(event.request, responseClone));
		})
	);

	const response = await caches.match(event.request);
	return response || networkFetch;
}

self.addEventListener("fetch", event => {
	const url = new URL(event.request.url);
	const origin = (url.origin == location.origin) ? true : false; // Is same-origin
	
	// Fetch cross-origin content
	if(!origin) {
		event.respondWith(fetch(url.href));
		return;
	}

	// Get pattern.gif from generator. Fallback to cache on failure
	if(origin && url.pathname.endsWith("pattern.gif")) {
		const pattern = new Request(`${location.origin}/${root}assets/img/pattern.php`);
		event.respondWith(
			fetch(pattern).catch(() => {
				return caches.match(event.request);
			})
		);
		return;
	}

	// Respond with content for cache or fetch and save
	event.respondWith(
		caches.match(event.request).then(response => response || fetchContent(event))
	);
});
// Victor Westerlund
