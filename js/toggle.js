document.addEventListener('DOMContentLoaded', function () {
    const musicLink = document.getElementById('musicLink');

    if (musicLink) {
        const storageKey = 'toggleState';
        const storedState = localStorage.getItem(storageKey);

        const toggleState = storedState === 'true';

        musicLink.style.display = toggleState ? 'inline' : 'none';
    }
});