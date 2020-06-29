const CACHE_NAME = 'sw-V1';

self.addEventListener('install', function (event) {
  console.log('->sw install');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        // 先把所有的静态资源缓存了
        return cache.addAll([
          '/index.html',
          '/assets/1.png',
          '/assets/2.png',
          '/assets/3.png',
          'https://cdn.medlinker.com/ih/_next/static/images/chufang.1af9e4c.png',
        ]);
      })
      .then(() => {
        // 跳过等待，直接重启
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('-> sw actived');

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        keys
          .filter((key) => key !== CACHE_NAME)
          .forEach((key) => caches.delete(key));
      })
      .then(() => {
        // 通知所有客户端我来了
        self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('-> sw new fetch');

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .match(event.request)
        .then((res) => {
          if (res) {
            return res;
          }
          return fetch(event.request);
        })
        .then((res) => {
          // response被消费后会被lock，需要克隆个新的。
          // FIXME: demo缓存了所有请求，正常来说我们应该缓存的真正需要缓存请求，例如图片，字体和部分接口，不然在一个sw生命周期内
          // 使用获取的会是旧的值
          cache.put(event.request, res.clone());
          return res;
        });
    })
  );
});
