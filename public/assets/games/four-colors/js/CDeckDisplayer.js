function CDeckDisplayer (iX,iY,oParentContainer){
   var _aCards;
   var _oContainer;
   var _bDisableInput;
   var _oParentContainer;
   
   this._init = function(){
       _aCards = new Array();
       _oContainer = new createjs.Container();
       _bDisableInput = false;
       _oContainer.x = iX;
       _oContainer.y = iY;
       _oParentContainer = oParentContainer;
       _oParentContainer.addChild(_oContainer,_oParentContainer);
       _oContainer.on("mousedown",this.onDraw,this);
   };
   
   this.initializeDeck = function(){
       var iTmpSum = 0;
       var iRank;
      for (var i=0;i<4;i++){
          for (var j=0;j<10;j++){
              iRank = j;
             _aCards.push(new CCard(0,0,_oContainer,"card_"+i+"_"+j,iRank,i));
          }
      }
      for (var i=0;i<4;i++){
           for (var j=0;j<9;j++){
               iTmpSum = j+1;
              _aCards.push(new CCard(0,0,_oContainer,"card_"+i+"_"+iTmpSum,iTmpSum,i));
           }
      }
      for (var i=0;i<4;i++){
          for (var j=0;j<2;j++){
              _aCards.push(new CCard(0,0,_oContainer,"card_"+i+"_10",10,i));
              _aCards.push(new CCard(0,0,_oContainer,"card_"+i+"_11",11,i));
              _aCards.push(new CCard(0,0,_oContainer,"card_"+i+"_12",12,i));
          }
      }
      for (var i=0;i<4;i++){
          _aCards.push(new CCard(0,0,_oContainer,"color",13,4));
          _aCards.push(new CCard(0,0,_oContainer,"draw_four",14,4));
      }
    };
    
    this.shuffle = function(){
        var j, x, i;
        for (i = _aCards.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = _aCards[i - 1];
            _aCards[i - 1] = _aCards[j];
            _aCards[j] = x;
        }
    };  
    
    this.moveContainer = function (iX,iY,iTime,iDelay){
        createjs.Tween.get(_oContainer).wait(iDelay).to({x:iX, y:iY}, iTime, createjs.Ease.linear);
    };
    
    this.takeFirstLastCard = function(){
        while (_aCards[_aCards.length-1].getSuit()===4){
            this.shuffle();
        }
       return _aCards.pop();
   };
  
  this.takeLastCard = function(){
      var oLastCard = _aCards.pop();
      return oLastCard;
  };
  
  this.getLastCard = function(){
      var oLastCard = _aCards[_aCards.length-1]; 
      return oLastCard;
  };
  
  this.getCardByIndex = function(index){
      var oSingleCard = _aCards[index];
      return oSingleCard;
  };
  
  this.removeCardByIndex = function(index){
      var aTmp = _aCards.splice(index,1);
      return aTmp;
  };
  
    this.pushCard = function(oCard){
        _aCards.push(oCard);
    };
    
    this.getContainer = function(){
     return _oContainer; 
  };
  
  this.getLength = function(){
      return _aCards.length;
  };
  
  this.onDraw = function(){
      if(_bDisableInput===false){
        s_oGame.onDraw(); 
      }
  };
  
  this.disableInputUsedCards = function(){ 
     _aCards[_aCards.length-1].offSetTurned();
  };
  
   this.disableInputDraw = function(){
     _bDisableInput = true;
  };
  
  this.enableInputDraw = function(){
     _bDisableInput = false; 
  };
  
  this.getIndexChild = function(){
     return s_oStage.getChildIndex(_oContainer); 
  };
  
this.setChildDepth = function(iIndex){
    s_oStage.addChildAt(_oContainer,iIndex); 
};
  
  this.getGlobalPosition = function(){
   return {x: _oContainer.x,y: _oContainer.y}; 

  };
  
    this.setOnTop = function(){
      _oParentContainer.addChildAt(_oContainer,_oParentContainer.numChildren);
  };
  
  this.addNewCardUnderTheDeck = function(aCards){
     for (var i=0; i<aCards.length; i++){
         _aCards.push(aCards[i]);
     } 
  };
  
  this.removeAllCardUnderTheDeck = function(){
     var aCards = new Array();
     for (var i=0;i<_aCards.length-1; i++){
         aCards.push(_aCards.shift());
     }
     return aCards;
  };
  
  
  
  
  this._init();
  
};
  