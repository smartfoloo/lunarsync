window.C3_RegisterSW = undefined;
console.log("remove sw");
// remove all service workers from the page
(function () {
  let attempts = 20;
  let stopSWInterval = setInterval(() => {
    window.C3_RegisterSW = undefined;
    if (navigator.serviceWorker) {
      attempts--;
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        let removed = false;
        for (let registration of registrations) {
          registration.unregister();
          removed = true;
        }
        if (removed || attempts <= 0) {
          clearInterval(stopSWInterval);
        }
      });
    }
  }, 500);
})();
