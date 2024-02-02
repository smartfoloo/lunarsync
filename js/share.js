function getCurrentURL() {
  return window.location.href;
}

function copyToClipboard(text) {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

document.getElementById('urlInput').value = getCurrentURL();

document.getElementById('copyButton').addEventListener('click', function () {
  const url = getCurrentURL();
  copyToClipboard(url);
  document.getElementById('urlInput').value = 'Link Copied!';
  setTimeout(function () {
    document.getElementById('urlInput').value = getCurrentURL();
  }, 2000);
});
