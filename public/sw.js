
const version = 'v2';

self.addEventListener('install', function(event) {
  console.log("Install", version);
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        'index.htm',
        'tachyons.css',
        'petite-vue.js',
        'elements.js',
        'cuid.js',
        'names.js',
        'icon.png',
        'notfound.txt'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      //console.log("Return", response);
      return response;
    } else {
      //console.log("Need to fetch");
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open(version).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/notfound.txt');
      });
    }
  }));
});