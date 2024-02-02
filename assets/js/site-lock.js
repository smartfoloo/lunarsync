/* var allowedDomains = [
  "https://platformerdotio.co",
  "https://lightspeedsystems.onrender.com",
  "https://enrichingstudents.onrender.com",
  "https://platformerio.pages.dev",
  "https://arizona-tea.netlify.app",
  "https://nates-cdn.pages.dev",
  "https://platformer-io-7az7.onrender.com",
  "https://schmeckles-forest.pages.dev",
  "https://enrichingstudents.vercel.app",
  "https://precious-snickerdoodle-03da77.netlify.app",
  "https://mellifluous-muffin-002487.netlify.app",
  "https://extraordinary-faun-286888.netlify.app",
  "https://main--vocal-tapioca-5fc81e.netlify.app",
  "https://matheducation.online",
  "https://trust-45p4dpmo0-dgademon.vercel.app",
  "https://extramathwork.netlify.app",
  "https://imaginemathh.netlify.app",
  "https://scienceteststudies.netlify.app",
  "https://eduphoria.pages.dev",
  "https://homeworkbyexoiscool.netlify.app",
  "https://main--candid-sawine-af24ba.netlify.app",
  "https://platformer-io-9h1t.onrender.com",
  "https://platformer-dearrgames.netlify.app",
  "https://yoo-im-asending.netlify.app",
  "https://stop-it.netlify.app",
  "https://xello.pages.dev",
  "https://xello.onrender.com",
  "https://dontleaveplatformer.netlify.app",
  "https://platformerio.tomahawkchurch.org",
  "https://masteryconnect.tecteach.net",
  "https://geometry.kooh.cl",
  ""
];

var referringUrl = document.referrer;

var isAllowedDomain = allowedDomains.some(function (domain) {
  return referringUrl.indexOf(domain) !== -1;
});

if (!isAllowedDomain) {
  window.location.href = "https://helloskids.pages.dev";
}*/

var assetDomain = window.location.hostname;

var referringURL = document.referrer;
var referringDomain = new URL(referringURL).hostname;

if (referringDomain !== assetDomain) {
  window.location.href = 'https://helloskids.pages.dev';
}
