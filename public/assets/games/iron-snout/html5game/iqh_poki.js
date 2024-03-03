function poki_init(debugMode) {
	console.log("poki_init()");
	
	POKI_ADS.init({
		debug: (debugMode == 1),
		wrapper: document.getElementById("gm4html5_div_id")
	});

    poki_listen(poki.ready);
    poki_listen(poki.ads.completed);
    poki_listen(poki.ads.started);
	poki_listen(poki.ads.limit);	
	poki_listen(poki.ads.error);
}

function poki_listen(event) {
    POKI_DISPATCHER.addEventListener(event, function() {
        console.log(event);
        gmCallback.game_callback(event);
    });
}

function poki_track(event) {
	console.log("poki_track()");
	POKI_TRACKER.track(event);
}

function poki_show_preroll() {
    console.log("poki_show_preroll()");
    POKI_ADS.requestAd({
        position: poki.ads.position.preroll
    });
}

function poki_show_midroll() {
    console.log("poki_show_midroll()");
    POKI_ADS.requestAd({
        position: poki.ads.position.midroll
    });
}
