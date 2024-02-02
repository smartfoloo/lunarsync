var allowedDomains = window.location.hostname;

var referringUrl = document.referrer;

var isAllowedDomain = allowedDomain.some(function (domain) {
  return referringUrl.indexOf(domain) !== -1;
});

if (!isAllowedDomain) {
  window.location.href = "https://helloskids.pages.dev";
}
