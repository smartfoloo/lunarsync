var allowedDomain = window.location.hostname;

var referringUrl = document.referrer;
var referringHostname = new URL(referringUrl).hostname;

if (referringHostname !== allowedDomain) {
  window.location.href = "https://helloskids.pages.dev";
}
