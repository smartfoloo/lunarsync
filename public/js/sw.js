function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/sw.js', { scope: '/' }).then(() => {
      print("registarred");

    }).catch(error => {
      console.log("oopsie daisy- failed to register", error);
    });
  }
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('music-player-cache').then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/games.html",
        "/play.html",
        "/js/games.js",
        "/js/index.js",
        "/js/fullscreen.js",
        "/js/navbar.js",
        "/js/settings.js",
        "/js/randomtext.js",
        "/js/profile.js",
        "/extras.html",
        "/profile.html",
        "/settings.html",
        "/terms.html",
        "/404.html",
        "/privacy-policy.html"
      ]);
    })
  );
});