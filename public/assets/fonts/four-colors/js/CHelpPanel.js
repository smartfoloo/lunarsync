function CHelpPanel(){
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;    

    var _oHelpBg;
    var _oGroup;
    var _oParent;

    this._init = function(){
        var oParent = this;
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
  
        var oText1Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2)-200};
  
        _oText1Back = new createjs.Text(TEXT_HELP1," 24px Arial", "#000000");
        _oText1Back.x = oText1Pos.x+2;
        _oText1Back.y = oText1Pos.y+2;
        _oText1Back.textAlign = "center";
        _oText1Back.textBaseline = "alphabetic";
        _oText1Back.lineWidth = 400;
  
        _oText1 = new createjs.Text(TEXT_HELP1," 24px Arial", "#ffffff");
        _oText1.x = oText1Pos.x;
        _oText1.y = oText1Pos.y;
        _oText1.textAlign = "center";
        _oText1.textBaseline = "alphabetic";
        _oText1.lineWidth = 400;                
  
        var oText2Pos = {x: CANVAS_WIDTH/2 -130, y: (CANVAS_HEIGHT/2)-40}
  
        _oText2Back = new createjs.Text(TEXT_HELP2," 24px Arial", "#000000");
        _oText2Back.x = oText2Pos.x +2;
        _oText2Back.y = oText2Pos.y +2;
        _oText2Back.textAlign = "center";
        _oText2Back.textBaseline = "alphabetic";
        _oText2Back.lineWidth = 280;
  
        _oText2 = new createjs.Text(TEXT_HELP2," 24px Arial", "#ffffff");
        _oText2.x = oText2Pos.x;
        _oText2.y = oText2Pos.y;
        _oText2.textAlign = "center";
        _oText2.textBaseline = "alphabetic";
        _oText2.lineWidth = 280;
     
        
        _oGroup = new createjs.Container();
        _oGroup.addChild(_oHelpBg, _oText1Back,  _oText1, _oText2Back, _oText2);
        _oGroup.alpha=0;
        s_oStage.addChild(_oGroup);

        createjs.Tween.get(_oGroup).to({alpha:1}, 700);        
        
        _oGroup.on("pressup",function(){oParent._onExitHelp();});
        
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame._onExitHelp();
    };

    _oParent=this;
    this._init();

}
