const cacheName = "mws-restaurant-cache-v1";
const cacheFiles = [
	'/',
	'/restaurant.html',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/idb.js',
	'/js/restaurant_info.js',
	'/css/styles.css',
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/4.jpg',
	'/img/5.jpg',
	'/img/6.jpg',
	'/img/7.jpg',
	'/img/8.jpg',
	'/img/9.jpg',
	'/img/10.jpg',
	'/img/favicon.ico',
	'https://fonts.googleapis.com/css?family=Lato:400i|Lobster'
]

// Installing
self.addEventListener('install', function(event){
   // Open a cache and add the static resources
	console.log("Installing Service Worker");
	event.waitUntil(
		caches.open(cacheName)
		.then(function(cache){
			console.log("Caching Files");
			return cache.addAll(cacheFiles);
    })
    .catch( error => console.log('Error adding files to cache', error))
	)
});

// Activating Service Worker
self.addEventListener('activate', function(event){
	console.log("Activating Service Worker");
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(cacheNames.map(function(thisCacheName){
				if(thisCacheName !== cacheName) {
					console.log("Wrong Cache name, removing from: ", thisCacheName);
					return caches.delete(thisCacheName);
				}
			}))
		})
	)
});

// Fetch the files from cache
self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request).then(function(response){
			return response || fetch(event.request);
		})
    );
});