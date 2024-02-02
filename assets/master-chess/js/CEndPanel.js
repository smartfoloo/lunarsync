function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oBlackPanel;
    var _oWhitePanel;

    var _oMsgText;
    var _oMsgTextUnder;
    var _oFade;

    var _oHome;
    var _oCheckBoard;
    var _oRestart;
    
    var _pLeaderboardBtn;
    var _oLeaderboardBtn;
    var _oLeaderboardBtn1;
    
    var _oMsgTextWin;
    var _oMsgTextUnderWin;
    
    this._init = function(oSpriteBg){
        
        s_oGame.pauseGame(true);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;

        _oMsgText = new createjs.Text("","bold 90px "+PRIMARY_FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2) - 280;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 800;
        
        _oMsgTextUnder = new createjs.Text("","bold 40px "+PRIMARY_FONT, "#ffffff");
        _oMsgTextUnder.x = CANVAS_WIDTH/2;
        _oMsgTextUnder.y = (CANVAS_HEIGHT/2) - 230;
        _oMsgTextUnder.textAlign = "center";
        _oMsgTextUnder.textBaseline = "alphabetic";
        _oMsgTextUnder.lineWidth = 800;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        if(isPlayAgainCom === true)
        {
            _oMsgTextUnderWin = new createjs.Text("","bold 40px "+PRIMARY_FONT, "#ffffff");
            _oMsgTextUnderWin.x = CANVAS_WIDTH/2;
            _oMsgTextUnderWin.y = (CANVAS_HEIGHT/2) - 180;
            _oMsgTextUnderWin.textAlign = "center";
            _oMsgTextUnderWin.textBaseline = "alphabetic";
            _oMsgTextUnderWin.lineWidth = 800; 
        }
        
        _oGroup.addChild(_oFade, _oBg,_oMsgText, _oMsgTextUnder, _oMsgTextUnderWin);
        _oBlackPanel = new CInfoTurn(CANVAS_WIDTH/2,1000,BLACK, _oGroup);
        _oBlackPanel.setBgVisible(false);
        _oBlackPanel.invert();
        _oWhitePanel = new CInfoTurn(CANVAS_WIDTH/2,850,WHITE, _oGroup);
        _oWhitePanel.setBgVisible(false);
        _oWhitePanel.invert();
        
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oRestart = new CGfxButton(CANVAS_WIDTH/2 - 270, CANVAS_HEIGHT/2 + 250, oSprite, _oGroup);
        _oRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_home');
        _oHome = new CGfxButton(CANVAS_WIDTH/2 - 90, CANVAS_HEIGHT/2 + 250, oSprite, _oGroup);
        _oHome.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_show');
        _oCheckBoard = new CGfxButton(CANVAS_WIDTH/2 + 270, CANVAS_HEIGHT/2 + 250, oSprite, _oGroup);
        _oCheckBoard.addEventListener(ON_MOUSE_UP, this._onShow, this);

         if(s_isLogin === false)
        {
            this.createSubmitScoreBtn()
        }
        else
        {
            this.createLeaderboardBtn()
        }        
        s_oStage.addChild(_oGroup);
        s_oMain.createY8Logo("g_menulogo", CANVAS_WIDTH / 2, CANVAS_HEIGHT-440)
    };
    
    this.createSubmitScoreBtn = function()
    {
        var oSprite = s_oSpriteLibrary.getSprite('but_submit_score');
        _pLeaderboardBtn = {x: CANVAS_WIDTH/2 + 90, y: CANVAS_HEIGHT/2 + 250};            
       _oLeaderboardBtn1 = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite, _oGroup);
       _oLeaderboardBtn1.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
    }
    this.createLeaderboardBtn = function()
    {
        var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard_End');
        _pLeaderboardBtn = {x: CANVAS_WIDTH/2 + 90, y: CANVAS_HEIGHT/2 + 250};            
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
            ID.GameAPI.Leaderboards.list({table:'Leaderboard'})
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
              s_oEndPanel.createLeaderboardBtn()
              s_oMain.getUserName(response.authResponse.details.nickname, true)
              s_oMain.submitScore(s_iScore)
           }
           else
           {
             ID.login(this.idCallback);
           }
         }
     }
     
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iWinner, iBlackTime, iWhiteTime, iBlackScore, iWhiteScore){
        
        _oBlackPanel.refreshTime(formatTime(iBlackTime));
        _oWhitePanel.refreshTime(formatTime(iWhiteTime));
        
        
        if(iWinner === WHITE){
            playSound("win",1,false); 
            
            _oMsgText.text = TEXT_CHECKMATE;
            _oMsgTextUnder.text = TEXT_WINS.format(WHITE);
        } else if(iWinner === BLACK) {
            if(MODE_HUMAN){
                playSound("win",1,false); 
            } else {
                playSound("game_over",1,false);
            }            
            _oMsgText.text = TEXT_CHECKMATE;
            _oMsgTextUnder.text = TEXT_WINS.format(BLACK);
        } else if(iWinner === DRAW){
            playSound("game_over",1,false);
            _oMsgText.text = TEXT_DRAW;
            _oMsgTextUnder.text = TEXT_STALEMATE;
        }
        
        if(isPlayAgainCom === true)
        {
            _oMsgTextUnderWin.text = "TOTAL WINS " + s_iScore;
            s_oMain.submitScore(s_iScore)
            saveDataItem()
        }
       
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500);
               
        $(s_oMain).trigger("save_score", [iWinner, iBlackTime, iWhiteTime, s_iGameType, iWhiteScore, iBlackScore]);
        $(s_oMain).trigger("share_event", [iWhiteScore, s_iGameType, iWinner] ); 
    };
    
    this._onRestart = function(){
        s_oGame.restartGame();
        try {
        console.log('Showing Ads')
        playAds()
        }
        catch (e) {
            console.log(e + ' Error Showing Ads')
            showMessage()
        }
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",this._onExit);
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        s_oStage.removeChild(_oGroup);
        
        _oHome.unload();
        _oCheckBoard.unload();
        
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
    
    this._onShow = function(){
        _oGroup.visible = false;
        
        $(s_oMain).trigger("end_session");
    };
    
    this._init(oSpriteBg);
    s_oEndPanel = this;
    return this;
}


var s_oEndPanel;