importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/info.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/icon/ball.png', revision: '1' },
    { url: '/icon/icon_ball_192.png', revision: '1' },
    { url: '/icon/icon_ball_256.png', revision: '1' },
    { url: '/icon/icon_ball_512.png', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/date.format.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/register.js', revision: '1' },
    { url: '/src/font-awesome-4.7.0/css/font-awesome.min.css', revision: '1' },
    { url: '/src/font-awesome-4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0', revision: '1' },
    { url: '/src/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0', revision: '1' },
]
);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp ('/info.html'), 
  workbox.strategies.cacheFirst({
    networkTimeoutSeconds: 1,
    cacheName: 'info',
    plugin: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'), 
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages',
  })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2'),
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 1,
    cacheName: 'api-football',
    Plugin: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 6 * 60 * 60, //12 jam
      }),
    ]
  })
);

self.addEventListener('notificationclick', function (event) {
  // Tambahkan baris berikut
  event.notification.close();
  // Kode lain disembunyikan agar lebih ringkas. 
});

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'icon/icon_ball_192.png',
    badge: 'icon/ball.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});