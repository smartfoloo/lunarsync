const tabContainer = document.getElementById("tab-container");
const urlBar = document.getElementById("url-bar");
const addTabButton = document.getElementById("add-tab-button");

let currentTab = 0;
let tabs = [
  {
    iframe: document.getElementById("tab-iframe"),
    url: "",
  },
];

function loadPage(url) {
  registerSW()
    .then(() => {
      const iframe = document.getElementById('uv-iframe');
      tabs[currentTab].url = url;
      tabs[currentTab].iframe.src = "/uv/service/" + __uv$config.encodeUrl(url);
    });
}


function createTab() {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.onclick = loadTabUrl('https://google.com/');
  const tabName = document.createElement('h4');
  tabName.id = 'tabName';
  tabName.textContent = 'tab';

  const iframe = document.getElementById('iframe');
  iframe.src = "/uv/service/" + __uv$config.encodeUrl('https://google.com/');

  fetch('https://google.com/', { mode: 'no-cors' })
    .then(response => response.text())
    .then(data => {
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(data, 'text/html');
      var title = htmlDoc.title;
      const tabName = document.getElementById('tabName');
      tabName.textContent = title;
    });

  const closeButton = document.createElement("button");
  closeButton.className = "tab-close-button";
  closeButton.textContent = "x";
  closeButton.addEventListener("click", () => {
    removeTab(tab);
  });

  tab.appendChild(tabName);
  tab.appendChild(closeButton);

  tabContainer.append(tab, tabContainer.firstChild);

  currentTab = 0;
  currentTab.className = 'current-tab';
  loadPage('https://google.com/');
}

function removeTab(tab) {
  const index = Array.from(tabContainer.children).indexOf(tab);
  if (index > -1) {
    tabContainer.removeChild(tab);
    tabs.splice(index, 1);
  }

  if (currentTab >= tabs.length) {
    currentTab = tabs.length - 1;
  }

  loadPage(tabs[currentTab].url);
}

addTabButton.addEventListener("click", () => {
  createTab();
});

urlBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadPage(urlBar.value);
  }
});