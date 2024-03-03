// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

var adsManager;
var adsLoader;
var adDisplayContainer;
var intervalTimer;
var playButton;
var videoContent;

var w = 0;;
var h = 0;;
var adW = 0;
var adH = 0;
var wOffSet = 0;
var hOffSet = 0;
var timerVar = 8000;
var adCount = 1;

function init() {
    console.log('init')
  videoContent = document.getElementById('adv_contentElement');
  document.getElementById('adv_mainContainer').style.width = $(window).width()+'px';
  document.getElementById('adv_mainContainer').style.height = $(window).height()+'px';
  setUpIMA();
  
}

function setUpIMA() {
  // Create the ad display container.
  createAdDisplayContainer();
  // Create ads loader.
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  // Listen and respond to ads loaded and error events.
  adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      onAdsManagerLoaded,
      false);
  adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError,
      false);

  // An event listener to tell the SDK that our content video
  // is completed so the SDK can play any post-roll ads.
  var contentEndedListener = function() {adsLoader.contentComplete();};
  videoContent.onended = contentEndedListener;

  createNewAdRequest()
}

function createNewAdRequest()
{
    console.log('createNewAdRequest')
    // Request video ads.
  var adsRequest = new google.ima.AdsRequest();
  /*if(window.innerWidth < 640 || window.innerHeight < 360)
  {
      //adsRequest.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video&client=ca-games-pub-6129580795478709&description_url=http%3A%2F%2FY8.com&channel=5840949779&videoad_start_delay=30000&hl=en&max_ad_duration=60000';
      adsRequest.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image&client=ca-games-pub-6129580795478709&description_url=http%3A%2F%2FY8.com&channel=5840949779&videoad_start_delay=30000&hl=en&max_ad_duration=60000'
  }
  else
  {
      adsRequest.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image&client=ca-games-pub-6129580795478709&description_url=http%3A%2F%2FY8.com&channel=5840949779&videoad_start_delay=30000&hl=en&max_ad_duration=60000'
  }*/
  adsRequest.adTagUrl = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image&client=ca-games-pub-6129580795478709&description_url=http%3A%2F%2FY8.com&channel=5840949779&videoad_start_delay=30000&hl=en&max_ad_duration=60000'
  // Specify the linear and nonlinear slot sizes. This helps the SDK to
  // select the correct creative if multiple are returned.
  adsRequest.linearAdSlotWidth = 640;
  adsRequest.linearAdSlotHeight = 400;

  if(window.innerWidth < 640 || window.innerHeight < 360)
  {
      adsRequest.nonLinearAdSlotWidth = 336;
      adsRequest.nonLinearAdSlotHeight = 280;
  }
  else
  {
      adsRequest.nonLinearAdSlotWidth = 640;
      adsRequest.nonLinearAdSlotHeight = 400;
  }
  adsRequest.forceNonLinearFullSlot = true

  adsLoader.requestAds(adsRequest);
}


function createAdDisplayContainer() {
  // We assume the adContainer is the DOM id of the element that will house
  // the ads.
  adDisplayContainer = new google.ima.AdDisplayContainer(
  document.getElementById('adv_adContainer'), videoContent);
}

function playAds() {
  // Initialize the container. Must be done via a user action on mobile devices.
  videoContent.load();
  adDisplayContainer.initialize();
  try {
       console.log('Playads')
    // Initialize the ads manager. Ad rules playlist will start at this time.
    adW = 800;
    adH = 600;
    adsManager.init(adW, adH, google.ima.ViewMode.NORMAL);
    adsManager.start();
    if(jQuery.browser.mobile === true)
    {
        onWindowResize() 
    }
    else if(window.innerWidth <= adW || window.innerHeight <= adH)
    {
        onWindowResize()     
    }
    
    // Call play to start showing the ad. Single video and overlay ads will
    // start at this time; the call will be ignored for ad rules.
    
  } catch (adError) {
    // An error may be thrown if there was a problem with the VAST response.
    //videoContent.play();
    console.log('error Playads')
    createNewAdRequest()
    //showNextAd()
  }
}

function onWindowResize()
{
    console.log("onWindowResize")
    adsManager.resize(window.innerWidth,window.innerHeight,google.ima.ViewMode.NORMAL)
    adW = window.innerWidth;
    adH = window.innerHeight; 
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  // Get the ads manager.
  console.log('onAdsManagerLoaded')
  var adsRenderingSettings = new google.ima.AdsRenderingSettings();
  adsRenderingSettings.enablePreloading = true;
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  // videoContent should be set to the content video element.
  adsManager = adsManagerLoadedEvent.getAdsManager(
      videoContent, adsRenderingSettings);

  // Add listeners to the required events.
  
  adsManager.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      onContentPauseRequested);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      onContentResumeRequested);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      onAdEvent);

  // Listen to any additional events, if necessary.
  adsManager.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      onAdEvent);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.STARTED,
      onAdEvent);
  adsManager.addEventListener(
      google.ima.AdEvent.Type.COMPLETE,
      onAdEvent);
}

function onAdEvent(adEvent) {
    console.log('onAdEvent')
  // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
  // don't have ad object associated.
  var ad = adEvent.getAd();
  switch (adEvent.type) {
    case google.ima.AdEvent.Type.LOADED:
      // This is the first event sent for an ad - it is possible to
      // determine whether the ad is a video ad or an overlay.
      console.log('AdEvent.Type.LOADED')
      if (!ad.isLinear()) {
          
      }
      break;
    case google.ima.AdEvent.Type.STARTED:
        console.log('AdEvent.Type.STARTED')
      // This event indicates the ad has started - the video player
      // can adjust the UI, for example display a pause button and
      // remaining time.
      if (ad.isLinear()) {
        // For a linear ad, a timer can be started to poll for
        // the remaining time.
        intervalTimer = setInterval(
            function() {
              var remainingTime = adsManager.getRemainingTime();
            },
            300); // every 300ms
      }
      break;
    case google.ima.AdEvent.Type.COMPLETE:
        console.log('AdEvent.Type.COMPLETE')
      // This event indicates the ad has finished - the video player
      // can perform appropriate UI actions, such as removing the timer for
      // remaining time detection.
      if (ad.isLinear()) {
        clearInterval(intervalTimer);
      }
      break;
  }
}

function onAdError(adErrorEvent) {
  // Handle the error logging.
  console.log('onAdError')
  console.log(adErrorEvent.getError());
  adsManager.destroy();
  resumeGamePlay();
}

function onContentPauseRequested() {
  console.log('onContentPauseRequested')
  $('#adv_mainContainer').css('display','block');
  $('#adv_adContainer').css('display','block');
  $('#adv_emptContainer').css('display','block');
  updateAdPosition()
  isAdShowing = true;
  s_oMain.stopUpdate() 
  // This function is where you should setup UI for showing ads (e.g.
  // display ad timer countdown, disable seeking etc.)
  // setupUIForAds();
}   

function onContentResumeRequested() {
    console.log('onContentResumeRequested')
  //videoContent.play();
  resumeGamePlay();
  // This function is where you should ensure that your UI is ready
  // to play content. It is the responsibility of the Publisher to
  // implement this function when necessary.
  // setupUIForContent();

}

// Wire UI element references and UI event listeners.
init();


function resumeGamePlay(){
    console.log('resumeGamePlay')    
    $('#adv_mainContainer').css('display','none');
    $('#adv_emptContainer').css('display','none');    
    isAdShowing = false;
    s_oMain.startUpdate();
    createNewAdRequest()
    //showNextAd()
};

function updateAdPosition()
{
        document.getElementById('adv_mainContainer').style.width = $(window).width()+'px';
        document.getElementById('adv_mainContainer').style.height = $(window).height()+'px';
        
        console.log('update Position')
        w = $(window).width();
        h = $(window).height();
        if(w >= adW && h >= adH)
        {
           wOffSet = (w - (adW))/2
           hOffSet = (h - (adH))/2 
        }
        else
        {
            wOffSet = 0;
            hOffSet = 0;
        }
        
        
        document.getElementById('adv_mainContainer').style.top =  hOffSet + 'px'
        document.getElementById('adv_mainContainer').style.left = wOffSet + 'px'
}

function showNextAd()
{
    /*trace('showNextAd')
    setTimeout(function() {
    playAds()
    }, timerVar);*/
    console.log('adCount ' + adCount)
    adCount++
    if(adCount == 2)
    {
        playAds()
    }
}
