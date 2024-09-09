


class WinterpixelAds { 
	constructor() {
		this.registered_events = {};
		this.adBreak = null;
		this.adConfig = null;
		this.adConfigReady = false;
		this.driver = "winterpixel";

	}

	init(adBreak, adConfig, driver) {
		console.log("WinterpixelAds init");
		this.adBreak = adBreak;
		this.adConfig = adConfig;
		this.driver = driver; 
		console.log("WinterpixelAds driver: " + driver);


		if(this.driver == "winterpixel") {
			this.adConfig({
				sound: "on",
				preloadAdBreaks: "on",
				onReady: () => { 
					console.log("WinterpixelAds init adConfig onReady"); 
					this.adConfigReady = true;
				}
			});
		}
		else if(this.driver == "adinplay") {
			// do nothing
		}
		else if(this.driver == "crazygames") {
			// Nothing required for crazy v2 sdk
		}
		else if(this.driver == "poki") {
			PokiSDK.init().then(() => {
				console.log("Poki SDK successfully initialized");
				// fire your function to continue to game
				PokiSDK.gameLoadingStart();
			}).catch(() => {
				console.log("Initialized, but the user likely has adblock");
				// fire your function to continue to game
			});
		}
	};

	addEventListener(key, func) { 
		console.log("WinterpixelAds addEventListener");
		this.registered_events[key] = func;
	};

	gameplayStart() {
		console.log("WinterpixelAds gameplayStart");
		
		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "crazygames") {
			window.CrazyGames.SDK.game.gameplayStart();
		}
		if(this.driver == "poki") {
			PokiSDK.gameplayStart();
		}
	}

	gameplayStop() {
		console.log("WinterpixelAds gameplayStop");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "crazygames") {
			window.CrazyGames.SDK.game.gameplayStop();
		}
		if(this.driver == "poki") {
			PokiSDK.gameplayStop();
		}
	}

	gameLoadingStart() {
		if(this.driver == "poki") {
			PokiSDK.gameLoadingStart();
		}
	}

	gameLoadingFinished() {
		if(this.driver == "poki") {
			PokiSDK.gameLoadingFinished();
		}
	}

	happytime() {
		console.log("WinterpixelAds happytime");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "crazygames") {
			window.CrazyGames.SDK.game.happytime();
		}
	}

	requestAd(adNameString) {
		console.log("WinterpixelAds requestAd");

		if(this.driver == "winterpixel") {
			if(this.adConfigReady) {
				this.adBreak({
					type: 'next',  // ad shows at start of next level
					name: 'next',
					beforeAd: () => { 
						console.log("adBreak beforeAd"); 
					},  // You may also want to mute the game's sound.
					afterAd: () => { 
						console.log("adBreak afterAd"); 
					},
					adBreakDone: (o) => { 
						console.log("preroll done"); 
						if(this.registered_events["adFinished"]) {
							this.registered_events["adFinished"]();
						}
					}
				});
			}
			else{
				console.log("WinterpixelAds requestAd, adConfig not ready");
				if(this.registered_events["adError"]) {
					this.registered_events["adError"]();
				}
			}
		}
		else if(this.driver == "adinplay") {
			if(this.registered_events["adStarted"]) {
				this.registered_events["adStarted"]();
			}

			if(adNameString == "rewarded") {
				show_rewarded(); // TODO rework
			}
			else {
				show_preroll(); // TODO rework
			}
		}
		else if(this.driver == "crazygames") {
			const callbacks = {
				adFinished: () => {
					console.log("End ad (callback)")
					if(this.registered_events["adFinished"]) {
						this.registered_events["adFinished"]();
					}
				},
				adError: (error) => {
					console.log("Error ad (callback)", error)
					if(this.registered_events["adError"]) {
						this.registered_events["adError"]();
					}
				},
				adStarted: () => {
					console.log("Start ad (callback)")
					if(this.registered_events["adStarted"]) {
						this.registered_events["adStarted"]();
					}
				},
			};
			window.CrazyGames.SDK.ad.requestAd(adNameString, callbacks);
		}
		else if(this.driver == "poki") {
			if(adNameString == "rewarded") {
				// pause your game here if it isn't already
				PokiSDK.rewardedBreak(() => {
					if(this.registered_events["adStarted"]) {
						this.registered_events["adStarted"]();
					}
				}).then((withReward) => {
					console.log("Rewarded break finished, proceeding to game");
					if (withReward) {
						if(this.registered_events["adFinished"]) {
							this.registered_events["adFinished"]();
						}
					} else {
						if(this.registered_events["adError"]) {
							this.registered_events["adError"]();
						}
					}
				});
			} else {
				// pause your game here if it isn't already
				PokiSDK.commercialBreak(() => {
					if(this.registered_events["adStarted"]) {
						this.registered_events["adStarted"]();
					}
				}).then(() => {
					console.log("Commercial break finished, proceeding to game");
					if(this.registered_events["adFinished"]) {
						this.registered_events["adFinished"]();
					}
				});
			}
		}
	}

	requestBanner(bannerDict) {
		console.log("WinterpixelAds requestBanner");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "adinplay") {
			request_banner();
		}
		else if(this.driver == "crazygames") {
			window.CrazyGames.SDK.banner.requestBanner(bannerDict);
		}
	}

	requestResponsiveBanner(bannerIdArray) {
		console.log("WinterpixelAds requestResponsiveBanner");

		if(this.driver == "winterpixel") {
			// todo
		}
		else if(this.driver == "adinplay") {
			request_banner();
		}
		else if(this.driver == "crazygames") {
			window.CrazyGames.SDK.banner.requestResponsiveBanner(bannerIdArray);
		}
	}
};

if (typeof window !== 'undefined') {
	window['WinterpixelAds'] = new WinterpixelAds();
}

