function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oBlackPanel;
    var _oWhitePanel;

    var _oMsgText;
    var _oMsgTextUnder;
    var _oFade;
    
    var _pLeaderboardBtn;
    var _oLeaderboardBtn;
    var _oLeaderboardBtn1
    
    var _oButRestart;
    var _oButHome;
    
    var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT/2

    
    this._init = function(oSpriteBg){
        
        s_oGame.pauseGame(true);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        //s_oStage.addChild(_oFade);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;

        _oMsgText = new createjs.Text("","bold 90px "+PRIMARY_FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2) - 200;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 800;
        
        _oMsgTextUnder = new createjs.Text("","bold 40px "+PRIMARY_FONT, "#ffffff");
        _oMsgTextUnder.x = CANVAS_WIDTH/2;
        _oMsgTextUnder.y = (CANVAS_HEIGHT/2) - 150;
        _oMsgTextUnder.textAlign = "center";
        _oMsgTextUnder.textBaseline = "alphabetic";
        _oMsgTextUnder.lineWidth = 800;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oFade, _oBg,_oMsgText, _oMsgTextUnder);
        _oBlackPanel = new CInfoTurn(CANVAS_WIDTH/2,1120,PAWN_BLACK, _oGroup);
        _oBlackPanel.setBgVisible(false);
        _oBlackPanel.invert();
        _oWhitePanel = new CInfoTurn(CANVAS_WIDTH/2,970,PAWN_WHITE, _oGroup);
        _oWhitePanel.setBgVisible(false);
        _oWhitePanel.invert();
        //_oWhitePanel.setPawn(PAWN_WHITE);

        s_oStage.addChild(_oGroup);
        
         var oSpriteRestart = s_oSpriteLibrary.getSprite('but_restart');
        _oButRestart = new CGfxButton(CANVAS_WIDTH / 2 + 170, CANVAS_HEIGHT_HALF + 300, oSpriteRestart, _oGroup);


        var oSpriteHome = s_oSpriteLibrary.getSprite('but_exit');
        _oButHome = new CGfxButton(CANVAS_WIDTH / 2 - 170, CANVAS_HEIGHT_HALF + 300, oSpriteHome, _oGroup);
        
        if(s_gameMode === MODE_COMPUTER)
        {
            if(s_isLogin === false)
            {
                this.createSubmitScoreBtn()
            }
            else
            {
                this.createLeaderboardBtn()
            }
        }
        
        s_oMain.createY8Logo("g_menulogo", CANVAS_WIDTH/2, CANVAS_HEIGHT-350)
    };
    
    this.createSubmitScoreBtn = function()
    {
        var oSprite = s_oSpriteLibrary.getSprite('but_submit_score');
        _pLeaderboardBtn = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT_HALF + 300};            
       _oLeaderboardBtn1 = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite, _oGroup);
       _oLeaderboardBtn1.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
    }
    this.createLeaderboardBtn = function()
    {
        var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard');
        _pLeaderboardBtn = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT_HALF + 300};            
       _oLeaderboardBtn = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite, _oGroup);
       _oLeaderboardBtn.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
    }
    
    this._showLeaderboard = function()
    {
        console.log('_showLeaderboard')
        if(s_isLogin === false)
        {
            this._onLoginClicked()
        }
        else
        {
            ID.GameAPI.Leaderboards.list({table:'Leaderboard',highest:false,useMilli:true})
        } 
    }
    
    this._onLoginClicked = function () {
            ID.login(this.idCallback);
    };
    
    this.idCallback = function(response){
          if (response) {
          if(response.status === 'ok')
           {
              _oLeaderboardBtn1.unload()
              s_gameOver.createLeaderboardBtn()
              s_oMain.getUserName(response.authResponse.details.nickname, true)
              console.log('s_gameWin ' + s_gameWin)
              if(s_gameWin === true)
              {
                  s_oMain.submitScore(s_iScore)
              }
              
           }
           else
           {
             ID.login(this.idCallback);
           }
         }
     }
    
    this.unload = function(){
       // _oGroup.off("mousedown",this._onExit);
        if(s_gameMode === MODE_COMPUTER)
        {
            if(s_isLogin === false)
            {
                _oLeaderboardBtn1.unload();
            }
            else
            {
                _oLeaderboardBtn.unload();
            }
        }
        _oButHome.unload()
        _oButRestart.unload()
    };
    
    this._initListener = function(){
        //_oGroup.on("mousedown",this._onExit);
        _oButHome.addEventListener(ON_MOUSE_UP, this._onExit, this);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
    };
    
    this.show = function(iWinner, iBlackTime, iWhiteTime){
        
        _oBlackPanel.refreshTime(formatTime(iBlackTime));
        _oWhitePanel.refreshTime(formatTime(iWhiteTime));
        
        
        if(iWinner === WIN_WHITE){
            playSound("win",1,0); 
            s_gameWin = true
            
            _oMsgText.text = TEXT_WHITE + " " +TEXT_GAMEOVER;
        } else if(iWinner === WIN_BLACK) {
            if(MODE_HUMAN){
                playSound("win",1,0); 
            } else {
                playSound("game_over",1,0);
                s_gameWin = false
            }            
            _oMsgText.text = TEXT_BLACK + " " +TEXT_GAMEOVER;
            
        } else if(iWinner === DRAW){ //DRAW            
            playSound("game_over",1,0);
            _oMsgText.text = TEXT_DRAW;
            s_gameWin = true
        } else if(iWinner === WIN_WHITE_BLACK_NOMOVES){
            playSound("win",1,0); 
            _oMsgText.text = TEXT_WHITE + " " +TEXT_GAMEOVER;
            _oMsgTextUnder.text = "(" +TEXT_BLACK + " " + TEXT_MOVES_AVAIL +")";
            s_gameWin = true
        } else if(iWinner === WIN_BLACK_WHITE_NOMOVES){
            if(MODE_HUMAN){
                playSound("win",1,0);  
            } else {
                playSound("game_over",1,0);
                s_gameWin = false
            }            
            _oMsgText.text = TEXT_BLACK + " " +TEXT_GAMEOVER;
            _oMsgTextUnder.text = "(" +TEXT_WHITE + " " + TEXT_MOVES_AVAIL +")";
        }
       
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        //new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        var iWhiteScore = 1800000 - iBlackTime;     
        console.log('iWhiteScore ' + iWhiteScore)
        s_iScore = iWhiteTime
        console.log('s_gameWin ' + s_gameWin)
        if(s_gameWin === true)
        {
             s_oMain.submitScore(s_iScore)
        }
        $(s_oMain).trigger("save_score", [iWinner, iBlackTime, iWhiteTime, s_iGameType, iWhiteScore]);
        $(s_oMain).trigger("share_event", [iWhiteScore, s_iGameType, iWinner] ); 
    };
    
    this._onRestart = function()
    {
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        s_gameOver.unload()
        s_oStage.removeChild(_oGroup);
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        s_oGame.onRestart();
        try {
        console.log('Showing Ads')
        playAds()
        }
        catch (e) {
            console.log(e + ' Error Showing Ads')
            showMessage()
        }
        
    }
    
    this._onExit = function(){
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        s_gameOver.unload()
        s_oStage.removeChild(_oGroup);
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.onExit();
        try {
        console.log('Showing Ads')
        playAds()
        }
        catch (e) {
            console.log(e + ' Error Showing Ads')
            showMessage()
        }
    };
    
    this._init(oSpriteBg);
    s_gameOver = this

    return this;
}

var s_gameOver; 