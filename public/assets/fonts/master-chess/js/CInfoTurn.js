function CInfoTurn(iX, iY, iType, oParentContainer){
    
    var _oPanel;
    var _oBg;
    var _oBgHighlight;
    var _oTime;
    var _oPawn;
    var _oScorePanel;
    var _oScoreText;
    var _oParent;
  
    this._init = function(iX, iY, iType, oParentContainer){
        
        _oPanel = new createjs.Container();
        _oPanel.x = iX;
        _oPanel.y = iY;
        if(s_iGameType === MODE_HUMAN && iType === BLACK && s_bMobile){
            _oPanel.rotation = 180;
        }
        oParentContainer.addChild(_oPanel);
        
        _oScorePanel = new createjs.Container();
        var iX = -324;
        var iY = 30;
        if(iType === WHITE){
            _oScorePanel.x = iX;
            _oScorePanel.y = -iY;
            
        } else {
            _oScorePanel.x = -iX + 20;
            if(s_iGameType === MODE_HUMAN && iType === BLACK && s_bMobile){
                _oScorePanel.x = iX;
                _oScorePanel.y = -iY;
            }else {
                _oScorePanel.y = iY;
            }
        }
        _oPanel.addChild(_oScorePanel);
        
        if(!SHOW_SCORE || (s_iGameType === MODE_COMPUTER && iType === BLACK)){
            _oScorePanel.visible = false;
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('score_panel');
        var oScoreBg = createBitmap(oSprite);
        oScoreBg.regX = oSprite.width/2;
        oScoreBg.regY = oSprite.height/2;
        _oScorePanel.addChild(oScoreBg);
        
        _oScoreText = new createjs.Text(START_SCORE," 30px "+PRIMARY_FONT, "#ffffff");
        _oScoreText.x = 90;
        _oScoreText.textAlign = "right";
        _oScoreText.textBaseline = "middle";
        _oScoreText.lineWidth = 200;
        _oScorePanel.addChild(_oScoreText);
        
        
        var oSprite = s_oSpriteLibrary.getSprite('bg_turn');
        var oData = {   // image to use
                        images: [oSprite],
                        framerate: 58,
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX:(oSprite.width/2)/2,regY:oSprite.height/2}, 
                        animations: {  off: [0,0,"on"], on:[1,1,"off"]}
                        
        };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);        
        _oBg = createSprite(oSpriteSheet,0,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oBg.stop();
        _oPanel.addChild(_oBg);        
       
        
        _oBgHighlight = createSprite(oSpriteSheet,1,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oBgHighlight.stop();
        _oBgHighlight.x = 10;
        _oBgHighlight.alpha = 0;
        _oPanel.addChild(_oBgHighlight);

        var oSprite = s_oSpriteLibrary.getSprite(iType + '_king_marker');
        _oPawn = createBitmap(oSprite);
        _oPawn.x = 160;
        _oPawn.regX = oSprite.width/2;
        _oPawn.regY = oSprite.height/2;
        _oPanel.addChild(_oPawn);

        _oTime =  new createjs.Text("00:00"," 58px "+PRIMARY_FONT, "#ffffff");
        _oTime.x = -65;
        _oTime.y = 2;
        _oTime.textBaseline = "middle";
        _oTime.lineWidth = 200;
        _oPanel.addChild(_oTime);
        
    };
    
    this.refreshTime = function(szTime){
        _oTime.text = szTime;
    };
    
    this.refreshScore = function(szScore){
        _oScoreText.text = szScore;
    };
  
    this.invert = function(){
        _oTime.x = 0;
        _oPawn.x = -100;
    };
    
    this.active = function(bVal){
        if(bVal){
            createjs.Tween.get(_oBg).to({alpha:0}, 750, createjs.Ease.cubicOut).to({alpha:1}, 750, createjs.Ease.cubicIn).call(function(){_oParent.active(bVal);});
            createjs.Tween.get(_oBgHighlight).to({alpha:1}, 750, createjs.Ease.cubicOut).to({alpha:0}, 750, createjs.Ease.cubicIn);//.call(function(){});
        } else {
            _oBg.alpha = 1;
            _oBgHighlight.alpha = 0;
            createjs.Tween.removeTweens(_oBg);
            createjs.Tween.removeTweens(_oBgHighlight);
        } 
    };

    this.unload = function(){
        oParentContainer.removeChild(_oPanel);
    };
    
    this.setBgVisible = function(bVal){
        _oBg.visible = bVal;
        _oScorePanel.visible = bVal;
    };
    
    this.setPanelVisible = function(bVal){
        _oPanel.visible = bVal;
    };
    
    this.setPawn = function(iType){
        _oPawn.gotoAndStop(iType);
    };
    
    _oParent = this;
    this._init(iX, iY, iType, oParentContainer);
    
};


