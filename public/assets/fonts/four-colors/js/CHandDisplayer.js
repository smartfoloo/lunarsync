function CHandDisplayer (iOffsetX,iOffsetY,iX,iY,iPlayer,oParentContainer,TEXTNAME){
    var _iOffsetX;
    var _iOffsetY;
    var _aCards;
    var _oContainer;
    var _oLinePlayer;
    var _oPlayerText;
    var _oCloudUno;
    var _oParentContainer;
    var _bThisTurn = false;
    
    this.init = function (){
        _iOffsetX = iOffsetX;
        _iOffsetY = iOffsetY;
        _aCards = new Array();
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer = oParentContainer;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("line_player");
        
        var oData = {
           images: [oSprite],
           frames: {width: 524, height: 18, regX: 524/2, regY: 18/2},
           animations: {
               off: [0],
               on: [1],
               idle:{frames: [0,1], speed: 0.1}
           }
        };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oLinePlayer = new createjs.Sprite(oSpriteSheet,"off");
        _oLinePlayer.stop();
        
        
        _oPlayerText = new createjs.Text(TEXTNAME," 34px "+PRIMARY_FONT, "#FFFFFF");
        
        if (_iOffsetX!==0){
            _oLinePlayer.x = CANVAS_WIDTH/2;
            if (iY>CANVAS_HEIGHT/2){
                _oPlayerText.x = (CANVAS_WIDTH/2)+40;
                _oLinePlayer.y = iY-135;
                _oPlayerText.y = iY-178;
            }else{
                _oPlayerText.x = (CANVAS_WIDTH/2)-195;
                _oLinePlayer.y = iY+135;
                _oPlayerText.y = iY+140;
            }
            
        }else{
            _oLinePlayer.y = CANVAS_HEIGHT/2;
            if (iX<CANVAS_WIDTH/2){
                _oLinePlayer.x = iX+100;
                _oLinePlayer.rotation = 90;
                _oPlayerText.x = iX+150;
                _oPlayerText.y = iY+70;
                _oPlayerText.rotation = 90;
            }else{
                _oLinePlayer.x = iX-100;
                _oLinePlayer.rotation = -90;
                _oPlayerText.x = iX-150;
                _oPlayerText.y = iY+6;
                _oPlayerText.rotation = -90;
            }
        }
        
        s_oStage.addChild(_oLinePlayer);
        s_oStage.addChild(_oPlayerText);
        
        
        oSprite = s_oSpriteLibrary.getSprite("cloud_uno");
        oData = {
            images: [oSprite],
            frames: {width: 261, height: 194, regX: 130.5, regY: 97},
            animations: {cloud1: [0], cloud2: [1]}
        };
        oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCloudUno = new createjs.Sprite(oSpriteSheet,"cloud1");
        _oCloudUno.alpha = 0;
        _oCloudUno.scaleX = 0.1;
        _oCloudUno.scaleY = 0.1;
        
    };
    
    this.getGlobalPosition = function(){
      var oGlobalPosition;
      var oCardsInfoX = 0;
      var oCardsInfoY = 0;
      for (var i=0;i<_aCards.length;i++){
          if (_iOffsetX!==0){
            oCardsInfoX += CARD_WIDTH/2;
       }else{
            oCardsInfoY += CARD_HEIGHT/2;
       }
      }
      oGlobalPosition = {x: _oContainer.x + oCardsInfoX, y: _oContainer.y + oCardsInfoY};
      return oGlobalPosition;
    };
    
    this.getContainerPos = function(){
       return  {x: _oContainer.x, y: _oContainer.y};
    };
    
    this.getCardPositionByIndex = function(index){
        var oCardInfo = _aCards[index].getPos();
        return {x: oCardInfo.x,y: oCardInfo.y};
    };
    
    this.searchIndexCard = function (CCard){
       for (var i=0;i<_aCards.length;i++){
           if (CCard===_aCards[i]){
               return i;
           }
       } 
    };
    
      this.removeCardByIndex = function(index){
      var aTmp = _aCards.splice(index,1);
      return aTmp;
  };
    
    this.getPosNewCard = function(){
       return {x: _aCards.length*_iOffsetX, y: _aCards.length*_iOffsetY}; 
    };
    
    this.pushCard = function(oCard){
        _aCards.push(oCard);
        if (_iOffsetY===0&&iY>CANVAS_HEIGHT/2){
            _aCards[_aCards.length-1].getCardSprite().on("mouseover",this.onMouseOver);
        }
    };
    
    this.getContainer = function(){
     return _oContainer; 
  };
  
  this.getLastCard = function(){
     return _aCards[_aCards.length-1]; 
  };
  
  this.getLength = function(){
      return _aCards.length;
  };
  
  this.centerContainer = function(){
        var oHandInfo;
            oHandInfo = _oContainer.getBounds();
            if (_iOffsetX !== 0) {
                createjs.Tween.get(_oContainer).to({x: CANVAS_WIDTH / 2 - (oHandInfo.width / 2) + (CARD_WIDTH / 2)}, 300, createjs.Ease.linear);
            } else {
                createjs.Tween.get(_oContainer).to({y: CANVAS_HEIGHT / 2 - (oHandInfo.height / 2) + (CARD_HEIGHT/ 1.5)-40}, 300, createjs.Ease.linear);
            }
        
  };
  
  this.setOnTop = function(){
     _oParentContainer.addChildAt(_oContainer,_oParentContainer.numChildren); 
  };
  
    this.setChildDepth = function(iIndex){
        if (iIndex>_oContainer.s_oStage.numChild-1){
            iIndex = _oContainer.s_oStage.numChild-1;
        }
     s_oStage.addChildAt(iIndex); 
  };
  
  this.getContainerInfo = function(){
     return _oContainer.getBounds(); 
  }; 
  
    
    this.getCardByIndex = function(index){
      var oSingleCard = _aCards[index];
      return oSingleCard;
  };
  
  
  this.organizeHand = function(iParent){
      var iOffsetIncrease;
      var oParent = this;
        if (_iOffsetX!==0){
          for (var i=0;i<_aCards.length;i++){
              iOffsetIncrease = _iOffsetX * i;
               createjs.Tween.get(_aCards[i].getSprite()).to({x: iOffsetIncrease},300, createjs.Ease.linear).call(oParent.centerContainer);
          }

        }else{
          for (var i=0;i<_aCards.length;i++){
                  iOffsetIncrease = _iOffsetY * i;
                   createjs.Tween.get(_aCards[i].getSprite()).to({y: iOffsetIncrease},300, createjs.Ease.linear).call(function(){oParent.centerContainer();});
          }        
        }
  };
  
   this.setOnTurn = function(){
      _oPlayerText.alpha = 1;
      _bThisTurn= true;
      if (createjs.Tween.hasActiveTweens(_oPlayerText)===false&&iPlayer===0){
            this.onTweenPlayer();
      }
      _oLinePlayer.gotoAndStop("on");
   };
   
   this.onTweenPlayer = function(){
       var oParent = this;
       if (_bThisTurn===true){
            new createjs.Tween.get(_oPlayerText).to({alpha: 0.15},500).to({alpha: 1},500).call(function(){oParent.onTweenPlayer();});
        }else{
            _oPlayerText.alpha = 0.15;
        }
   };
   
   this.setOffTurn = function (){
       createjs.Tween.removeTweens(_oPlayerText);
       _bThisTurn = false;
      _oPlayerText.alpha = 0.15;
      _oLinePlayer.gotoAndStop("off");
   };
   
   this.checkUno = function(){
       if (_aCards.length===1){
           this.setOnTop();
            if (_iOffsetX!==0){
                if (iY<CANVAS_HEIGHT/2){
                    _oCloudUno.gotoAndStop("cloud2");
                    _oCloudUno.x = (CANVAS_WIDTH/2)-270;
                    _oCloudUno.y = (CANVAS_HEIGHT/2)-300;
               }else{
                   _oCloudUno.gotoAndStop("cloud1");
                    _oCloudUno.x = (CANVAS_WIDTH/2)+300;
                    _oCloudUno.y = (CANVAS_HEIGHT/2)+100;
               }
        }else{
            if (iX<CANVAS_WIDTH/2){
                _oCloudUno.gotoAndStop("cloud1");
                _oCloudUno.x = (CANVAS_WIDTH/2)-350;
                _oCloudUno.y = (CANVAS_HEIGHT/2)-30;
            }else{
                _oCloudUno.gotoAndStop("cloud2");
                _oCloudUno.x = (CANVAS_WIDTH/2)+350;
                _oCloudUno.y = (CANVAS_HEIGHT/2)-200;
            }
        }
        s_oStage.addChild(_oCloudUno);
        new createjs.Tween.get(_oCloudUno).to({alpha: 1, scaleX: 1, scaleY:1},300, createjs.Ease.bounceOut).wait(1500).to({ scaleX: 0.1, scaleY: 0.1},300, createjs.Ease.cubicIn).to({alpha: 0},20).call(function(){s_oStage.removeChild(_oCloudUno);});
       }
   };
   
  this.onMouseOver = function(evt){
     if(!s_bMobile){
            evt.target.cursor = "pointer";
        }   
  };
    
    this.init();
}