function cmAPI_start()
{
	window.cmgGameEvent('start');

	// if(window.self != window.top)
	// {
	// 	// iframed
	// 	if(parent.cmgGameEvent)
	// 	{
	// 		parent.cmgGameEvent('start');
	// 	}
    // } else
	// {
	// 	if(window.cmgGameEvent)
	// 	{
	// 		window.cmgGameEvent('start');
	// 	}
    // }
}

function cmAPI_startLevel(level)
{
	window.cmgGameEvent('start', String(level));

// 	if(window.self != window.top)
// 	{
// 		// iframed
// 		if(parent.cmgGameEvent)
// 		{
// 			parent.cmgGameEvent('start', String(level));
// 		}
//     } else
// 	{
// 		if(window.cmgGameEvent)
// 		{
// 			window.cmgGameEvent('start', String(level));
// 		}
//     }
// }
}

function cmAPI_replayLevel(level)
{
	window.cmgGameEvent('replay', String(level));

	// if(window.self != window.top)
	// {
	// 	// iframed
	// 	if(parent.cmgGameEvent)
	// 	{
	// 		parent.cmgGameEvent('replay', String(level));
	// 	}
    // } else
	// {
	// 	if(window.cmgGameEvent)
	// 	{
	// 		window.cmgGameEvent('replay', String(level));
	// 	}
    // }
}
