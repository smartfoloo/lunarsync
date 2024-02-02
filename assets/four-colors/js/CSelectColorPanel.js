function CSelectColorPanel(szType,bPenality){
    
    var _oFade;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    var _oColorSprite;
    var _oColorContainer;
    var _oParent=this;
    var _oButRed;
    var _oButGreen;
    var _oButBlue;
    var _oButYellow;
    var _oParent;
    
    var _pStartPanelPos;
    var _oHitArea;
    
    this._init = function(){
        if (szType==="color"){
            playSound("special_card", 0.5,false);
        }
        _oParent = this;
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade,{override:true}).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        _oColorContainer = new createjs.Container();
        _oPanelContainer.addChild(_oColorContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('select_color_panel');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChildAt(oPanel,0);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer,{override:true}).to({y:CANVAS_HEIGHT/2 - 40},600, createjs.Ease.backOut);

        var oTitle = new createjs.Text(TEXT_SELECT_COLOR," 45px "+PRIMARY_FONT, "#ffffff");
        oTitle.y = -oSprite.height/2 + 90;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 400;
        _oPanelContainer.addChild(oTitle);
        
        _oColorContainer.y = _oPanelContainer.getBounds().height/5;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_red');
        _oButRed = new CGfxButton(-190,-20,oSprite,_oColorContainer);
        _oButRed.addEventListener(ON_MOUSE_UP,function(){_oParent.onSelectColor(0),_oColorContainer;});
        
        oSprite = s_oSpriteLibrary.getSprite('but_green');
        _oButGreen = new CGfxButton(-65,-20,oSprite,_oColorContainer);
        _oButGreen.addEventListener(ON_MOUSE_UP,function(){_oParent.onSelectColor(1),_oColorContainer;});
        
        oSprite = s_oSpriteLibrary.getSprite('but_blue');
        _oButBlue = new CGfxButton(65,-20,oSprite,_oColorContainer);
        _oButBlue.addEventListener(ON_MOUSE_UP,function(){_oParent.onSelectColor(2),_oColorContainer;});
        
        oSprite = s_oSpriteLibrary.getSprite('but_yellow');
        _oButYellow = new CGfxButton(190,-20,oSprite,_oColorContainer);
        _oButYellow.addEventListener(ON_MOUSE_UP,function(){_oParent.onSelectColor(3),_oColorContainer;});
        
    };

    this.onSelectColor = function(iIndex){
       s_oGame.onSelectColor(iIndex);
        _oParent.unload();
    };

    this.unload = function(){
        if(szType==="color"){
            new createjs.Tween.get(_oFade,{override:true}).to({alpha:0},500);
            new createjs.Tween.get(_oPanelContainer,{override:true}).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
                s_oStage.removeChild(_oFade,{override:true});
                s_oStage.removeChild(_oPanelContainer,{override:true});
                if(bPenality){
                    setTimeout(function(){if (s_oGame.getbUNO()===true){s_oGame.drawCards(0,2,0,bPenality)}else{s_oGame.onNextTurn()}},2000);
                }else{
                    s_oGame.onNextTurn();
                }
        });
        }else{
            new createjs.Tween.get(_oFade,{override:true}).to({alpha:0},500);
            new createjs.Tween.get(_oPanelContainer,{override:true}).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
                s_oStage.removeChild(_oFade);
                s_oStage.removeChild(_oPanelContainer);
                if(bPenality){
                    setTimeout(function(){if (s_oGame.getbUNO()===true){s_oGame.drawCards(0,2,0,bPenality)};setTimeout(function(){s_oCAnimation.drawFourAnim();},1000);},2000);
                }else{
                    s_oCAnimation.drawFourAnim(); 
                }
        });}
        
        _oFade.off("mousedown",function(){});
        
        
    };
 
    
    this._init();
    
    
};


