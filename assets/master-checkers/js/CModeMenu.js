function CModeMenu(){
    
    var _oTextHead;
    
    var _oButHuman;
    var _oButComputer;
    var _oButExit;
    var _oAudioToggle = null;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    
    this._init = function(){

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mod_menu'));
        s_oStage.addChild(oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 25};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oExitX = CANVAS_WIDTH - (oSprite.width/2) - 125;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 25};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this); 
        }    
        
        _oTextHead = new createjs.Text(TEXT_MODE,"bold 80px "+PRIMARY_FONT, "#ffffff");
        _oTextHead.x = CANVAS_WIDTH/2;
        _oTextHead.y = 400;
        _oTextHead.textAlign = "center";
        _oTextHead.textBaseline = "middle";
        _oTextHead.lineWidth = 600;            
        s_oStage.addChild(_oTextHead);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_vs_man');
        _oButHuman = new CGfxButton(CANVAS_WIDTH/2,800,oSprite,s_oStage);
        _oButHuman.addEventListener(ON_MOUSE_UP, this._onButHumanRelease, this);
        //_oButHelp.setVisible(false);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_vs_pc');
        _oButComputer = new CGfxButton(CANVAS_WIDTH/2,1300,oSprite,s_oStage);
        _oButComputer.addEventListener(ON_MOUSE_UP, this._onButComputerRelease, this);
      
       
      
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.unload = function(){
        
        _oButHuman.unload();
        _oButComputer.unload();
        _oButExit.unload();

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oModeMenu = null;
        s_oStage.removeAllChildren();
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onButHumanRelease = function(){
        this.unload();
        s_gameMode = MODE_HUMAN
        s_oMain.gotoGame(MODE_HUMAN);
    };
    
    this._onButComputerRelease = function(){
        this.unload();
        s_gameMode = MODE_COMPUTER
        s_oMain.gotoGame(MODE_COMPUTER);
    };
    
    s_oModeMenu = this;
    this._init();
};

var s_oModeMenu = null;