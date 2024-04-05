function addScript(src, id, onload) {
    if (document.getElementById(id)) return;
    let fjs = document.getElementsByTagName("script")[0];
    let js = document.createElement("script");
    js.id = id;
    fjs.parentNode.insertBefore(js, fjs);
    js.onload = onload;
    js.src = src;
}

addScript('poki-sdk.js', "poki-sdk", () => {
    PokiSDK.init().then(
        () => {
            console.log("Poki SDK successfully initialized");
            globalThis.PokiHasInitialised = true;

        }
    ).catch(
        () => {
            console.log("Initialized, but the user likely has adblock");
            globalThis.PokiHasInitialised = true;
        }
    );
    PokiSDK.setDebug(false);
})

window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
});
window.addEventListener('wheel', ev => ev.preventDefault(), {
    passive: false
});