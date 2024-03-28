function displayUserXP() {
  var currentXP = parseInt(localStorage.getItem("userXP")) || 0;
  var xpPerLevel = 200;
  var currentLevel = Math.floor(currentXP / xpPerLevel) + 1;
  var currentXPInLevel = currentXP % xpPerLevel;

  document.getElementById("user-Level").textContent = "Level " + currentLevel;
  document.getElementById("user-Xp").textContent = currentXPInLevel + "/200 XP";
}

displayUserXP();

const editableHeading = document.getElementById('editableHeading');
const editInput = document.getElementById('editInput');
const saveButton = document.getElementById('saveButton');

const savedUsername = localStorage.getItem('username');
if (savedUsername) {
  editableHeading.textContent = savedUsername;
}

document.getElementById("editIcon").addEventListener("click", function () {
  var newUsername = prompt('Enter your new username')
  editableHeading.textContent = newUsername;
  localStorage.setItem('username', newUsername);
  location.reload();
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

const pfpInput = document.getElementById('pfpUpload');
const pfpImg = document.getElementById('pfpImg');

function handlepfpUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const base64Data = event.target.result;
      localStorage.setItem('pfp', base64Data);
      pfpImg.src = base64Data;
    };
    reader.readAsDataURL(file);
  }
}

function loadpfp() {
  const pfpData = localStorage.getItem('pfp');
  if (pfpData) {
    pfpImg.src = pfpData;
  } else {
    pfpImg.src = "./assets/images/default-pfp.jpeg";
  }
}

pfpImg.addEventListener('click', function () {
  pfpInput.click();
});

pfpInput.addEventListener('change', handlepfpUpload);
loadpfp();

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