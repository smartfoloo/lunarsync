
window.idAsyncInit = function() {
    // use an id.net event to wait until after init
    ID.Event.subscribe('id.init', function(){
        // use jquery to call methods on click
         ID.getLoginStatus(idCallback)
         ID.Protection.isBlacklisted(function(blacklisted){
			if(blacklisted == true){isBlacklisted = 1;}else{isBlacklisted = 0;}
            console.log('[BLACKLIST] : ' + isBlacklisted);
        });
         ID.Protection.isSponsor(function(sponsor){
			isSponsor = sponsor;
			if(sponsor == true){isSponsor = 1;}else{isSponsor = 0;}
            console.log('[SPONSOR] : ' + isSponsor);
        });
        ID.ads.init(1)//change 1 to the correct item_id
    });
    // using an optional callback to capture data on the client
    var userName;
    var idCallback = function(response){
        if (response) {
            console.log(response);
            if(response.status === 'ok')
            {
               userName = response.authResponse.details.nickname;
			   sUserName = userName;
			   isLogin = 1;
            }
        }
    }
	ID.init({
		//Add your app Id here
        appId : "5ea39283d559303d5320eef4"
    });
};

// load the idnet js interface
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src =  document.location.protocol == 'https:' ? "https://scdn.id.net/api/sdk.js" : "http://cdn.id.net/api/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'id-jssdk'));

function initY8(appId_)
{
	console.log("appId_ "+appId_)
	ID.init({
        appId : appId_
    });
}

//y8 variables
var isLogin = 0;
var sUserName = 'Guest';
var URLlocation;
var isBlacklisted = 0
var isSponsor = 0;
var onlineSavesData;
var isGamePaused = 0;


var imported = document.createElement('script');
var AdsenseId = "ca-pub-6129580795478709"
var ChannelId = "00000000"
var adFrequency = "180s";
var testAdsOn = false;

window.adsbygoogle = window.adsbygoogle || [];
var adBreak;
var adConfig;

function loadAdSetup()
{
	console.log("loadAdSetup");
	adBreak = function(o) {adsbygoogle.push(o);}
	adConfig = function(o) {adsbygoogle.push(o);}
	adConfig({
    preloadAdBreaks: 'on',
    sound: 'on', // This game has sound
    onReady: () => {
        console.log("ready");
    }, // Called when API has initialised and adBreak() is ready
});

}
function nextAds()
{
    console.log("showNextAd")
    adBreak({
        type: 'start', // ad shows at start of next level
        name: 'start-game',
        beforeAd: () => {            
            console.log("this")
			isGamePaused = 1;
        }, // You may also want to mute thegame's sound.
        afterAd: () => {
            console.log("that")
			isGamePaused = 0;
        }, // resume the game flow.
        adBreakDone: (placementInfo) => {
            console.log("adBreak complete ");
			isGamePaused = 0;
            console.log(placementInfo.breakType);
            console.log(placementInfo.breakName);
            console.log(placementInfo.breakFormat);
            console.log(placementInfo.breakStatus);
        },
    });
}

function showReward()
{
    console.log("showReward")
    adBreak({
        type: 'reward', // ad shows at start of next level
        name: 'rewarded Ad',
        beforeAd: () => {            
            console.log("this")
			isGamePaused = 1;
        }, // You may also want to mute thegame's sound.
        afterAd: () => {
            console.log("that")
			isGamePaused = 0;
        }, // resume the game flow.
        beforeReward: (showAdFn) => {console.log("beforeReward ")+showAdFn(0)},
        adDismissed: () => {console.log("adDismissed");},
        adViewed: () => {console.log("adViewed");},
        adBreakDone: (placementInfo) => {
            console.log("adBreak complete ");
			isGamePaused = 0;
            console.log(placementInfo.breakType);
            console.log(placementInfo.breakName);
            console.log(placementInfo.breakFormat);
            console.log(placementInfo.breakStatus);
            if(placementInfo.breakStatus == "frequencyCapped"){updateTextRewardPanel()};
        },
    });
}
function updateTextRewardPanel()
{
    console.log("updateTextRewardPanel")
}

function createAFGScript()
{
console.log("createAFGScript " + testAdsOn)
    imported.setAttribute('data-ad-client', AdsenseId);
    imported.setAttribute('data-ad-channel', ChannelId);
    imported.setAttribute('data-ad-frequency-hint', adFrequency);
    if(testAdsOn == true){imported.setAttribute('data-adbreak-test', "on");}
    imported.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    imported.setAttribute("type", "text/javascript");
    imported.async = true;
    document.head.appendChild(imported);
}

createAFGScript()
loadAdSetup()



const scriptsInEvents = {

	async Y8api_Event19_Act1(runtime, localVars)
	{
		ID.init({
		        appId : localVars.ID
		    });
	},

	async Loading_Event1_Act1(runtime, localVars)
	{
		console.log("Version Y8 01");
	},

	async Loading_Event4_Act1(runtime, localVars)
	{
		
		var gameName = 'head_soccer_2023';
		var domainName = document.referrer;
		if (domainName == "")
		{
		domainName = window.location.href;
		}
		var domain_parts = domainName.split("://");
		var domain_subparts = domain_parts[1].split("/");
		var hostNames = domain_subparts[0];
		window.open("https://bestgamespot.com?utm_campaign=" + gameName + "&utm_source=" + hostNames + "&utm_medium=game_referral&utm_content=Loader", "_blank");
		
	},

	async GlobalVariables_Event2_Act11(runtime, localVars)
	{
		console.log("Adv is Active");
	},

	async GlobalVariables_Event3_Act10(runtime, localVars)
	{
		console.log("Adv Not Active");
	},

	async Y8api_Event1_Act1(runtime, localVars)
	{
		ID.login(function(response){
			console.log("response "+response)
				if(response.status === 'ok')
				{
					sUserName = response.authResponse.details.nickname;
					isLogin = 1;			
				}
			});
	},

	async Y8api_Event2_Act1(runtime, localVars)
	{
		ID.GameAPI.Leaderboards.list({table:'Leaderboard'})
	},

	async Y8api_Event3_Act1(runtime, localVars)
	{
		ID.GameAPI.Leaderboards.save({'table':'Leaderboard','points':localVars.score_}, function(data){
		                console.log(data);
		             });
	},

	async Y8api_Event4_Act1(runtime, localVars)
	{
		ID.GameAPI.Achievements.list();
	},

	async Y8api_Event5_Act1(runtime, localVars)
	{
		var achievementData = {
		        achievement: localVars.name_,
		        achievementkey: localVars.key_
		      };
		ID.GameAPI.Achievements.save(achievementData, function(response) {
		        console.log("achievement saved", response);
		      });
	},

	async Y8api_Event6_Act1(runtime, localVars)
	{
		ID.api('user_data/submit', 'POST', {key:  localVars.saveKey_, value: localVars.saveItem_}, function(response){
		                console.log(response);
		        });
	},

	async Y8api_Event7_Act1(runtime, localVars)
	{
		ID.api('user_data/retrieve', 'POST', {key: localVars.loadkey_}, function(response){
		try 
		{
			if(response)
			{
				onlineSavesData = response.jsondata;
				runtime.globalVars["isDataLoaded"] = 1;
				console.log(response);
			}
		}catch(e) {
		console.log('error loading');
		runtime.globalVars["isDataLoaded"] = -1;
		}
		});
	},

	async Y8api_Event8_Act1(runtime, localVars)
	{
		console.log("Get Online Save Data")
		runtime.setReturnValue(onlineSavesData);
	},

	async Y8api_Event9_Act1(runtime, localVars)
	{
		runtime.globalVars["SponsoredSite"] = isSponsor;
	},

	async Y8api_Event10_Act1(runtime, localVars)
	{
		runtime.globalVars["blacklistSite"] = isBlacklisted;
	},

	async Y8api_Event11_Act1(runtime, localVars)
	{
		runtime.globalVars["userNameY8"] = sUserName;
		runtime.globalVars["isLogin"] = isLogin;
	},

	async Y8api_Event12_Act1(runtime, localVars)
	{
		runtime.globalVars["isPausedGameY8"] = isGamePaused;
	},

	async Y8api_Event13_Act1(runtime, localVars)
	{
		/*try {
		runtime.globalVars["isPausedGameY8"] = 1
		ID.ads.display(function() {
		    console.log("resume Game")
		    runtime.globalVars["isPausedGameY8"] = 0
		})
		} catch (e) {
		    console.log(e + ' Error Showing Ads')
		    runtime.globalVars["isPausedGameY8"] = 0
		}*/
		console.log('%c Add called ', 'background: #000; color: #8888');
			
		nextAds()
		
	},

	async Y8api_Event14_Act1(runtime, localVars)
	{
		ID.openProfile();
	},

	async Y8api_Event15_Act1(runtime, localVars)
	{
		var blobUrl = localVars.image_;
		console.log("blobUrl "+ blobUrl);
		
		var xhr = new XMLHttpRequest;
		xhr.responseType = 'blob';
		xhr.onload = function() {
		   var recoveredBlob = xhr.response;
		   var reader = new FileReader;
		   reader.readAsDataURL(recoveredBlob);
		   reader.onloadend = function() {
		     var base64data = reader.result;                
		     console.log("base64data "+base64data);
			 sentImageToProfile(base64data)
		 }
		};
		
		xhr.open('GET', blobUrl);
		xhr.send();
		
		function sentImageToProfile(_image)
		{
			ID.submit_image(_image, function(response){
		        console.log("screenshot submitted", response);
		      });
		}
		
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

