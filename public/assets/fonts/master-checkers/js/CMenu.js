function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oButCredits;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _pStartPosAudio;
    
    //Idnet Variables
    var _loginText;
    var _textGroup;
    
    var _oLeaderboardBtn;
    var _pLeaderboardBtn;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -450,oSprite, s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();
        
        s_oMain.createY8Logo("g_menulogo", 350, CANVAS_HEIGHT-60)
        
        var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard');
        _pLeaderboardBtn = {x: CANVAS_WIDTH - (oSprite.height+oSprite.height/2) - 20, y: (oSprite.height/2) + 25};            
       _oLeaderboardBtn = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite,s_oStage);
       _oLeaderboardBtn.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
     
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:20 + oSprite.width/2,y:(oSprite.height / 2) + 25};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite, s_oStage);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);
     
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 25};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && inIframe() === false){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _loginText = new createjs.Text("","bold 40px "+PRIMARY_FONT, "#FFFFFF");
        _loginText.shadow = new createjs.Shadow("#000000", 3, 3, 3);
        _loginText.x =  CANVAS_WIDTH/2;
        _loginText.y =  CANVAS_HEIGHT/2-250;
        _loginText.textBaseline = "alphabetic";
        _loginText.lineWidth = 500;
        _loginText.text = "Welcome Guest";
        _loginText.textAlign = 'right';
        _textGroup = new createjs.Container();
        _textGroup.alpha = 1;
        _textGroup.visible=true;        
        _textGroup.addChild(_loginText);
        s_oStage.addChild(_textGroup);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        _oFade.visible = false;
        _oLeaderboardBtn.unload()
        _oLeaderboardBtn = null;
         s_oMain.removeY8Logo()
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        _oButCredits.unload();
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.unload();
        }
        
        s_oStage.removeChild(_oBg);
        _oBg = null;
        s_oMenu = null;
    };
    
    this.getUserName = function () {
        if(s_isLogin===true){
            _loginText.text = 'Welcome '+s_userName;
            //_oLoginBtn.setVisible(false);
        }else{
            _loginText.text = "Welcome Guest";
        }
    };
    
    this._showLeaderboard = function()
    {
        console.log('_showLeaderboard')
        ID.GameAPI.Leaderboards.list({table:'Leaderboard',highest:false,useMilli:true})
        /*ID.GameAPI.Leaderboards.listCustom({} , function(data){
                console.log('Leaderboard ' + data);
             });*/
    }
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        _oButCredits.setPosition(_pStartPosCredits.x + iNewX,iNewY + _pStartPosCredits.y);
        
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,iNewY + _pStartPosFullscreen.y);
        }
        _oLeaderboardBtn.setPosition(_pLeaderboardBtn.x - iNewX, _pLeaderboardBtn.y + iNewY);
        s_oMain.logoReposition(iNewX+150, (CANVAS_HEIGHT-80) - iNewY)
        _loginText.x =  CANVAS_WIDTH-30 - iNewX
        _loginText.y =  CANVAS_HEIGHT-50 - iNewY;
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButPlayRelease = function(){
        this.unload();

        $(s_oMain).trigger("start_session");
        s_oMain.gotoModeMenu();
        try {
        console.log('Showing Ads')
        showNextAd()
        }
        catch (e) {
            console.log(e + ' Error Showing Ads')
            showMessage()
        }
    };

    this._onCredits = function(){
        new CCreditsPanel();
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
            s_bFullscreen = false;
        }else{
            _fRequestFullScreen.call(window.document.documentElement);
            s_bFullscreen = true;
        }
        
        sizeHandler();
    };
    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;