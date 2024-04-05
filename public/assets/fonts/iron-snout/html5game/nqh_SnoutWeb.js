
function game_resize() {
	gmCallback.game_callback("resize");
}

function game_fullscreen() {
	var elem = document.body; // Make the body go full screen.
	requestFullScreen(elem);
}

function web_audio_resume() {
	if (g_WebAudioContext != undefined) {
		g_WebAudioContext.resume();
	}
}

function requestFullScreen(element) {
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}