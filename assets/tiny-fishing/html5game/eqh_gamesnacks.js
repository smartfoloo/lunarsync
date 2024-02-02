
function js_GS_sendScore(score)
{

	GAMESNACKS.sendScore(score);
	console.log("GAMESNACKS : score sent " + score.toString());

}

function js_GS_gameOver()
{

	GAMESNACKS.gameOver();
	console.log("GAMESNACKS : game over");

}

var audioEnabled = false;
function js_GS_isAudioEnabled()
{

	//return GAMESNACKS.isAudioEnabled();
	return audioEnabled;

}

function js_GS_switchAudio()
{

	audioEnabled != audioEnabled;

}