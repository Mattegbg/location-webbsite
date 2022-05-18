self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll(['index.html', 'index.js', 'styles.css', 'offline.html'])
        })
    );

    self.skipWaiting();
    console.log('Service worker installed')
});

self.addEventListener('activate', (event) => {
    self.skipWaiting();
    console.log('Service worker activated')
});

//detta gör att vi kan se om appen är online eller offline. Vi får olika meddelanden vid on/offline.
self.addEventListener('fetch', async (event) => {
    console.log(event.request.url);
    if(!navigator.onLine) {
        console.log('Offline');
        event.respondWith(
            caches.match(event.request).then((response) => {
                console.log(response)
                if(response){
                    return response
                } else {
                    return caches.match(new Request('offline.html'))
                }
            })
        )
    }else {
        console.log('Online')
        const res = await updateCache(event.req);
        return res;
    }
});

async function updateCache(request) {
    const response = await fetch(request);
    const cache = await cache.open('v1'); // öppnar cachen

    cache.put(request, response.clone()); // klonar och skickar en kopia

    return response; //skickar tillbaka cachen
}