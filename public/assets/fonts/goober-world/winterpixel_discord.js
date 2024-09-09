var discordSdk, discordEvents, discordPriceUtils;
var discordCallbacks = {
	registerCallback: function(key, obj) {
		console.log("[DiscordHTML] registerCallback: " + key);
		this[key] = obj;
	}
};
window["discordCallbacks"] = discordCallbacks;
async function initializeDiscord(oauth_client_id) {
	console.log("[DiscordHTML] initializeDiscord() " + oauth_client_id);
	try {
		console.log("[DiscordHTML] initializeDiscord()");
		const { DiscordSDK, Events, PriceUtils } = await import('./extras/activity-iframe-sdk/output/index.mjs');
		// console.log(DiscordSDK);
		discordSdk = new DiscordSDK(oauth_client_id);
		discordEvents = Events;
		discordPriceUtils = PriceUtils;
		console.log("[DiscordHTML] initializeDiscord() awaiting ready()");
		// Wait for READY payload from the discord client
		await discordSdk.ready();
		
		console.log("[DiscordHTML] initializeDiscord() ready()");
		console.log (JSON.stringify(discordCallbacks));
		console.log(discordCallbacks);
		console.log(discordCallbacks.on_discordReady);
		discordCallbacks.on_discordReady(true);
	} catch(error) {
		console.error('[DiscordHTMl] initializeDiscord() error: ' + error);
		discordCallbacks.on_discordReady(); // empty is error
	}
}

async function authorizeDiscord(oauth_client_id) {
	console.log("[DiscordHTML] authorizeDiscord() " + oauth_client_id);
	try {
		// Pop open the OAuth permission modal and request for access to scopes listed in scope array below
		console.log("[DiscordHTML] authorizeDiscord() authorizing.");
		const {code} = await discordSdk.commands.authorize({
			client_id: oauth_client_id,
			response_type: 'code',
			state: '',
			prompt: 'none',
			scope: ['identify', 'guilds.members.read'],
		});
		console.log("[DiscordHTML] authorized. code " + code);
		discordCallbacks.on_discordAuthorized(code);
	} catch(error) {
		console.error('[DiscordHTMl] authorizeDiscord() error: ' + error + ' stringified error: ' + JSON.stringify(error));
		discordCallbacks.on_discordAuthorized(); // empty is error
		discordSdk.close(1000, "Unauthorized")
	}
};

async function authenticateDiscord(access_token) {
	console.log("[DiscordHTML] authenticateDiscord()");
	// Authenticate with Discord client (using the access_token)
	try {
		var user = await discordSdk.commands.authenticate({access_token});
		var userJson = JSON.stringify(user);
		console.log("[DiscordHTML] authenticated. user: " + userJson);
		discordCallbacks.on_discordAuthenticated(userJson);
		discordConnectParticipantsChanged();
		discordConnectPurchaseCallback();
		//discordLoadSkus();
	} catch (error) {
		console.error("[DiscordHTML] authenticateDiscord() error: " + error);
		discordCallbacks.on_discordAuthenticated(); // empty is error
	}
};

function discordOpenURL(url) {
	console.log("[DiscordHTML] discordOpenURL " + url);
	discordSdk.commands.openExternalLink({url:url})
};

function discordUpdateParticipants(participants) {
	console.log("[Discord] discordUpdateParticipants");
	var participantsJsonString = JSON.stringify(participants);
	console.log("[Discord] participants: " + participantsJsonString);
	discordCallbacks.on_discordParticipantsChanged(participantsJsonString);
}

async function discordGetParticipants() {
	console.log("[DiscordHTML] discordGetInstanceConnectedParticipants()");
	try {
		var participantData = await discordSdk.commands.getInstanceConnectedParticipants();
		discordUpdateParticipants(participantData);
	} catch (error) {
		console.log("[DiscordHTML] discordGetInstanceConnectedParticipants() error " + error);
	}
	return []
};

function discordConnectParticipantsChanged() {
	try {
		console.log("[DiscordHTML] discordConnectParticipantsChanged() subscribing to participants update");
		discordSdk.subscribe(discordEvents.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, discordUpdateParticipants);
		console.log("[DiscordHTML] discordConnectParticipantsChanged() subscribed to participants update");
	} catch (error) {
		console.log("[DiscordHTML] discordConnectParticipantsChanged() error processing participants: " + JSON.stringify(error));
	}
}

function discordQueryPurchases() {
	try {

	} catch (error) {
		console.log("[DiscordHTML] discordQueryPurchases() error " + error);
	}
}

function discordConnectPurchaseCallback() {
	try {
		console.log("[DiscordHTML] discordConnectPurchaseCallback()");
		discordSdk.subscribe('ENTITLEMENT_CREATE', () =>{
			console.log("[DiscordHTML] discord purchaseCallback()");
			discordCallbacks.on_purchaseCallback();
		});
	} catch (error) {
		console.log("[DiscordHTML] discordConnectPurchaseCallback() error: " + error);
	}
}

async function discordLoadSkus() {
	try {
		console.log("[DiscordHTML] discordLoadSkus()");
		const skus = await discordSdk.commands.getSkus();
		// console.log("[DiscordHTML] skus: " + skus);
		skus.skus.forEach(skuInfo => {
			// console.log("[DiscordHTML] formatting price: " + skuInfo.price);
			var formattedPrice = discordPriceUtils.formatPrice(skuInfo.price);
			// console.log("[DiscordHTML] formated to: " + formattedPrice);
			skuInfo.formatted_price = formattedPrice;
		})
		const skusJson = JSON.stringify(skus);
		// console.log("[DiscordHTML] skus jsonified: " + JSON.stringify(skus));
		discordCallbacks.on_skusLoaded(skusJson);
	} catch (error) {
		console.log("[DiscordHTML] discordLoadSkus() error: " + error);
	}
}

async function discordPurchaseSku(sku) {
	try {
		console.log("[DiscordHTML] discordPurchaseSku(" + sku + ")");
		await discordSdk.commands.startPurchase({sku_id: sku});
		console.log("[DiscordHTML] discordPurchaseSku(" + sku + ") finished");
	} catch (error) {
		console.log("[DiscordHTML] discordPurchaseSku(" + sku + ") error: " + error + " error json: " + JSON.stringify(error));
	}
}
