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
  title: "Platformer.io",
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


function resetTab() {
  document.title = settingsDefaultTab.title;
  document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  document.getElementById("title").value = "";
  document.getElementById("icon").value = "";
  localStorage.setItem("tab", JSON.stringify({}));
}

document.addEventListener('DOMContentLoaded', function () {
  const urlButtons = document.querySelectorAll('.url-button');
  const customUrlInput = document.getElementById('customUrlInput');
  /*const setCustomUrlButton = document.getElementById('setCustomUrlButton');*/
  const recordKeyButton = document.getElementById('recordKeyButton');
  const selectedKeyDisplay = document.getElementById('selectedKey');
  const selectedKey = localStorage.getItem('selectedKey');
  /*const selectedUrlButton = document.querySelector(`[data-url="${localStorage.getItem('selectedUrl')}"]`);*/

  if (selectedKey) {
    selectedKeyDisplay.innerHTML = `<kbd>${selectedKey}</kbd>`;
  }


  
  /*if (selectedUrlButton) {
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
  */

  setCustomUrlButton.addEventListener('click', function () {
    const customUrl = customUrlInput.value;
    localStorage.setItem('selectedUrl', customUrl);
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


