


const scriptsInEvents = {

	async Intro_Event1_Act1(runtime, localVars)
	{
		runtime.globalVars.access_token = getWebsite_URL();
	},

	async Yandex_Event1_Act1(runtime, localVars)
	{
		window.ysdk.adv.showFullscreenAdv({
				callbaks:{
					onOpen: () => {
						console.log("Ad Started!");
						runtime.callFunction("adStarted");
					},
						onClose: function(wasShown){
						runtime.callFunction("onClose");
					},
						onError: function(error){
						runtime.callFunction("onError");
					}
			  }
		})
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

