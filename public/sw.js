const version = "1612093525";
const root = "/";

let activeCaches = [
	`content-${version}`
];

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(`content-${version}`).then(cache => cache.addAll([
			root + "index.html",
			root + "assets/css/style.css",
			root + "assets/img/favicon.png",
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

// Fetch and cache content to bucket
async function fetchToCache(event) {
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

// Fetch and follow redirects without caching
async function fetchContent(url,i = 0) {
	if(i >= 5) {
		throw new Error("ERR_TOO_MANY_REDIRECTS");
	}

	return await fetch(url).then(response => {
		if(response.redirected) {
			i++;
			return fetchContent(response.url,i);
		}
		return response;
	});
}

self.addEventListener("fetch", event => {
	const url = new URL(event.request.url);
	const origin = (url.origin == location.origin) ? true : false; // Is same-origin

	// Speed up TTFB by serving index file first
	if(origin && url.pathname == "/") {
		event.respondWith(caches.match(root + "index.html"));
		return;
	}
	
	// Fetch cross-origin none-asset content
	if(!origin || (url.pathname.substring(1,7) != "assets")) {
		event.respondWith(fetchContent(url.href));
		return;
	}

	// Get pattern.gif from generator. Fallback to cache on failure
	if(origin && url.pathname.endsWith("pattern.gif")) {
		const pattern = new Request(`${location.origin}${root}assets/img/pattern.php`);
		event.respondWith(fetch(pattern).catch(() => caches.match(root + "assets/img/pattern.gif")));
		return;
	}

	// Respond with content for cache or fetch and save
	event.respondWith(
		caches.match(event.request).then(response => response || fetchToCache(event))
	);
});
// Victor Westerlund
