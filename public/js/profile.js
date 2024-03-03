function displayUserXP() {
  var currentXP = parseInt(localStorage.getItem("userXP")) || 0;
  var xpPerLevel = 200;

  var currentLevel = Math.floor(currentXP / xpPerLevel) + 1;
  var xpForNextLevel = xpPerLevel * (currentLevel);
  var xpProgress = ((currentXP % xpPerLevel) / xpPerLevel) * 100;

  document.getElementById("user-Level").textContent = "Level " + currentLevel;
  document.getElementById("xp-progress").style.width = xpProgress + "%";
}


window.onload = function () {
  displayUserXP();
  checkLevelUp();
};

const editableHeading = document.getElementById('editableHeading');
const editInput = document.getElementById('editInput');
const saveButton = document.getElementById('saveButton');

const savedUsername = localStorage.getItem('username');
if (savedUsername) {
  editableHeading.textContent = savedUsername;
  editInput.value = savedUsername;
}

saveButton.addEventListener('click', () => {
  const newUsername = editInput.value;
  editableHeading.textContent = newUsername;
  editInput.style.display = 'none';
  saveButton.style.display = 'none';
  editableHeading.style.display = 'block';

  localStorage.setItem('username', newUsername);
  location.reload();
});

document.getElementById("editIcon").addEventListener("click", function () {
  var inputDiv = document.querySelector(".input-div");
  if (inputDiv.style.display === "none" || inputDiv.style.display === "") {
    inputDiv.style.display = "block";
    document.getElementById("saveButton").style.display = "block";
  } else {
    inputDiv.style.display = "none";
    document.getElementById("saveButton").style.display = "none";
  }
});

const firstVisitDate = localStorage.getItem('firstVisitDate');
const dateElement = document.getElementById('firstVisitDate');

if (firstVisitDate) {
  const formattedDate = new Date(firstVisitDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDateString = formattedDate.toLocaleDateString(undefined, options);
  dateElement.textContent = formattedDateString;
} else {
  dateElement.textContent = 'No visit date found.';
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem('pageVisits')) {
    const pageVisitsCount = parseInt(localStorage.getItem('pageVisits'), 10);
    const displayElement = document.getElementById('pageVisitsCount');
    if (displayElement) {
      displayElement.textContent = `${pageVisitsCount}`;
    }
  } else {
    const displayElement = document.getElementById('pageVisitsCount');
    if (displayElement) {
      displayElement.textContent = 'No page visits recorded yet.';
    }
  }
});

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

window.onload = function () {
  startTrackingTime();
};

window.onunload = function () {
  stopTrackingTime();
};

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

function showTime() {
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;

  var time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("clock").innerText = time;
  document.getElementById("clock").textContent = time;

  setTimeout(showTime, 1000);

}
showTime();







