var allowedDomains = [
  "https://stain.espacoextra.pt",
  "https://zoology.isyour.guru",
  "https://cloud.espacoextra.pt",
  "https://bumblebee.kooh.cl",
  "https://ecology.miboletonic.com",
  "https://skate.tomahawkchurch.org",
  "https://geography.towerchile.cl",
  "https://stain.espacoextra.pt",
  "https://cable.sanluix.org",
  "https://light.prt-argentina.org.ar",
  "https://bread.hancockcountyfoodpantry.com",
  "https://state.towerchile.cl",
  "https://snack.prt-argentina.org.ar",
  "https://terrain.fenesisu.moe",
  "https://physics.asoch.cl",
  "https://helloguyspleasestopstealingthis.youramys.com"
];

var referringUrl = document.referrer;

var isAllowedDomain = allowedDomains.some(function (domain) {
  return referringUrl.indexOf(domain) !== -1;
});

if (!isAllowedDomain) {
  window.location.href = "https://helloskids.pages.dev";
}