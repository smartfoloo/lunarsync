function CSelectPlayers(){
    var _oButP2;
    var _oButP3;
    var _oButP4;
    
    var _pStartPosButP2;
    var _pStartPosButP3;
    var _pStartPosButP4;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oAudioToggle;
    
    this._init = function(){
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_select_players"));
        s_oStage.addChild(oBg);
        
        var oSpriteP2 = s_oSpriteLibrary.getSprite('but_p2');
        _pStartPosButP2 = {x: (oSpriteP2.height/2) -10, y: (oSpriteP2.height/2)};            
        _oButP2 = new CGfxButton((CANVAS_WIDTH/2)-450,CANVAS_HEIGHT -500,oSpriteP2, s_oStage);
        _oButP2.addEventListener(ON_MOUSE_UP, this._onButP2, this);
        
        var oSpriteP3 = s_oSpriteLibrary.getSprite('but_p3');
        _pStartPosButP3 = {x: (oSpriteP3.height/2) -10, y: (oSpriteP3.height/2)};            
        _oButP3 = new CGfxButton((CANVAS_WIDTH/2)+10,CANVAS_HEIGHT -500,oSpriteP3, s_oStage);
        _oButP3.addEventListener(ON_MOUSE_UP, this._onButP3, this);
        
        var oSpriteP4 = s_oSpriteLibrary.getSprite('but_p4');
        _pStartPosButP4 = {x: (oSpriteP4.height/2) -10, y: (oSpriteP4.height/2)};            
        _oButP4 = new CGfxButton((CANVAS_WIDTH/2)+450,CANVAS_HEIGHT -500,oSpriteP4, s_oStage);
        _oButP4.addEventListener(ON_MOUSE_UP, this._onButP4, this);
        
         //var oTitleStroke = new createjs.Text(TEXT_ARE_SURE," 34px "+PRIMARY_FONT, "#000000")
        var oSelectPlayerText = new createjs.Text(TEXT_SELECT_PLAYERS," 55px "+PRIMARY_FONT,"#FFF");
        oSelectPlayerText.textAlign = "center";
        oSelectPlayerText.x = CANVAS_WIDTH/2;
        oSelectPlayerText.y = 300;
        oSelectPlayerText.textBaseline = "alphabetic";
        s_oStage.addChild(oSelectPlayerText);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};            
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
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oSprite.width/4 +10,y:(oSprite.height/2)+10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreen,this);
        }
        
        this.refreshButtonPos();
    };
    
    this._onButP2 = function (){
        NUM_PLAYERS = 2;
        this.unload();
        $(s_oMain).trigger("select_players",2);
        s_oMain.gotoGame();
    };

    this._onButP3 = function (){
        NUM_PLAYERS = 3;
        this.unload();
        $(s_oMain).trigger("select_players",3);
        s_oMain.gotoGame();
    };

    this._onButP4 = function (){
        NUM_PLAYERS = 4;
        this.unload();
        $(s_oMain).trigger("select_players",4);
        s_oMain.gotoGame();
    };

    this.unload = function (){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.unload();
        }
        
        _oButP2.unload();
        _oButP3.unload();
        _oButP4.unload();
        
        s_oStage.removeAllChildren();
        
        s_oSelectPlayers = null;
    };
    
    this.refreshButtonPos = function(){
       if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        } 
        
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this.resetFullscreenBut = function(){
	_oButFullscreen.setActive(s_bFullscreen);
    };

    this._onFullscreen = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    s_oSelectPlayers = this;
    this._init();
};


var s_oSelectPlayers = null;