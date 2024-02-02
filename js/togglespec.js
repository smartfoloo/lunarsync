document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('togglemusic');
    const musicLink = document.getElementById('musicLink');
    const storageKey = 'musicToggleState';

    toggleSwitch.checked = localStorage.getItem(storageKey) === 'true';
    updateLinkVisibility();


    toggleSwitch.addEventListener('change', function () {
        localStorage.setItem(storageKey, toggleSwitch.checked);
        updateLinkVisibility();
    });

    function updateLinkVisibility() {
        musicLink.style.display = toggleSwitch.checked ? 'inline' : 'none';
    }
});
