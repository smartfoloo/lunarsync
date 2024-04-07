var tab = localStorage.getItem("tab");

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
  document.getElementById("title").value = tabData.title;
}
if (tabData.icon) {
  document.getElementById("icon").value = tabData.icon;
}

var settingsDefaultTab = {
  title: "Lunarsync",
  icon: "/favicon.png",
};

function setTitle(title = "") {
  if (title) {
    document.title = title;
  } else {
    document.title = settingsDefaultTab.title;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (title) {
    tabData.title = title;
  } else {
    delete tabData.title;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setFavicon(icon) {
  if (icon) {
    document.querySelector("link[rel='icon']").href = icon;
  } else {
    document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (icon) {
    tabData.icon = icon;
  } else {
    delete tabData.icon;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setCloak(cloak) {
  switch (cloak) {
    case "canvas":
      setTitle("Dashboard");
      setFavicon("./assets/images/canvas.png");
      location.reload();
      break;
    case "google-classroom":
      setTitle("Classes");
      setFavicon("./assets/images/classroom.png");
      location.reload();
      break;
    case "google":
      setTitle("Google");
      setFavicon("./assets/images/google.ico");
      location.reload();
      break;
    case "google-drive":
      setTitle("Google Drive");
      setFavicon("./assets/images/googledrive.png");
      location.reload();
      break;
    case "khan-academy":
      setTitle("Khan Academy");
      setFavicon("./assets/images/khanacademy.png");
      location.reload();
      break;
  }
}

function resetTab() {
  document.title = settingsDefaultTab.title;
  document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
}

if (localStorage.getItem("theme")) {
  document.getElementById("themes").value = localStorage.getItem("theme");
} else {
  document.getElementById("themes").value = "default";
}

if (localStorage.getItem("searchEngine")) {
  document.getElementById("searchEngine").value = localStorage.getItem("searchEngine");
} else {
  document.getElementById("searchEngine").value = "google";
}

document.addEventListener('DOMContentLoaded', function () {
  const urlButtons = document.querySelectorAll('.url-button');
  const recordKeyButton = document.getElementById('recordKeyButton');
  const selectedKeyDisplay = document.getElementById('selectedKey');
  const selectedKey = localStorage.getItem('selectedKey');
  const selectedUrlButton = document.querySelector(`[data-url="${localStorage.getItem('selectedUrl')}"]`);

  if (selectedKey) {
    selectedKeyDisplay.innerHTML = `<kbd>${selectedKey}</kbd>`;
  }
  
  if (selectedUrlButton) {
    selectedUrlButton.classList.add('selected-url');
  }

  urlButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      urlButtons.forEach(function (btn) {
        btn.classList.remove('selected-url');
      });

      this.classList.add('selected-url');

      const selectedUrl = this.getAttribute('data-url');
      localStorage.setItem('selectedUrl', selectedUrl);
    });
  });

  recordKeyButton.addEventListener('click', function () {
    selectedKeyDisplay.innerHTML = '<kbd>Press a key</kbd>';
    document.addEventListener('keydown', function recordKey(event) {
      const selectedKey = event.key;
      selectedKeyDisplay.innerHTML = `<kbd>${selectedKey}</kbd>`;
      localStorage.setItem('selectedKey', selectedKey);
      document.removeEventListener('keydown', recordKey);
    });
  });
});

function saveSearchEngine(selectedEngine) {
  localStorage.setItem('searchEngine', selectedEngine);
}

function setTheme(theme) {
  document.body.setAttribute('theme', theme);
  localStorage.setItem('theme', theme);
}

if (localStorage.getItem('aboutblankEnabled') === null) {
  localStorage.setItem('aboutblankEnabled', 'false');
}

function enableAboutBlank() {
  localStorage.setItem('aboutblankEnabled', 'true');
  location.reload();
}

function disableAboutBlank() {
  localStorage.setItem('aboutblankEnabled', 'false');
  location.reload();
}

const aboutblankEnabled = localStorage.getItem('aboutblankEnabled');

if (aboutblankEnabled === 'true' || aboutblankEnabled === '' || aboutblankEnabled === null) {
  document.getElementById('enableAboutBlank').disabled = true;
  document.getElementById('disableAboutBlank').disabled = false;
} else {
  document.getElementById('enableAboutBlank').disabled = false;
  document.getElementById('disableAboutBlank').disabled = true;
}