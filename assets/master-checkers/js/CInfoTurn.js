function CInfoTurn(iX, iY, iType, oParentContainer){
    
    var _oPanel;
    var _oBg;
    var _oBgHighlight;
    var _oTime;
    var _oPawn;
    var _oParent;
  
    this._init = function(iX, iY, iType, oParentContainer){
        
        _oPanel = new createjs.Container();
        _oPanel.x = iX;
        _oPanel.y = iY;
        if(s_iGameType === MODE_HUMAN && iType === PAWN_BLACK && s_bMobile){
            _oPanel.rotation = 180;
        }
        oParentContainer.addChild(_oPanel);
        
        
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
        

        var oSprite = s_oSpriteLibrary.getSprite('pawn');
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: PAWN_SIZE, height: PAWN_SIZE, regX:PAWN_SIZE/2,regY:PAWN_SIZE/2}, 
                        animations: {  white: [0], black:[1], white_checker:[2], black_checker:[3]}

        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);        
        _oPawn = createSprite(oSpriteSheet,iType,PAWN_SIZE/2,PAWN_SIZE/2,PAWN_SIZE,PAWN_SIZE);
        _oPawn.x = 160;
        _oPawn.y = 2;
        _oPawn.stop();
        _oPanel.addChild(_oPawn);
        

        _oTime =  new createjs.Text("00:00","bold 58px "+PRIMARY_FONT, "#ffffff");
        _oTime.x = -75;
        _oTime.y = 2;
        _oTime.textBaseline = "middle";
        _oTime.lineWidth = 200;
        _oPanel.addChild(_oTime);
        
    };
    
    this.refreshTime = function(szTime){
        _oTime.text = szTime;
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
            createjs.Tween.removeAllTweens();
        } 
        
    };
   
    
    this.unload = function(){
        oParentContainer.removeChild(_oPanel);
    };
    
    this.setBgVisible = function(bVal){
        _oBg.visible = bVal;
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


