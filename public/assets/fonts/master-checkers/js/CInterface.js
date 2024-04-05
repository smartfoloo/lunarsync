function CInterface(){
    
    var _iNumChips;
    
    var _aWhiteChips;
    var _aBlackChips;
    
    var _oButExit;
    var _oAudioToggle;
    var _oHelpPanel=null;
    var _oWhitePanel;    
    var _oBlackPanel;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosFullscreen;
    var _pStartPosExit;
    var _pStartPosAudio;
    
    
    this._init = function(){                
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 25};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 125;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
           
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: oExitX, y: 25+ (oSprite.height/2)}; 
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
            _pStartPosFullscreen = {x:oSprite.width/4 + 20,y:(oSprite.height/2) +25};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oWhitePanel = new CInfoTurn(815,1630,PAWN_WHITE, s_oStage);        
        _oBlackPanel = new CInfoTurn(485,290,PAWN_BLACK, s_oStage);
        
        var iOffset = 19;
        _iNumChips = 12;

        _aBlackChips = new Array();
        for(var i=0; i<_iNumChips; i++){
            _aBlackChips[i] = createBitmap(s_oSpriteLibrary.getSprite('black_chip'));
            _aBlackChips[i].x = 310 + i*iOffset;
            _aBlackChips[i].y = 410;
            _aBlackChips[i].visible = false;
            s_oStage.addChild(_aBlackChips[i]);
        }
        
        _aWhiteChips = new Array();
        for(var i=0; i<_iNumChips; i++){
            _aWhiteChips[i] = createBitmap(s_oSpriteLibrary.getSprite('white_chip'));
            _aWhiteChips[i].x = 970 - i*iOffset;
            _aWhiteChips[i].y = 1424;
            _aWhiteChips[i].visible = false;
            s_oStage.addChild(_aWhiteChips[i]);
        }
       
       this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oButExit.unload();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        
        for(var i=0; i<_iNumChips; i++){
            s_oStage.removeChild(_aWhiteChips[i]);
            s_oStage.removeChild(_aBlackChips[i]);
        };
        
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.unload();
        }
        
        s_oInterface = null;        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,iNewY + _pStartPosFullscreen.y);
        }
    };

    this.refreshWhitePawnNumber = function(iNum){

        if(iNum < 0){
            iNum = 0;
        }
        for(var i=0; i<iNum; i++){
            _aWhiteChips[i].visible = true;
        }
        for(var i=iNum; i<_iNumChips; i++){
            _aWhiteChips[i].visible = false;
        }
        
    };
    
    this.refreshWhiteTime = function(iTime){
        trace('iTime ' + iTime)
        if(iTime > 50){
            _oWhitePanel.refreshTime(formatTime(iTime));
        }
        
    };
    
    this.refreshBlackPawnNumber = function(iNum){        
        if(iNum < 0){
            iNum = 0;
        }
        for(var i=0; i<iNum; i++){
            _aBlackChips[i].visible = true;
        }
        for(var i=iNum; i<_iNumChips; i++){
            _aBlackChips[i].visible = false;
        }
        
    };
    
    this.refreshBlackTime = function(iTime){
        if(iTime > 50){
            _oBlackPanel.refreshTime(formatTime(iTime));
        }
        
    };
    
    this.activePlayer = function(iCurPlayer){
        if(iCurPlayer === PAWN_WHITE){
            _oBlackPanel.active(false);
            _oWhitePanel.active(true);
        } else {
            _oWhitePanel.active(false);
            _oBlackPanel.active(true);
        }
    };

    this.setInfoVisible = function(bVal){
        _oWhitePanel.setPanelVisible(bVal);
        _oBlackPanel.setPanelVisible(bVal);
    };

    this._onButConfigRelease = function(){
        new CConfigPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
      s_oGame.onExit();  
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
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
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;