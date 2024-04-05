function CMessage(iCurPlayer, szText){
    
    var _iStartX;
    var _iStartY;
    var _iEndY;
    
    var _oMessage;
    var _oParent;
    
    this._init = function(iCurPlayer, szText){
        
        if(iCurPlayer === PAWN_WHITE){
            _iStartX = 400;
            _iStartY = -200;
            _iEndY = 1490;
        } else {
            _iStartX = 920;
            _iStartY = CANVAS_HEIGHT + 200;
            _iEndY = 430;
        }
        
        _oMessage = new createjs.Container();
        _oMessage.x = _iStartX;
        _oMessage.y = _iStartY;
        if(s_bMobile && iCurPlayer === PAWN_BLACK){
            _oMessage.rotation = 180;
        }
        s_oStage.addChild(_oMessage);
        
        var oSprite = s_oSpriteLibrary.getSprite('message');
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        
        var oText = new createjs.Text(szText," 40px "+PRIMARY_FONT, "#ffffff");
        oText.textAlign = "center";
        oText.textBaseline = "top";
        oText.lineWidth = 350;
        oText.regY = oText.getBounds().height/2;
        
        _oMessage.addChild(oBg, oText);
        
        createjs.Tween.get(_oMessage).to({y:_iEndY}, 2000, createjs.Ease.bounceOut);
        
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oMessage);
    };
    
    _oParent = this;
    this._init(iCurPlayer, szText);
    
}