const CACHE = "quran-v1";
const APP = ["./", "./index.html", "./style.css", "./app.js", "./manifest.webmanifest", "./icon-192.svg", "./icon-512.svg"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys =>
  Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
)));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(cached =>
    cached || fetch(e.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return response;
    }).catch(() => caches.match("./index.html"))
  ));
});
