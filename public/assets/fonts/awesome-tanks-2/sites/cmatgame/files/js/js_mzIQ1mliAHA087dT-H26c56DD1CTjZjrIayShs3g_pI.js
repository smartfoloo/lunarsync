function iOSGE7() {
    var e;
    if (e = navigator.userAgent.match(/iPhone OS (7_[0-9_]+)/i)) {
        if (e.length > 1) {
            var t = e[1].replace("_", ".");
            if (t.length >= 3) {
                if (parseFloat(t.substr(0, 3)) >= 7) {
                    return true
                }
            }
        }
    }
    return false
}

function playGame(e) {
    if (e) {
        if (iOSGE7()) {
            var t = confirm('This game may not work well on your iPhone unfortunately (but it works great on iPads).');
            if (t) {
                document.forms["gamePlayForm"].submit()
            }
        } else {
            document.forms["gamePlayForm"].submit()
        }
    } else {
        document.forms["gamePlayForm"].submit()
    }
}


function showMoreIfNeeded() {
  // console.log('showMoreIfNeeded');
  var e = 0;
  if(jQuery("#gameInstructionsContent") !== 'undefined' && jQuery("#gameInstructionsInner").length) {
    e = jQuery(".field-mobile-instructions").height();
  }
  var t = 0;
  if(jQuery("#gameInstructionsInner") !== 'undefined' && jQuery("#gameInstructionsInner").length) {
    t = jQuery("#gameInstructionsInner").height();
  }
  if (e > t) {
      jQuery("#moreButton").css("display", "block")
  } else {
      jQuery("#moreButton").css("display", "hidden")
  }
}

function toggleInstructions() {
  var windWidth = jQuery(window).width();
  if (jQuery("#gameInstructionsInner").css("overflow") == "hidden") {
      jQuery("#gameInstructionsInner").css("overflow", "auto");
      jQuery("#gameInstructionsInner").css("height", "auto");
      jQuery("#moreButton").css("display", "none");
      jQuery("#lessButton").css("display", "block");
      jQuery("#gameInstructionsInner").css("max-height", "unset");
  } else {
      jQuery("#gameInstructionsInner").css("overflow", "hidden");
      jQuery("#gameInstructionsInner").css("max-height", "207px");
      jQuery("#moreButton").css("display", "block");
      jQuery("#lessButton").css("display", "none");
      if(windWidth >= 768){
        jQuery("#gameInstructionsInner").css("overflow", "hidden");
        jQuery("#gameInstructionsInner").css("max-height", "117px");
        jQuery("#moreButton").css("display", "block");
        jQuery("#lessButton").css("display", "none");
      }
    }
}

function activateDropMenuLink(e) {
    $("#dropMenuItems").children("a").each(function () {
        $(this).children("li").each(function () {
            $(this).removeClass("dropSelected");
            // //console.log("activateDropMenuLink: Slected Item "+$(this).text());
        })
    });
    $("#" + e).addClass("dropSelected")

}

function dismissMenu() {
    $("#navCheckbox").first().prop("checked", false);
    $("#dropMenuItems").animate({
        marginTop: "-203"
    }, 0);
    $("#contentFadeout").css("display", "none");
    unblockTouches()
}

function blockTouches() {
    $("#contentWrapper").bind("click touchmove", dismissMenu);
    $(".scrollableContentArea").bind("touchstart touchmove", false);
    $(".content").addClass("blockTouch")
}

function unblockTouches() {
    $("#contentWrapper").unbind("click touchmove", dismissMenu);
    $(".scrollableContentArea").unbind("touchstart touchmove", false);
    $(".content").removeClass("blockTouch")
}
function getCookie(key) {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}
function setCookie(key, value, exptime) {
  //document.cookie = key + '=' + value + ';';
  var d = new Date();
  d.setTime(d.getTime() + exptime);
  var expires = "expires="+d.toUTCString();
  document.cookie = key + "=" + value + "; " + expires +"; path=/; domain=."+window.location.host;
}
function checkIfInExperienceOrValidSubscriber(){
  var cmatgame_subscriber = getCookie('cmg_sx');
   var validSubscriber = false;
   if(typeof cmatgame_subscriber !== 'undefined' && cmatgame_subscriber !== null) {
    validSubscriber = true;
   }
   if(validSubscriber || (!validSubscriber && !schoolHours && targetStateUser && getCookie('cmg_active_anonymous_user') === null)) {
     return true;
   }
   return false;
 };
function user_loginbar_update() {
  var cmatgame_login = getCookie('cmg_l');
  var logout_html = '<a href="javascript:user_loginbar_logout(); return false;" onClick="user_loginbar_logout(event);">Logout</a>';
  if(typeof cmg_school_whitelisted !== 'undefined' && cmg_school_whitelisted === 'yes') {
    logout_html = '';
    if(jQuery('.link-container .login-link').length) {
      jQuery('.link-container .login-link').replaceWith('');
    }
  }
  if(typeof cmatgame_login !== undefined && cmatgame_login !== '' && cmatgame_login !==  null) {
    jQuery('.login-link a').replaceWith(logout_html);
    // jQuery('.myaccount-container').replaceWith('<a id="link-myaccount" href="/myaccount"><li id="myaccount" class="item left">MY ACCOUNT</li></a>');
    // jQuery('.myaccount-container').after('ul#menuItems a li:last');
    jQuery('ul#menuItems a:last').after('<a id="link-myaccount" href="/myaccount"><li id="myaccount" class="item left">MY ACCOUNT</li></a>');
    var cmatgame_subscriber = getCookie('cmg_sx');
  }
}
function user_loginbar_logout(event) {
  //console.log("Logout clicked "+event);
  event.preventDefault();
  cmg_vs = getCookie('cmg_ux');

  var dest = '';
  if(window.location.pathname !== 'undefined' && window.location.pathname !== '' && (window.location.pathname === '/' || window.location.pathname === '/myaccount')) {
    dest = '?destination=frontpage';
  } else if(window.location.pathname !== 'undefined' && window.location.pathname !== '' && window.location.pathname !== '/') {
    dest = '?destination='+window.location.pathname;
  }
  if(typeof cmg_vs !== 'undefined' && cmg_vs !== null) {
    if(getCookie('cmg_sx') !== null) {
      cmg_vs = cmg_vs + '/'+getCookie('cmg_sx');
    }
    dest = '/'+cmg_vs + dest + '&'+new Date().getTime();
  } else {
    dest = dest + '&'+new Date().getTime();
  }
  debugOut("Destination after logout : "+dest);
  debugOut("Logout URL:");
  if(window.location.host === 'm.cmatgame.local' || (typeof cmg_vs !== 'undefined' && cmg_vs !== null && getCookie('cmg_sx') !== null)) {
    debugOut(window.location.protocol + '//' +window.location.host + '/sub_check/logout'+dest);
    window.location.href = window.location.protocol + '//' +window.location.host + '/sub_check/logout'+dest;
  } else {
    debugOut(window.location.protocol + '//' + window.location.host + '/user/logout'+dest);
    window.location.href = window.location.protocol + '//' +window.location.host + '/user/logout'+dest;
  }
  //return false;
}
function checkActiveUser() {
  //We do not have new subscriber info. Check for older info.
  status = 0;
  //Not an active subscriber. Check if the user is logged in.
  cmgArr = unescape(getCookie('cmg_ux')).split("|");//365
  cmg_l = getCookie('cmg_l');
  cmgUx = 0;
  cmgLx = 1;
  if(typeof cmgArr !== 'undefined' && cmgArr.length == 2 && cmgArr[0] !== 'undefined' && cmgArr[0] !== '' && cmgArr[0] !== null && cmgArr[1]) {
    cmgUx = 1;
  }
  
  if(typeof cmg_l !== 'undefined' && cmg_l !== '' && cmg_l !== null) {
    cmgLx  = 0;
  }
  if(cmgUx && cmgLx) {
    status = getcmguserstatus(cmgArr[0], cmg_l);
  } else {
    status = 0;
  }
  return status;
}
function getcmguserstatus(cmg_ux, cmg_l) {
  url = "/ajax/subscriber/status/"+cmg_ux +'/'+cmg_ux+ '?'+new Date().getTime();
  if(typeof cmg_l !== 'undefined' && cmg_l !== '' && cmg_l !== null) {
    url = "/ajax/subscriber/status/"+cmg_ux+'/'+cmg_l + '?'+new Date().getTime();
  }
  status = 0;
  
  jQuery.getJSON(url, function(data) {
    cmg_sx = getCookie('cmg_sx');
    if(typeof data.sx !== undefined && data.sx === cmg_ux && typeof data.st !== undefined && data.st && typeof cmg_sx !== undefined && cmg_sx !== "" && cmg_sx !== null) {
      status = 1;
      jQuery(".ad-wrapper").each(function() {
          var self = jQuery(this);
          self.replaceWith("");
      });
      if(jQuery(".field-game").length) {
          removeAdSwfJWPLayer();
          jQuery("#subscriber-banner").replaceWith('<div id="subscriber-banner" class="adobe-analytics-sub-unlock"><a onclick="unlockAllLevels();" class="unlock-link">click-to-unlock</a></div>');
      }
      remove_anon_user_blocks();
    }
    cmg_ll = getCookie('cmg_l');
    if(typeof cmg_ll !== undefined && cmg_ll !== '' && cmg_ll !== null) {
      user_loginbar_update();
    }
  });
  return status;
}

function remove_anon_user_blocks() {
  //.panel-pane.pane-block.pane-cmatgame-advertisement-mobile-header-advertise-detail
  // jQuery('#contentWrapper').css('margin-top', '20px');
  jQuery('#gameListings').addClass('loggedInQueue');
  jQuery('.panel-pane.pane-block.pane-cmatgame-advertisement-mobile-header-advertise-detail').replaceWith('');
  // jQuery('.node-type-game #contentWrapper').css('margin-top', '100px');
  jQuery('.panel-pane.pane-block.pane-cmatgame-advertisement-mobile-footer-detail').replaceWith('');
  ///HEADER FIX FOR OVERLAPPING BLANK AD FOR BOTH
  jQuery('.mobile-header-ad').html('').css({'height':'60px','margin-bottom':'0px'});
  //footer HOMEPAGE AD COLLAPSE
  jQuery('.cmg-ad-nongame-300_250_footer').html('').css('height','0px');
  //FOOTER OTHER PAGES COLLAPSE (GAME DETAIL PAGES)
  jQuery('.pane-cmatgame-advertisement-mobile-ad-game-detail-300x250').html('');
  //console.log("remove_anon_user_blocks");
  jQuery('.pane-cmatgame-advertisement-mobile-ad-nongame-320x50-2.cmg-ad-nongame-320_50-2').replaceWith("").css('height', '0');
  trivia_mobile_experience();
}

function trivia_mobile_experience(){
  jQuery('.section-trivia.trivia-home #content').css('top','65px');
  jQuery('.trivia-cat #content').css('top','65px');
  jQuery('.node-type-quizitem #content').css('top','75px');
  jQuery('body.quiz-results .mobile-header').css({
    'position':'relative',
    // 'background':'#F00'
    });
  jQuery('.node-type-quizitem .mobile-header').css({
    'top':'0px',
    'padding-top':'15px'
    });
  jQuery('.section-trivia .mobile-header-ad').css({
    'height':'0',
    'margin-bottom':'0',
    'top':'0',
  });
  jQuery('.quiz-results .mobile-header-ad').css({
    'height':'0',
    'margin-bottom':'0',
    'top':'0',
  });
  // jQuery('.mobile-header').css({'top':'14px','background':'transparent'});
  jQuery('.trivia-cat .right-rail-box-container #box-slot-1.box-container').replaceWith('').css('height','0');
  // jQuery('.trivia-home .mobile-header-ad, .trivia-cat .mobile-header-ad, .node-type-quizitem .mobile-header-ad').css({
  //   'background':'transparent',
  //   'height':'0px'
  // });
  jQuery('.trivia-cat .pane-cmatgame-trivia-trivia-navigation').css('margin-top','20px');
  jQuery('.trivia-home .pane-cmatgame-trivia-trivia-navigation').css('margin-top','20px');
  jQuery('.trivia-home .mobile-header, .trivia-cat .mobile-header').css('top','0');
  jQuery('.section-trivia .mobile-container, trivia-home .mobile-container, .node-type-quizitem .mobile-container').css('height','0').replaceWith('');
  jQuery('.trivia-home .right-rail-box-container #box-slot-1.box-container').replaceWith('').css('height','0');
  jQuery('.box-container, .box-container-2').replaceWith('').css('height','0');
  jQuery('#box-slot-1.box-container').replaceWith('').css('height','0');
  jQuery('.section-trivia .box-placeholder').replaceWith('').css('height','0px');
  jQuery('.right-rail-box-container').css('left','0');
  jQuery('.section-trivia .mobile-container').replaceWith("").css('height', '0');
  // jQuery('.section-trivia .mobile-header-ad, .trivia-home .mobile-header-ad').html('').css({'height':'0px','margin-bottom':'0px','margin-top':'5px'});
  // jQuery('.section-trivia .mobile-header-ad, .trivia-home .mobile-header-ad, .trivia-cat .mobile-header-ad, .node-type-quizitem .mobile-header-ad, .trivia-home .mobile-header-ad, .trivia-cat .mobile-header-ad, .node-type-quizitem .mobile-header-ad').css({'height':'0px','margin-bottom':'0px','top':'0'});
  jQuery('.section-trivia .cmg-ad-nongame-300_250_footer').html('').css('height','0px').css('display','none');
  jQuery('.section-trivia .mobile-fixed-footer').css('height','0px');
}

function remove_ads_from_free_game_pages() {
  jQuery(".ad-wrapper").each(function() {
    var self = jQuery(this);
    self.replaceWith("");
  });
  //Exceptions mobile
  trivia_mobile_experience();
  jQuery('.pane-cmatgame-advertisement-mobile-header-advertise').replaceWith("").css('height', '0');
  //console.log('remove_ads_from_free_game_pages');
  jQuery('.pane-cmatgame-advertisement-mobile-footer-detail').replaceWith("").css('height', '0');
  jQuery('.pane-cmatgame-advertisement-mobile-ad-nongame-320x50-2.cmg-ad-nongame-320_50-2').replaceWith("").css('height', '0');
   //new ads added 20171116
  jQuery('.mobile-container').replaceWith("").css('height', '0');
  jQuery('.cmg-ad-nongame-320_50-3').replaceWith("").css('height', '0');
  ///HEADER FIX FOR OVERLAPPING BLANK AD FOR BOTH
  // jQuery('.mobile-header-ad').html('').css({'height':'20px','margin-bottom':'0px'});
  // jQuery('.section-trivia .mobile-header-ad').html('').css({'height':'60px','margin-bottom':'0px'});
  //FOOTER OTHER PAGES COLLAPSE (GAME DETAIL PAGES)
  jQuery('.pane-cmatgame-advertisement-mobile-ad-game-detail-300x250').html('');
  if(checkIfInExperienceOrValidSubscriber()) {
    jQuery('.mainMenu ul#menuItems').addClass("cmg-experience-leg");
    jQuery('.mainMenu .cmg-mobile-logo #logo img').addClass("cmg-experience-leg");
    jQuery('.contentWrapper').addClass('cmg-experience-leg');
    jQuery('.mobile-user-login').addClass('cmg-experience-leg');
  }
}
//Revalidate the user session only if valid subscriber
function cmguser_session_revalidate() {
  if(getCookie('cmg_sx') === null || window.location.pathname === '/myaccount' || window.location.pathname === '/cmatgame/login') {
    return;
  }
  var cmgvs = '';
  var cmgsx = '';
  var cmgl = '';
  var cmgux = '';
  if(getCookie('cmg_sx') !== null) {
    cmgsx = getCookie('cmg_sx');
  }
  if(getCookie('cmg_ux') !== null) {
    cmgux = getCookie('cmg_ux');
  }
  if(getCookie('cmg_vs') !== null) {
    cmgvs = getCookie('cmg_vs');
  }
  //valid subscriber and no session
  if(cmgsx !== '' && cmgux !== '' && cmgvs === '') {
    //console.log("Validating session for "+cmgux);
    if(getCookie('cmg_l') !== null) {
      cmgl = getCookie('cmg_l');
    }
    url = "/ajax/sub_check/session/"+cmgux +'/'+cmgux+ '?'+new Date().getTime();
    if(cmgl !== '') {
      url = "/ajax/sub_check/session/"+cmgux+'/'+cmgl + '?'+new Date().getTime();
    }
    jQuery.getJSON(url, function(data) {
      cmgvs1 = getCookie('cmg_vs');
      if(typeof data.vs !== undefined && data.vs === true && typeof data.st !== undefined && data.st === true && typeof cmgvs1 !== undefined && cmgvs1 !== "" && cmgvs1 !== null && typeof data.sx !== 'undefined' && data.sx === cmgvs1) {
        status = 1;
        //console.log("CMG subscriber has valid session");
      } else {
        //console.log("CMG subscriber does not have a valid session or was logged out from another session");
        //Reload the page after 5 seconds user to login page
        var dest = '';
        if(window.location.pathname !== 'undefined' && window.location.pathname !== '' && (window.location.pathname === '/' || window.location.pathname === '/myaccount')) {
          dest = '?destination=frontpage&smooab=true';
        } else if(window.location.pathname !== 'undefined' && window.location.pathname !== '' && window.location.pathname !== '/') {
          dest = '?destination='+window.location.pathname+'&smooab=true';
        }
        if(data.msg !== 'undefined' && data.msg !== '') {
          //setCookie('cmg_exp', data.msg, '1800000');var msgHtml = '<div class="messages--status messages error"><h2 class="element-invisible">Status message</h2>'+data.msg+'</div>';
          //jQuery('.panel-pane.pane-pane-messages .pane-content').html(msgHtml);
        }
        //setTimeout(function(){
        setCookie('cmg_exp', 'true', '1800000');
          if(window.location.host === 'cmatgame.local') {
            window.location.href = window.location.protocol + '//' +window.location.host + '/user/login'+dest;
          } else {
            window.location.href = window.location.protocol + '//' +window.location.host + '/session/logout'+dest;
          }
        //}, 5000);
      }
    });
  } else if(cmgsx !== '' && cmgux !== '' && cmgvs !== '')  {
    //console.log("We have a valid session. No revalidation done at this time for "+cmgux);
  } else if(cmgsx === '' && cmgux === '' && cmgvs === '') {
    //console.log("User not logged in. No session validation is needed");
  }
}

//console.log('loaded helper.js');

 jQuery(document).ready(function() {
  if(navigator.userAgent.match(/iPhone/i)){
    jQuery("a[href*='daily']").hide();
  }
  var e;
  if (this.href == '/'){
    jQuery(this).removeClass('active');
    //console.log('remove active');
  }
  if (e = navigator.userAgent.match(/iPhone OS (7_[0-9_]+)/i)) {
    if (e.length > 1) {
      var t = e[1].replace("_", ".");
      if (t.length >= 3) {
        if (parseFloat(t.substr(0, 3)) >= 7.1) {
          document.addEventListener("touchmove", function (e) {
            if (!jQuery(".contentWrapper").has(jQuery(e.target)).length) {
              e.preventDefault()
            }
          })
        }
      }
    }
  }
  showMoreIfNeeded();

  //hide menu item of daily games on iphone
 if(jQuery(window).width() >= 610 && jQuery(window).height() >= 610) {
 
 }

////This is for App Terms of Use and App Privacy Policy Pages Hiding the menu options and adding new image
  if(window.location.href.indexOf("app-privacy") > -1) {
    jQuery('body').css('background','#21364a');
    jQuery('.top-bar').html(' <img src="/sites/cmatgame/files/cmg-app-logo.png" class="app-page-logo"/>');
    jQuery('.top-bar').addClass('app-page-menu-hide');
    // jQuery('.scrollableContentArea .node-page h1').html(' ');
    jQuery('.scrollableContentArea .node-page h1').html('Privacy Policy');
    jQuery('.footer').hide();
    jQuery('.mobile-header-ad').html(' ');
    jQuery('.mobile-header-ad').css('padding-top','0px');
    jQuery('.node-type-page .scrollableContentArea .textContent a').css('padding','0px');
  }
  if(window.location.href.indexOf("app-terms-of-use") > -1) {
    jQuery('body').css('background','#21364a');
    jQuery('.top-bar').html(' <img src="/sites/cmatgame/files/cmg-app-logo.png" class="app-page-logo"/>');
    jQuery('.top-bar').addClass('app-page-menu-hide');
    jQuery('.scrollableContentArea .node-page h1').html('Terms of Use');
    jQuery('.footer').hide();
    jQuery('.mobile-header-ad').html(' ');
    jQuery('.mobile-header-ad').css('padding-top','0px');
    jQuery('.node-type-page .scrollableContentArea .textContent a').css('padding','0px');
  }
//////////////////////

  jQuery('ul#menuItems a:eq(0)').before('<a id="link-home" href="/"><li id="home-link" class="item left">HOME</li></a>');
  if(window.location.href.indexOf("quiz-category") > -1) {
    // alert('quiz category page');
      jQuery('#link-all-games-a-z').attr('href','/1-complete-game-list');
      jQuery('#link-most-popular').attr('href','/1-popular');
      jQuery('#link-trivia').attr('href','/trivia');
  }
  var toggleNav = function(){
    if(jQuery('.pageWrapper').hasClass('site-canvas--active')) {
      //close nav
      jQuery('.pageWrapper').removeClass('site-canvas--active');
      jQuery('.menu-icon, .close-panel').removeClass('close-canvas--active');
      ignoreBackgroundClick();
    } else{
      //menu button clicked
      jQuery('.pageWrapper').addClass('site-canvas--active');
      jQuery('.menu-icon, .close-panel').addClass('close-canvas--active');
      trackEvent('Mobile Menu','Menu Opened', document.title)
    }
  }
  jQuery('.toggle-nav, .close-panel').click(function(){
    toggleNav();
  });
  var iPadMenuChange = navigator.userAgent.match(/iPad/i) != null;
  if(iPadMenuChange === true){
    jQuery('ul.visible-nav li:eq(1)').before('<li  class="header-link-ipad"><a id="link-all-games-a-z" href="/1-complete-game-list">All Games</a></li>');
    jQuery('ul.visible-nav li:eq(1)').before('<li  class="trivia-ipad"><a id="trivia-link" href="/trivia">Trivia</a></li>');
    jQuery('a#link-all-games-a-z, a#trivia-link').css({
      'color':'#46b8fd',
      'font-family': 'ProximaNovaBold',
      'font-weight':'700'
    });
    jQuery('.header-link-ipad').css({
      'position':'relative',
      'width':'105px',
      'height':'0px',
      'float':'right',
      'right':'149px',
      'top':'-35px'
    });
    jQuery('.trivia-ipad').css({
      'position':'relative',
      'width':'80px',
      'height':'0px',
      'float':'right',
      'right':'250px',
      'letter-spacing':'0.03em',
      'top':'-35px'
    })
    jQuery('ul.visible-nav .logo').css('width','50%');
    // jQuery('li.off-canvas-close').css('top','-180px');
    // jQuery('.inner-right-nav').css('margin-top','125px');
    readiPadOrientation();
  }

function readiPadOrientation() {
  if (Math.abs(window.orientation) === 90) {
      // Landscape
    jQuery('.inner-right-nav').css('margin-top','125px');
    jQuery('li.off-canvas-close').css({
      'top':'-100px',
      'left':'220px'
    });
  } else {
    // Portrait
    jQuery('li.off-canvas-close').css('top','-180px');
    jQuery('.inner-right-nav').css('margin-top','125px');
  }
}
var iPhoneMenuChange = navigator.userAgent.match(/iPhone/i) != null;

function readiPhoneOrientation() {
  if (Math.abs(window.orientation) === 90) {
      // Landscape
    jQuery('.inner-right-nav').css('margin-top','60px');
    jQuery('li.off-canvas-close').css({
      'top':'-20px',
      'left':'163px'
    });
  } else {
    // Portrait
    jQuery('li.off-canvas-close').css('top','-40px');
    jQuery('.inner-right-nav').css('margin-top','60px');
  }
}
if(iPhoneMenuChange === true){
  readiPhoneOrientation();
  console.log('read iphone orientation');
}

jQuery(function($) {
      $(function(){
        var path = window.location.pathname;
        if ( path.length > 1 ) {
          $('a[href*="' + path + '"]').addClass('active');
        }
      });
    });

    //Remove ads when user is an active subscriber
    var cmg_sx = getCookie("cmg_sx");
    var cmg_l = getCookie("cmg_l");
    if(typeof cmg_sx === undefined || cmg_sx === "" || cmg_sx === null) {
      status = checkActiveUser();
      if(!status) {
        //console.log('display ads');
      }
    } else if(typeof cmg_sx !== undefined && cmg_sx !== "" && cmg_sx !== null) {
      //console.log('Removing ads');
      jQuery(".ad-wrapper").each(function() {
        var self = jQuery(this);
        self.replaceWith("");
      });
      if(jQuery(".field-game").length) {
        removeAdSwfJWPLayer();
        jQuery("#subscriber-banner").replaceWith('<div id="subscriber-banner" class="adobe-analytics-sub-unlock"><a onclick="unlockAllLevels();" class="unlock-link">click-to-unlock</a></div>');
      }
      remove_anon_user_blocks();
    } 
    
    if (typeof cmg_l !== undefined && cmg_l !== null && cmg_l !== '') {
      user_loginbar_update();
    }
    //Move the messages up
    if(jQuery('#cmatgame_mobile_status_message_form').length) {
      jQuery('#cmatgame_mobile_status_message').html(jQuery('#cmatgame_mobile_status_message_form'));
    }
    //console.log('coming before trialUser');
    //freeTrialUser - remove ad warppers
    if((typeof freeTrialUser !== 'undefined' && freeTrialUser) || (typeof cmg_school_whitelisted !== 'undefined' && cmg_school_whitelisted) || typeof cmg_no_ads !== 'undefined' && cmg_no_ads !== null) {
      remove_ads_from_free_game_pages();
      if(typeof cmg_school_whitelisted !== 'undefined' && cmg_school_whitelisted && jQuery('.link-container .login-link').length) {
        jQuery('.link-container .login-link').replaceWith('');
      //console.log('cmg_school_whitelisted: remove login links');
      }
      //console.log('remove_ads_from_free_game_pages + freeTrialUser defined && freeTrialUser');
    } else {
      //console.log('remove_ads_from_free_game_pages + not defined');
    }

    //check if the session is still valid
    cmguser_session_revalidate();

    //freeTrialUser and thank you page -- GA events for form submission events
    subscription_event_handler();
    
    //display error message when session expired
    session_expired_handler();
});

function session_expired_handler() {
  if(getCookie('cmg_exp') !== null) {
    setCookie('cmg_exp', 'false', -1000000);
    var msgHtml = '<div class="messages--status messages status"><h2 class="element-invisible">Error message</h2>'+
      'Hi – You’ve automatically been logged out of your CoolmathGames subscription. '+
      'Your subscription allows you to access CoolmathGames from up to 3 different web browsers at once – and you’ve now exceeded that limit or you have been logged out from an another session. '+
      'Please login again to access your subscription.'+
      '</div>';
    jQuery('.panel-pane.pane-page-content .pane-content #block-system-main').before(msgHtml)
  }
}
 
function getParameterByName(name) {
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(location.href);
  if (results === null) {
    return "";
  }
  return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function subscription_event_handler() {
  var signupPages = /signup|user\/[0-9]*\/subscription|myaccount/;
  var cmgsubl = /cmgsubl/;
  if(window.location.pathname === "/thankyou" && typeof subscriberLeg !== 'undefined' && 
      ( (typeof freeTrialUser !== 'undefined' && freeTrialUser && subscriberLeg !== 'Default Leg')
      || cmgsubl.test(location.search) ) ) {  
    var pageReloaded = false;
    var cmgTp = /cmgtypl/;
    if((cmgsubl.test(location.search) || !cmgTp.test(location.search) ) && (!testCMGStorage() ||  (testCMGStorage() && localStorage.getItem('cmgtypl') === null)) ) {
      var date = new Date();
      var hour = date.getHours();
      var usersubpage = /user\/[0-9]*\/subscription/;
      var gaaction = 'Subscription success';
      var cmgsubValue = getParameterByName('cmgsubl');
      
      if(cmgsubValue === 2 || cmgsubValue === '2') {
        gaaction = 'Subscription Reactivation success';
        trackEvent('Subscription Reactivation', gaaction, document.title);
        trackEvent('Subscription Reactivation', gaaction+' hour', hour);
      } else {
        trackEvent('Premium Subscription ' +subscriberLeg, gaaction, document.title);
        trackEvent('Premium Subscription ' +subscriberLeg, gaaction+' hour', hour);
      }
      
      
      //console.log('GA Event: Premium Subscription ' +subscriberLeg + ', '+gaaction+' hour, ' + hour);
      //replace history to add query param and also localstorage if available
      localStorage.setItem('cmgtypl', true);
      var cmgtypl_dt = new Date();
      cmgtypl_dt = cmgtypl_dt.getTime();
      var cmgtypl_search = "cmgtypl="+cmgtypl_dt;
      if(location.search && !cmgTp.test(location.search)) {
        cmgtypl_search = location.search + '&'+cmgtypl_search;
      } else if(location.search ) {
        cmgtypl_search = location.search;
      }
      history.replaceState("Thank you", "Thank you", location.pathname + cmgtypl_search);
    }
  } else if(signupPages.test(location.pathname) && testCMGStorage() && localStorage.getItem('cmgtypl') !== null) {
    localStorage.removeItem('cmgtypl');
  } else if(typeof freeTrialUser !== 'undefined' && freeTrialUser && signupPages.test(location.pathname) && typeof subscriberLeg !== 'undefined' && subscriberLeg !== 'Default Leg' && jQuery('.messages--error.messages.error').length) {
    //signup page with error
    var error_msg = jQuery('.messages--error.messages.error').text();
    error_msg = error_msg.replace(/Error message/gm,"");
    error_msg = error_msg.replace(/(\r\n|\n|\r)/gm,"");
    trackEventNonInteractive('Premium Subscription ' +subscriberLeg, 'Subscription error', error_msg);
    //console.log('GA Event: Premium Subscription ' +subscriberLeg + ', Subscription error, ' + error_msg);
  }
}
 
function testCMGStorage() {
  var cmgls = 'cmgls';
  try {
      localStorage.setItem(cmgls, true);
      localStorage.removeItem(cmgls);
      return true;
  } catch(e) {
      return false;
  }
}

window.onorientationchange = function () {
    jQuery(document).scrollTop(0)
}

function ignoreBackgroundClick(){
  if(jQuery('.site-canvas--active').length > 0){
    jQuery('.content').css('pointer-events','none');
    jQuery('.modal-background').addClass('modal-background--show');
  }
  else{
    jQuery('.content').css('pointer-events','initial');
    jQuery('.modal-background').removeClass('modal-background--show');
    // .css('background-color','rgba(0,0,0,0.0)');
  }
}

jQuery(document).click (function (e) {
  ignoreBackgroundClick();
  if (e.target != jQuery('.site-menu, .left-off-canvas-toggle, .site-menu a, .close-panel')[0]) {
     jQuery('.content').css('pointer-events','initial'); 
     jQuery('.pageWrapper').removeClass('site-canvas--active');
     jQuery('modal-background').removeClass('modal-background--show');
     // .css('background-color','rgba(0,0,0,0.0)');

  }
});

var enableDebug=false;
if(typeof getParameterByName === 'function' && getParameterByName('debug') !== '') {
  enableDebug = getParameterByName('debug');
}
function debugOut(msg){if(enableDebug){console.log(msg);}}
;
/**
 * @file
 * Copyright (c) 2017 Constructive Media, LLC
 *
 * The MIT license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function isTouchDevice()
{
    try
    {
        document.createEvent("TouchEvent");
        return true;
    }
    catch (e)
    {
        return false;
    }
}

function touchScroll(id)
{
    if (isTouchDevice())
    {
        var scrollStartPosY = 0;
        document.getElementById(id).addEventListener("touchstart", function (event)
        {
            scrollStartPosY = this.scrollTop + event.touches[0].pageY;
        },false);
        document.getElementById(id).addEventListener("touchmove", function(event)
        {
            if ((this.scrollTop < this.scrollHeight-this.offsetHeight && this.scrollTop+event.touches[0].pageY < scrollStartPosY-5) || (this.scrollTop != 0 && this.scrollTop+event.touches[0].pageY > scrollStartPosY+5))
            {
                event.preventDefault();
            }
            this.scrollTop=scrollStartPosY-event.touches[0].pageY;

        }, false);
    }

}

(function ($) {
$(document).ready(function ()
{
    if ((navigator.userAgent.match(/Android 2/i)))
    {
        touchScroll('contentWrapper');
    }
});
})(jQuery);;
/**
 * @file
 * Copyright (c) 2017 Constructive Media, LLC
 *
 * The MIT license
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function ($) {
$(document).ready(function ()
{
  var cWrapper = $('.contentWrapper');
	var mWrapper = $('.mainMenu');
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	
	//isHome
	var isHome = false;
	if($('.domain-m-coolmath-games-com, .domain-m-coolmathgames-com').hasClass('front')){
	  isHome = true;  
	}
	//isPopular
	var isPopular = false;
	if($('.domain-m-coolmath-games-com, .domain-m-coolmathgames-com').hasClass('page-1-popular')){
	  isPopular = true;  
	}
	//isAllGames
	var isAllGames = false;
	if($('.domain-m-coolmath-games-com, .domain-m-coolmathgames-com').hasClass('page-1-complete-game-list')){
	  isAllGames = true;  
	}
  //isGame
	var isGame = false;
	if($('.domain-m-coolmath-games-com, .domain-m-coolmathgames-com').hasClass('node-type-game')){
	  isGame = true;  
	}	
	//isCategory
	var isCategory = false;
	if($('.domain-m-coolmath-games-com, .domain-m-coolmathgames-com').hasClass('page-taxonomy')){
		isCategory = true;
	}
	
	//Taxonomy page title change for mobile daily games - CLSS-2008
	if($('.domain-m-coolmath-games-com, .domain-m-coolmathgames-com').hasClass('page-taxonomy-term-1058')){
		$('.page-taxonomy-term-1058 .content .pane-content .mobile-categories-header h2').html('Daily Games');
	}

	//alert(winWidth+'--'+winHeight);
	// if(winWidth <= 767 ){
	// 	if(isHome){
	// 		$('.view.mobile-newest-games .views-row').slice(-2).addClass('cmg-ad-hide');
	// 	}
	// }else if(winWidth >= 768){
	// 	$('#logo img').attr('src', Drupal.settings.cmgTheme.cmgTheme + '/logo_tab.png');
	// 	if(isHome){
	// 		var squareAd = '';
	// 		//homepage mobile most popular section
	// 		if($('.cmg-ad-nongame-320_50-2').length > 0){
	//     	squareAd = cWrapper.find('.cmg-ad-nongame-320_50-2');
	// 			$('.mobile-popular-games-top').find('.views-row-1').after(squareAd);
 //        console.log('test move top');
	// 		}
	// 		var squareAd2 = '';
	// 		if($('.cmg-ad-nongame-320_50-3').length > 0){
	//     	squareAd2 = cWrapper.find('.blockThree');
	// 			$('.mobile-popular-games-two').find('.views-row-1').after(squareAd2);
 //        console.log('test move 3rd');
	//   	}
	// 	}
	// 	if(isCategory){
	//   	//mobile categories pages
	// 		squareAd3 = '';
	// 		if($('.cmg-ad-nongame-320_50-2').length > 0){
	//     	squareAd3 = cWrapper.find('.homepage-medium-container');
	// 			$(squareAd3).insertAfter('.view-mobile-categories-qvu .views-row-1 .field-qt-game:first');
	//   	}
	// 	}
	// }

 //    squareAd = cWrapper.find('.cmg-ad-nongame-320_50-2');
 //    jQuery('.mobile-popular-games-top').find('.views-row-first').after(squareAd);
 //    console.log('test move top 2 ');


  if(winWidth <= 767 ){
    if(isHome){
      $('.view.mobile-newest-games .views-row').slice(-2).addClass('cmg-ad-hide');
    }
  }else if(winWidth >= 768){
    $('#logo img').attr('src', Drupal.settings.cmgTheme.cmgTheme + '/logo_tab.png');
    if(isHome){
      var squareAd = '';
      //homepage mobile most popular section
      if(cWrapper.find('.cmg-ad-nongame-320_50-2').length > 0){
        squareAd = cWrapper.find('.cmg-ad-nongame-320_50-2');
        $('.mobile-popular-games-top').find('.views-row-1').after(squareAd);
      }
      var squareAd2 = '';
      if(cWrapper.find('.cmg-ad-nongame-320_50-3').length > 0){
        squareAd2 = cWrapper.find('.cmg-ad-nongame-320_50-3');
        $('.mobile-popular-games-two').find('.views-row-1').after(squareAd2);
      }
    }
    if(isCategory){
      //mobile categories pages
      squareAd3 = '';
      if(cWrapper.find('.cmg-ad-nongame-320_50-2').length > 0){
        squareAd3 = cWrapper.find('.mobile-container');
        $(squareAd3).insertAfter('.view-mobile-categories-qvu .views-row-1 .field-qt-game:first');
      }
      if(cWrapper.find('.homepage-top-container').length > 0){
        $('.homepage-top-container').insertAfter('.mobile-header-ad');
      }
    }
  }


  //Add class to body tag based on browser
  var userAgent = navigator.userAgent;
  var appVersion = navigator.appVersion;
  var browserName = "";
  var OSName = "";
  if (userAgent.indexOf("MSIE") !== -1)
    browserName = "ie";
  if (userAgent.indexOf("Chrome") !== -1)
    browserName = "chrome";
  if (userAgent.indexOf("Firefox") !== -1)
    browserName = "firefox";
  jQuery("body").addClass(browserName);
  

  if (appVersion.indexOf("Win") !== -1)
    OSName = "windowsOS";
  if (appVersion.indexOf("Mac") !== -1)
    OSName = "macOS";
  if (appVersion.indexOf("Linux") !== -1)
    OSName = "linuxOs";
  jQuery("body").addClass(OSName);
  if (navigator.userAgent.indexOf('Mac OS X') != -1) {
	  jQuery("body").addClass("mac_browsers");
	  console.log("MAC Browsers");
	} else {
	  jQuery("body").addClass("pc");
	  console.log("Windows PC");
	}
	/*var adWrapper = $('.mainMenu').find('.pane-cmatgame-advertisement-mobile-header-advertise');
	  var targetAttr = adWrapper.find('.homeAd').attr('data-google-query-id');
	  if (typeof targetAttr !== typeof undefined && targetAttr !== false) {
		
	  }
	  alert($(body).hasClass('front') +'==='+ adWrapper.find('.homeAd').length > 0);
	  if($(body).hasClass('front') && adWrapper.find('.homeAd').length > 0){
	    var requiredHTML = adWrapper.html();
		alert(requiredHTML);
		$(requiredHTML).before($('.mobile-popular-games').parent('.pane-views-panes'));
	  }*/
});
document.addEventListener("touchstart", function() {},false);
})(jQuery);;
