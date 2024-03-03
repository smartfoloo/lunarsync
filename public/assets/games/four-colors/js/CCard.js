function CCard(iX,iY,oParentContainer,szFotogram,iRank,iSuit){
    var _bPlaced=false;
    var _bValue=true;        
    var _bTurned;
    
    var _szType;
    var _szColor;
    var _szFotogram;
    var _iRank;
    
    var _iSuit;
    var _iFirstDrag;
    var _iDepth;
    
      
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oCardSprite;
    var _oHitArea;
    var _oContainer;
    var _oParentContainer;   
    var _oThisCard;
    var _oParent;
    var _oOldPos;
    

    
    this._init = function(iX,iY,oParentContainer,szFotogram,iRank,iSuit,oListener){
        _oParentContainer = oParentContainer;
        _szFotogram = szFotogram;
        _iRank = iRank;
        _iSuit = iSuit;
        _iFirstDrag = 0;
        _bTurned = false;
        _szType = "deck";
        
        
        if(_iSuit===0 || _iSuit=== 2){
            _szColor = "red";
        } else {
            _szColor = "black";
        }
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('cards');
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CARD_WIDTH, height: CARD_HEIGHT,regX:CARD_WIDTH/2,regY:CARD_HEIGHT/2}, 
                        animations: {  card_0_0: [0],card_0_1:[1],card_0_2:[2],card_0_3:[3],card_0_4:[4],card_0_5:[5],card_0_6:[6],card_0_7:[7],
                                       card_0_8:[8],card_0_9:[9],card_0_10:[10],card_0_11:[11],card_0_12:[12],
                                       card_1_0: [13],card_1_1:[14],card_1_2:[15],card_1_3:[16],card_1_4:[17],card_1_5:[18],card_1_6:[19],
                                       card_1_7:[20], card_1_8:[21],card_1_9:[22],card_1_10:[23],card_1_11:[24],card_1_12:[25],
                                       card_2_0: [26],card_2_1:[27],card_2_2:[28],card_2_3:[29],card_2_4:[30],card_2_5:[31],card_2_6:[32],
                                       card_2_7:[33], card_2_8:[34],card_2_9:[35],card_2_10:[36],card_2_11:[37],card_2_12:[38],
                                       card_3_0: [39],card_3_1:[40],card_3_2:[41],card_3_3:[42],card_3_4:[43],card_3_5:[44],card_3_6:[45],
                                       card_3_7:[46], card_3_8:[47],card_3_9:[48],card_3_10:[49],card_3_11:[50],card_3_12:[51],color:[52], draw_four:[53],back:[54], 
                                       tutorial:{ frames: [20,5,47,31], speed: 0.1}, 
                                       draw2tutorial: {frames: [12,25,38,51],speed: 0.1},
                                       stopTurnTutorial: {frames: [10,23,36,49], speed: 0.1},
                                       changeClockWiseTutorial: {frames: [11,24,37,50], speed: 0.1}}
                        
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oCardSprite = createSprite(oSpriteSheet,"back",CARD_WIDTH/2,CARD_HEIGHT/2,CARD_WIDTH,CARD_HEIGHT);
        _oCardSprite.stop();
        _oContainer.addChild(_oCardSprite);
        _oCardSprite.on("mousedown",this._mouseDown);
       
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
    };
    
    this.getCardSprite = function(){
       return _oCardSprite; 
    };
    
    this.setAnimTutorial = function (szAnim){
       _oCardSprite.gotoAndPlay(szAnim); 
    };
    
    this.unload = function(){
        _oCardSprite.off("mousedown",this._mouseDown);
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.unloadEvent = function (){
       _oCardSprite.off("mousedown",this._mouseDown);
       
    };
    
    this.saveInfo = function(){
        return {szFotogram : _szFotogram, iRank: _iRank, iSuit: _iSuit, bValue:_bValue}; 
    };
    
    this.changeInfo = function(szFotogram,iRank,iSuit){
        _szFotogram = szFotogram;
        _iRank = iRank;
        _iSuit = iSuit;
    };
    
    this.instantShow = function (){
        _oCardSprite.gotoAndStop(_szFotogram);
    };
    
    this.setValue = function(szType){
        _oCardSprite.gotoAndStop(_szFotogram);
        
        playSound("card",1,false);
        
        var oParent = this;
        createjs.Tween.get(_oContainer).to({scaleX:1}, 200).call(function (){
        });
    };
    
    this.setActive = function(bVar){
        if(bVar){
            _oContainer.addChild(_oHitArea);
        } else {
            _oContainer.removeChild(_oHitArea);
        }
    };
    
    this.setVisible = function(bVar){
        if(bVar===true){
            _oContainer.visible=true;
        } else {
            _oContainer.visible=false;
        }
        
    };
    
    this.onSetTurned = function(){
           _bTurned = true;
    };
    
    this.offSetTurned = function(){
        _bTurned = false;
    };
    
    this.moveCard = function(iX, iY, iTime,iDelay){
        var oParent = this;
       createjs.Tween.get(_oContainer).wait(iDelay).to({x:iX,y:iY}, iTime, createjs.Ease.linear).call(function(){
           s_oGame.playedCard(oParent);
       }); 
    };
    
    this.moveCardFirstHand = function(iX, iY, iTime,iDelay){ 
        var oParent = this;
        createjs.Tween.get(_oContainer).wait(iDelay).to({x:iX, y:iY}, iTime, createjs.Ease.cubicOut).call(function(){
            playSound("card_dealing",1,false);
            s_oGame.onCardDealed(oParent);
        });
    };
    
    this.moveFirstLastCard = function(iX, iY, iTime,iDelay){
        var oParent = this;
        createjs.Tween.get(_oContainer).wait(iDelay).to({x:iX, y:iY}, iTime, createjs.Ease.linear).call(function(){
            s_oGame.onFirstLastCardDealed(oParent);
        });
    };
    
   this.setOnTop = function(){
     _oParentContainer.addChildAt(_oContainer,_oParentContainer.numChildren); 
  };

    this.moveToSuit = function(iX, iY,iDelay){        
        
	createjs.Tween.get(_oContainer).wait(iDelay).to({x:iX, y:iY}, 200, createjs.Ease.cubicOut).call(function(){s_oGame.stackInSuit(_oParent);});
    };

    this.setPlaced = function(){
        _bPlaced=true;
        _oParent.showCard();
    };

    this.stackInPlace = function (iX, iY, iTime){
            createjs.Tween.get(_oContainer).to({x:iX, y:iY}, iTime, createjs.Ease.cubicOut).call(function(){_bTurned=true});       
    };

    this.stackAndDeactive = function (iX, iY, iTime){
            createjs.Tween.get(_oContainer).to({x:iX, y:iY}, iTime, createjs.Ease.cubicOut);       
    };

    this._mouseDown = function(event){
        if(_bTurned=== false){
            return;
        }
        s_oGame.pickCard(_oParent,event);
    };
    
    this.getPlaced = function(){
        return _bPlaced;
    };
        
    this.showCard = function(iDelay,szType){
        var oParent = this;
        createjs.Tween.get(_oContainer ).wait(iDelay).to({scaleX:0.1}, 200).call(function(){oParent.setValue(szType)}).call(function(){
            _bTurned=true;
            
        });
    };
    
      this.showCardNoInput = function(iDelay,szType){
        var oParent = this;
        createjs.Tween.get(_oContainer ).wait(iDelay).to({scaleX:0.1}, 200).call(function(){oParent.setValue(szType)}).call(function(){
            _bTurned=false;
            
        });
    };
		
    this.hideCard = function(){
        var oParent = this;
        createjs.Tween.get(_oContainer).to({scaleX:0.1}, 200).call(function(){oParent.setBack()});
    };
    
    this.setPos = function(iX, iY){
        _oContainer.x = iX;
        _oContainer.y = iY;
    };
    
    this.setBack = function(){
        _bTurned=false;
        _oCardSprite.gotoAndStop("back");
        var oParent = this;
        createjs.Tween.get(_oContainer).to({scaleX:1}, 200).call(function(){oParent.cardHidden()});
    };
    
    this.cardHidden = function(){
        if(_aCbCompleted[ON_CARD_HIDE]){
            _aCbCompleted[ON_CARD_HIDE].call(_aCbOwner[ON_CARD_HIDE],this);
        }
    };
    
    this.getRank = function(){
        return _iRank;
    };
		
    this.getSuit = function(){
        return _iSuit;
    };

    this.getColor = function(){
        return _szColor;
    };
    
    this.getFotogram = function(){
        return _szFotogram;
    };
    
    this.getPos = function(){
        return {x: _oContainer.x, y: _oContainer.y};
    };
    
    this.getSprite = function(){
        return _oContainer;
    };
    
    this.getLogicRect = function(){
        return new createjs.Rectangle(_oContainer.x - CARD_WIDTH/2,_oContainer.y - CARD_HEIGHT/2,CARD_WIDTH,CARD_HEIGHT);
    };
    
    this.getTurned = function(){
       return _bTurned; 
    };
    
    _oThisCard = this;
    
    _oParent=this;
    this._init(iX,iY,oParentContainer,szFotogram,iRank,iSuit);
    
    this.getGlobalToLocal = function(iX,iY){
       return _oCardSprite.globalToLocal(iX/s_oStage.scaleX,iY/s_oStage.scaleY);
    };
                
}