function startTime() {
  var today = new Date();
  var hours = today.getHours();
  hours = hours % 12 || 12;
  var minutes = today.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var time = hours + ":" + minutes;
  document.getElementById("time-text").innerHTML = time;
  setTimeout(startTime, 1000);
}
startTime();

const savedSearchEngine = localStorage.getItem("searchEngine");

const searchEngineUrls = {
  google: "https://www.google.com/search?q=%s",
  bing: "https://www.bing.com/search?q=%s",
  duckduckgo: "https://duckduckgo.com/?q=%s",
  yahoo: "https://search.yahoo.com/search?p=%s"
};

const searchEngineInput = document.getElementById("uv-search-engine");
const addressInput = document.getElementById("uv-address");

if (searchEngineUrls[savedSearchEngine]) {
  searchEngineInput.value = searchEngineUrls[savedSearchEngine];
  addressInput.placeholder = `Search ${savedSearchEngine.charAt(0).toUpperCase() + savedSearchEngine.slice(1)} or type a URL`;
} else {
  searchEngineInput.value = searchEngineUrls.google;
  addressInput.placeholder = "Search Google or type a URL";
}


function handleAddShortcut() {
  const shortcutName = prompt('Enter the name of the shortcut:');
  if (!shortcutName) return;

  const shortcutUrl = prompt('Enter the URL of the shortcut:');
  if (!shortcutUrl) return;

  const shortcutImageUrl = prompt('Enter the image URL for the shortcut (optional):');

  const shortcutButton = document.createElement('button');
  shortcutButton.classList.add('shortcut');
  shortcutButton.title = 'shortcut';
  shortcutButton.onclick = () => loadPage(shortcutUrl);

  if (shortcutImageUrl) {
    const shortcutImage = document.createElement('img');
    shortcutImage.classList.add('shortcut-image');
    shortcutImage.src = shortcutImageUrl;
    shortcutImage.alt = '';
    shortcutButton.appendChild(shortcutImage);
  }

  const shortcutText = document.createElement('p');
  shortcutText.textContent = shortcutName;
  shortcutButton.appendChild(shortcutText);

  document.querySelector('.shortcuts').appendChild(shortcutButton);

  const shortcuts = localStorage.getItem('shortcuts') || '[]';
  const parsedShortcuts = JSON.parse(shortcuts);
  parsedShortcuts.push({ name: shortcutName, url: shortcutUrl, imageUrl: shortcutImageUrl });
  localStorage.setItem('shortcuts', JSON.stringify(parsedShortcuts));
}

function updateSavedShortcuts(shortcut) {

  const shortcutButton = document.createElement('button');
  shortcutButton.classList.add('shortcut');
  shortcutButton.title = 'shortcut'; 

  shortcutButton.onclick = () => loadPage(shortcut.url);

  if (shortcut.imageUrl) {
    const shortcutImage = document.createElement('img');
    shortcutImage.classList.add('shortcut-image');
    shortcutImage.src = shortcut.imageUrl;
    shortcutImage.alt = '';

    shortcutButton.appendChild(shortcutImage);
  } else {

  }

  const shortcutText = document.createElement('p');
  shortcutText.textContent = shortcut.name;
  shortcutButton.appendChild(shortcutText);

  document.querySelector('.shortcuts').appendChild(shortcutButton);
}

const storedShortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
storedShortcuts.forEach(shortcut => {
  updateSavedShortcuts(shortcut);
});
