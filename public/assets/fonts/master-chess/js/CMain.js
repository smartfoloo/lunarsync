function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
	
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(30);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        this.getLocation()
    };
    
    this.preloaderReady = function(){
        this._loadImages();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

         if(_iCurResource === RESOURCE_TO_LOAD){
            this._onRemovePreloader();
         }
    };
    
    this._initSounds = function(){
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'win',loop:false,volume:1, ingamename: 'win'});
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded()
                                                        });
        }
        
    };  

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_mod_menu","./sprites/bg_mod_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("logo_ctl","./sprites/logo_ctl.png");
        
        s_oSpriteLibrary.addSprite("but_vs_man","./sprites/vs_man_panel.png"); 
        s_oSpriteLibrary.addSprite("but_vs_pc","./sprites/vs_pc_panel.png");
        s_oSpriteLibrary.addSprite("message","./sprites/message.png");
        
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_show","./sprites/but_show.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("board8","./sprites/grid_8.png");

        
        s_oSpriteLibrary.addSprite("threat","./sprites/threat.png");
        s_oSpriteLibrary.addSprite("highlight","./sprites/highlight.png");
        s_oSpriteLibrary.addSprite("bg_turn","./sprites/player_panel.png");
        s_oSpriteLibrary.addSprite("audio_icon_big","./sprites/audio_icon_big.png");
        
        s_oSpriteLibrary.addSprite("black_bishop","./sprites/pieces/black_bishop.png");
        s_oSpriteLibrary.addSprite("black_king","./sprites/pieces/black_king.png");
        s_oSpriteLibrary.addSprite("black_knight","./sprites/pieces/black_knight.png");
        s_oSpriteLibrary.addSprite("black_pawn","./sprites/pieces/black_pawn.png");
        s_oSpriteLibrary.addSprite("black_queen","./sprites/pieces/black_queen.png");
        s_oSpriteLibrary.addSprite("black_rook","./sprites/pieces/black_rook.png");
        
        s_oSpriteLibrary.addSprite("white_bishop","./sprites/pieces/white_bishop.png");
        s_oSpriteLibrary.addSprite("white_king","./sprites/pieces/white_king.png");
        s_oSpriteLibrary.addSprite("white_knight","./sprites/pieces/white_knight.png");
        s_oSpriteLibrary.addSprite("white_pawn","./sprites/pieces/white_pawn.png");
        s_oSpriteLibrary.addSprite("white_queen","./sprites/pieces/white_queen.png");
        s_oSpriteLibrary.addSprite("white_rook","./sprites/pieces/white_rook.png");
        
        s_oSpriteLibrary.addSprite("white_king_marker","./sprites/white_king_marker.png");
        s_oSpriteLibrary.addSprite("black_king_marker","./sprites/black_king_marker.png");
        s_oSpriteLibrary.addSprite("score_panel","./sprites/score_panel.png");
        
        s_oSpriteLibrary.addSprite("toggle_easy","./sprites/toggle_easy.png");
        s_oSpriteLibrary.addSprite("toggle_medium","./sprites/toggle_medium.png");
        s_oSpriteLibrary.addSprite("toggle_hard","./sprites/toggle_hard.png");
        
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no","./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        
        s_oSpriteLibrary.addSprite("y8logo","./sprites/y8logo.png");
        s_oSpriteLibrary.addSprite("but_leaderboard","./sprites/leaderBoar_Btn.png");
        s_oSpriteLibrary.addSprite("but_leaderboard_End","./sprites/leaderBoar_Btn_med.png");
        s_oSpriteLibrary.addSprite("but_submit_score","./sprites/submit_score.png");
        s_oSpriteLibrary.addSprite("adv_message","./sprites/adv_message.png");
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            this._onRemovePreloader();
        }
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();

        this.gotoMenu();
    };
    
    this._onAllImagesLoaded = function(){
        
    };

    
    this.gotoMenu = function(){
        getDataItem()
        _oMenu = new CMenu();
        _iState = STATE_MENU;
        this.getUserName(s_userName, s_isLogin);
    };
    
    
    this.gotoModeMenu = function(){
        _oModeMenu = new CModeMenu();
        _iState = STATE_MENU;
    };
    

    this.gotoGame = function(iType){
        
        s_iGameType = iType;

        _oGame = new CGame(_oData);   						
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        if(isAdShowing === false)
        {
            s_iPrevTime = new Date().getTime();
            _bUpdate = true;
            createjs.Ticker.paused = false;
            $("#block_game").css("display","none");

            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                if(s_bAudioActive){
                    Howler.mute(false);
                }
            }
        }
        
    };

    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    /********************Id net and Branding Functions***************/
     this.createY8Logo = function(str, posX, posY, alphaTween)
    {
       var y8logoMc = s_oSpriteLibrary.getSprite('y8logo');
       s_y8logo = new Y8logo(posX, posY, y8logoMc, str);
    };
    
    this.removeY8Logo = function(str)
    {
       s_y8logo.unload();
       s_y8logo = null;
    };
    
    this.logoReposition = function(intX, intY)
    {
       s_y8logo.setX(intX)
       s_y8logo.setY(intY)
    };
    
    this.ShowY8Anim = function(act)
    {
        if(act === true)
        {
           s_y8logo.showAnim(); 
        }
        else
        {
           s_y8logo.removeAnim();
        }
        
    };
    
    this.getUserName = function(_getUserName,_flag){
        s_isLogin = _flag;
        s_userName = _getUserName;
        if(_iState === STATE_MENU && s_isBlacklisted === false)
        {
             _oMenu.getUserName();
        }
        console.log('username : ',_getUserName);
    };
    this.getLocation = function()
    {
            s_URLlocation = self.location.hostname
            console.log('URLlocation: ' + s_URLlocation)
    }
    this.sponsorStatus = function (_getSponsorStatus) {
       s_sponsor = _getSponsorStatus
       if(_iState === STATE_LOADING && s_isBlacklisted === false && s_sponsor === true){s_y8logo.removeListeners()}
       if(_iState === STATE_MENU && s_isBlacklisted === false && s_sponsor === true){s_y8logo.removeListeners()} 
    };
    
    this.blackListState = function (_blackliststate) {
        //console.log('blackListState ')
       
        if(_blackliststate){
            var blacklisted = CBlacklist(_iState, s_gameName);
            s_isBlacklisted = true
        }
    };
    
    this.unloadScreens = function(scr)
    {
        if(scr === STATE_MENU && s_oMenu != null){
           console.log('_oMenu ' + _oMenu); _oMenu.unload()
        }
        if(scr === STATE_LOADING){
            _oPreloader.unload()
        }
        if(scr === STATE_GAME){
            _oGame.unload()
        }
    }
    
    this.submitScore = function(_iScore)
    { 
        if(s_isLogin === true)
        {
         ID.GameAPI.Leaderboards.save({'table':'Leaderboard','points':_iScore});   
        }
        
        
    }
    
    this.gotoLoginWindows = function () {
        console.log('gotoLoginWindows ')
        _iState = STATE_SAVESLOTS
        _oSaveSlot = new CSaveSlot();
    };
    
    /*********************************************************************/
    
    s_oMain = this;
    
    _oData = oData;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    
    this.initContainer();
}

function saveDataItem(){
     trace('saveDataItem ')
    localStorage.setItem("Scores", s_iScore);
    trace('s_iScore ' + s_iScore)
}

function getDataItem(){
    trace('getDataItem')
    var szFlag = localStorage.getItem("Scores");
    trace('szFlag ' + szFlag)
     if(szFlag !== null && szFlag !== undefined){
        trace('szFlag this')
        s_iScore = parseInt(localStorage.getItem("Scores"));
    }
    else
    {
        trace('szFlag that')
       s_iScore = 0; 
    }
    trace('s_iScore ' + s_iScore)
}

function showMessage()
{
    console.log('showMessage')
    isAdBlock = true;
    var oSprite = s_oSpriteLibrary.getSprite('adv_message');
    var messBox = createBitmap(oSprite);
    s_oStage.addChild(messBox);
    messBox.regX = oSprite.width/2;
    messBox.regY = oSprite.height/2;
    messBox.x = CANVAS_WIDTH/2;
    messBox.y = CANVAS_HEIGHT/2;
    messBox.addEventListener("click", function(){
            console.log('messBox click')
           s_oStage.removeChild(messBox);
           messBox = null;
           oSprite = null;
    })
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
var s_iGameType;
var s_aSounds;

var s_bWeightSquares = false;
var s_bEdgeSensitive = false;

//Id net variables
var s_isLogin = false;
var s_userName = 'guest';
var s_URLlocation;
var s_gameName = "master_chess"
var s_isBlacklisted = false
var isTutorial = false
var s_y8logo;
    
var s_sponsor = false;
var s_iScore = 0;

var isPlayAgainCom = false;

var isFirstAdPlayed = false;
var isAdShowing = false;
var isAdBlock = false;
