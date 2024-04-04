window.addEventListener('load', startTrackingTime);
window.addEventListener('pagehide', stopTrackingTime);

var tab = localStorage.getItem('tab');
if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

if (tabData.title) {
  document.title = tabData.title;
}

if (tabData.icon) {
  document.querySelector('link[rel="icon"]').href = tabData.icon;
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('theme', savedTheme);
}

const isLazyLoadingEnabled = localStorage.getItem('lazyLoadEnabled') === 'true';

if (isLazyLoadingEnabled) {
  applyLazyLoading();
} else {
  removeLazyLoading();
}

function applyLazyLoading() {
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.setAttribute('loading', 'lazy');
  });
}

function removeLazyLoading() {
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.removeAttribute('loading');
  });
}

if (localStorage.getItem("aboutblankEnabled") === "true") {
  let iFramed
  try {
    iFramed = window !== top
  } catch (e) {
    iFramed = true
  }
  if (!iFramed) {
    const popup = open("about:blank", "_blank")
    const document = popup.document
    const body = document.body
    const bodystyle = body.style
    const iframe = document.createElement('iframe')
    const iframestyle = iframe.style
    iframe.src = location.href
    iframestyle.top = iframestyle.bottom = iframestyle.left = iframestyle.right = 0
    iframestyle.border = iframestyle.outline = 'none'
    iframestyle.width = iframestyle.height = '100%'
    bodystyle.margin = bodystyle.padding = '0'
    document.body.appendChild(iframe)
    location.replace('https://classroom.google.com/');
  }
}

function startTrackingTime() {
  var startTime = new Date().getTime();
  localStorage.setItem("startTime", startTime.toString());
}

function stopTrackingTime() {
  var startTime = localStorage.getItem("startTime");
  if (startTime) {
    var endTime = new Date().getTime();
    var totalTime = Math.floor((endTime - parseInt(startTime)) / 1000);
    localStorage.setItem("totalTime", totalTime.toString());
    var xpPerMinute = 20;
    var totalXP = Math.floor(totalTime / 60) * xpPerMinute;
    var currentXP = parseInt(localStorage.getItem("userXP")) || 0;
    localStorage.setItem("userXP", (currentXP + totalXP).toString());
    localStorage.removeItem("startTime");
  }
}

function handleKeyPress(event) {
  const selectedUrl = localStorage.getItem('selectedUrl');
  const defaultUrl = 'https://www.instructure.com/canvas?domain=canvas';
  const customKey = localStorage.getItem('selectedKey');

  if (event.code === 'Backquote' && customKey) {
    window.location.href = selectedUrl || defaultUrl;
  } else if (event.key === customKey) {
    window.location.href = selectedUrl || defaultUrl;
  }
}

document.addEventListener('keydown', handleKeyPress);


if (!localStorage.getItem('firstVisitDate')) {
  const currentDate = new Date();
  localStorage.setItem('firstVisitDate', currentDate.toISOString());
} else {
  const firstVisitDate = new Date(localStorage.getItem('firstVisitDate'));
}

if (localStorage.getItem('pageVisits')) {
  const pageVisits = parseInt(localStorage.getItem('pageVisits'), 10) + 1;
  localStorage.setItem('pageVisits', pageVisits.toString());
} else {
  localStorage.setItem('pageVisits', '1');
}