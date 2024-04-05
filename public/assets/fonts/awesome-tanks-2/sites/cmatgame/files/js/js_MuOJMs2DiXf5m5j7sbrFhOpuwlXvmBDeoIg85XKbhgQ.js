var cmg_gdpr_check = getCookie("GDPR");
var cmg_gdpr_reject_check = getCookie("GDPR_Reject");
var cmg_gdpr_all_check = getCookie("GDPR_All");  //GDPR_All cookie is set when user selects accept all cookies in the GDPR overlay
var cmg_gdpr_first_check = getCookie("GDPR_First");

if(cmg_gdpr_check == null ||  (cmg_gdpr_check != null && cmg_gdpr_reject_check == null && cmg_gdpr_all_check == null && cmg_gdpr_first_check == null) || (cmg_gdpr_check != null && (cmg_gdpr_all_check != null || cmg_gdpr_first_check != null))) {  //If GDPR_Reject cookie is set or only GDPR cookie is set then don't add google analytics 
  // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  //     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  //     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  // })(window,document,'script','../../../../../www.google-analytics.com/analytics.js','__gaTracker');

  if(window.location.host == "m-stage.coolmath-games.com" || window.location.host == "m-stage.coolmathgames.com" || window.location.host == "m-dev.coolmath-games.com" || window.location.host == "m-dev.coolmathgames.com" || window.location.host == "m-dev2.coolmath-games.com" || window.location.host == "m-dev2.coolmathgames.com" || window.location.host == "m-dev3.coolmath-games.com" || window.location.host == "m-dev3.coolmathgames.com" || window.location.host == "m.cmatgame.local") {
    __gaTracker('create', 'UA-1192998-21', 'auto');//TODO
  } else {
    __gaTracker('create', 'UA-1192998-17', 'auto');
  }

  if(cmg_gdpr_all_check !== null && cmg_gdpr_all_check === "true") {
    __gaTracker("set","contentGroup5","Accepted All Cookies");
  } else if(cmg_gdpr_first_check !== null && cmg_gdpr_first_check === "true"){
    __gaTracker("set","contentGroup5","Accepted First Party Cookies");     
  } else if(cmg_gdpr_check !== null) {
    __gaTracker("set","contentGroup5","GDPR Cookie set by Fastly"); 
  }

  //Premium subscription group
  if(typeof myDebugAction === 'function' && (window.location.host == 'm.cmatgame.local' || window.location.host == 'dev.coolmath-games.com' || window.location.host == 'dev.coolmathgames.com' || window.location.host == 'dev2.coolmath-games.com' || window.location.host == 'dev2.coolmathgames.com' )) {
    myDebugAction();
  }
  if(typeof subscriberLeg !== 'undefined' && subscriberLeg !== null && subscriberLeg !== '' && typeof freeTrialUser !== 'undefined' && freeTrialUser) {
    //console.log('Setting the subscriber leg to GA content group');
    __gaTracker("set","contentGroup4",subscriberLeg);
  }

  //Subscriber - non Subscriber
  if(typeof getCookie === 'function' ) {
    //console.log("getCookie is defined. Setting AnonymousVsSubscribers custom dimension");
    if(getCookie('cmg_l') !== null && getCookie('cmg_sx') !== null ) {
      __gaTracker("set","contentGroup5","Subscriber");
    } else if (getCookie('cmg_l') !== null && getCookie('cmg_sx') === null ) {
      __gaTracker("set","contentGroup5","Inactive Subscriber");
    } else {
      __gaTracker("set","contentGroup5","Anonymous user");
    }
  }
  //Mobile game type group
  if(typeof mobile_ga_game_type != "undefined" && mobile_ga_game_type !== '') {
    __gaTracker("set","contentGroup1", mobile_ga_game_type);
  }
  //User timezone hour
  __gaTracker('set', 'dimension11', ''+new Date().getHours()+'');

  __gaTracker('send', 'pageview');
} else if(cmg_gdpr_reject_check != null && cmg_gdpr_reject_check == "true"){
  //delete all other cookies like mbox, 
  document.cookie = "has_js" +"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + document.domain;
  if(document.domain == "www.coolmath-games.com") {
    document.cookie = "mbox" +"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.coolmath-games.com;";
    document.cookie = "_gat" +"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.coolmath-games.com;";
  } else {
    document.cookie = "mbox" +"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + document.domain;
    document.cookie = "_gat" +"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + document.domain;
  }  
  
}

function downloadJSAtOnload() {
        var element = document.createElement('script');
        element.src = '/sites/cmatgame/modules/custom/cmatgame_analytics/js/externalMin_07102014.js';
        document.body.appendChild(element);
        }

function trackEvent(category, action, label, value) {
  if(typeof value === 'undefined' || value === null) {
    value = 0;
  }
  if(typeof __gaTracker !== "undefined") {
    __gaTracker('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    });
  }
  
}

function trackEventNonInteractive(category, action, label, value, nonactive) {
  if(typeof value === 'undefined' || value === null) {
    value = 0;
  }
  if(typeof nonactive === 'undefined' || nonactive === null) {
    nonactive = 1;
  }
  if(typeof __gaTracker !== "undefined") {
    __gaTracker('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      nonInteraction : nonactive
    });
  }
  
};
