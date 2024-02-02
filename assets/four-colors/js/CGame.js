function CGame(oData){
    var _bInitGame;
    
    var _iScore;
    var _iCounterDraw = 0;
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    
    var _oDeck;
    var _aPlayersHand= new Array();
    var _oUsedCards;
    var _oTurnManager;
    var _bActive;
    var _iCurrentColor;
    var _bTurnPlayer;
    var _bUNO = false;
    var _CAnimation;
    var _iNextPlayer;
    var _oFinger;
    var _bCheckDraw;
    var _oFade;
    var _bDrawPointer;
    var _oDecksContainer;
    var _oHandsContainer;
    var _oCardsContainer;
    var _bEntered;
    var _aTextPlayers;
    var _iPointDivisor;
    var _oAlertText;
    
    this._init = function(){
        _bInitGame=true;
        _bTurnPlayer = true;
        _iScore=100000;
        _iPointDivisor = -(STARTING_NUM_CARDS-1);
        _bEntered = false;
        _bDrawPointer = false;
        _bCheckDraw = false;
        _oTurnManager = new CTurnManager(); 
        _bActive = true;
        _aTextPlayers = new Array();
        _aTextPlayers[0] = TEXT_PLAYER_1;
        _aTextPlayers[1] = TEXT_PLAYER_2;
        _aTextPlayers[2] = TEXT_PLAYER_3;
        _aTextPlayers[3] = TEXT_PLAYER_4;
        
        _CAnimation = new CAnimation();
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); 

        _oInterface = new CInterface();
        
        if (s_bFirstGame===true){
            new CPanelTutorial();
        }else{
            this.startGame();
        }
        
        setVolume("soundtrack",0.4);
      };
      
      this.startGame = function(){
          _oCardsContainer = new createjs.Container();
          var oSprite = s_oSpriteLibrary.getSprite("finger");
          
          var oData = {
              images: [oSprite],
              frames: {width: 202, height: 277, regX: 202/2, regY: 277/2},
              animations: {idle: {frames: [0,1,2,3,4,5,6,7,8,9], speed: 0.9}}
          };
          
          var oSpriteSheet = new createjs.SpriteSheet(oData);
          
          _oFinger = new createjs.Sprite(oSpriteSheet,"idle");
          _oFinger.scaleX = 0.5;
          _oFinger.scaleY = 0.5;
          _oFinger.x = CANVAS_WIDTH/2-90;
          _oFinger.y = CANVAS_HEIGHT/2-100;
          
          _oHandsContainer = new createjs.Container();
          
          for (var i=0;i<NUM_PLAYERS;i++){
            var iOffsetX =0;
            var iOffsetY =0;
            if (aHandPos["num_player_"+NUM_PLAYERS][i].x===CANVAS_WIDTH/2){
                iOffsetX = CARD_WIDTH/2;
            }else{
                iOffsetY = CARD_HEIGHT/4;
            }
            _aPlayersHand[i] = new CHandDisplayer(iOffsetX,iOffsetY,aHandPos["num_player_"+NUM_PLAYERS][i].x,aHandPos["num_player_"+NUM_PLAYERS][i].y,i,_oHandsContainer,_aTextPlayers[i]);
        }
            _oDecksContainer = new createjs.Container();
            _oDeck = new CDeckDisplayer(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,_oDecksContainer);
            _oUsedCards = new CDeckDisplayer((CANVAS_WIDTH/2)+CARD_WIDTH,CANVAS_HEIGHT/2,_oDecksContainer);
            _oUsedCards.disableInputDraw();
            _oDeck.initializeDeck();
            _oDeck.shuffle();
            _oDeck.getContainer().on("mouseover",this.onMouseOverDeck);
            
          _oCardsContainer.addChild(_oDecksContainer);
          _oCardsContainer.addChild(_oHandsContainer);
          s_oStage.addChild(_oCardsContainer);
            
            this.getFirstHand();
            
            _oAlertText = new createjs.Text(TEXT_ALERT_1,"22px "+PRIMARY_FONT,"#FFFFFF");
            _oAlertText.x = CANVAS_WIDTH/2+290;
            _oAlertText.y = CANVAS_HEIGHT/2+20;
            _oAlertText.textAlign = "left";
            _oAlertText.lineWidth = 250;
            _oAlertText.alpha = 0;
            s_oStage.addChild(_oAlertText);
      };
      
      this.getFirstHand = function(){
        var _oCard = _oDeck.takeLastCard();
        var iThisTurn = _oTurnManager.checkTurn();
        var oHandGlobalPos = _aPlayersHand[iThisTurn].getContainerPos();
        var oCardPos = _aPlayersHand[iThisTurn].getPosNewCard();
        var oDeckGlobalPos = _oDeck.getGlobalPosition();
        _oCard.setOnTop();
        _oCardsContainer.addChildAt(_oDecksContainer,_oCardsContainer.numChildren);
        _oDeck.setOnTop();
        _oCard.moveCardFirstHand((oHandGlobalPos.x+oCardPos.x)-(oDeckGlobalPos.x),(oHandGlobalPos.y+oCardPos.y)-(oDeckGlobalPos.y), 250); 
      };
            
     this.onCardDealed = function(oCard){
         var iThisTurn = _oTurnManager.checkTurn();
         var oNewCard;
         _aPlayersHand[iThisTurn].pushCard(new CCard(_aPlayersHand[iThisTurn].getPosNewCard().x,_aPlayersHand[iThisTurn].getPosNewCard().y,_aPlayersHand[iThisTurn].getContainer(),oCard.getFotogram(),oCard.getRank(),oCard.getSuit())); 
         oCard.unload(); 
         oNewCard = _aPlayersHand[iThisTurn].getLastCard();
         _aPlayersHand[iThisTurn].centerContainer();
        if (iThisTurn===0){
            oNewCard.showCardNoInput(0,"mute");
        }
         _oTurnManager.nextTurn();
         if (_aPlayersHand[_aPlayersHand.length-1].getLength()<STARTING_NUM_CARDS){
             this.getFirstHand();
         }else{
             _oCardsContainer.addChildAt(_oDecksContainer,_oCardsContainer);
             _oDeck.setOnTop();
             oCard = _oDeck.takeFirstLastCard();
             oCard.moveFirstLastCard(CARD_WIDTH,0,600);
             _oInterface.setOnTop();
         }
     };
     
     this.onFirstLastCardDealed = function (oCard){
        var oNewCard;
        var iThisTurn;
        _oUsedCards.pushCard(new CCard(0,0,_oUsedCards.getContainer(),oCard.getFotogram(),oCard.getRank(),oCard.getSuit()));
        oCard.unload();
        oNewCard = _oUsedCards.getLastCard();
        oNewCard.showCardNoInput();
        _oDeck.moveContainer(CANVAS_WIDTH/2-(CARD_WIDTH/2),CANVAS_HEIGHT/2,400);
        _oUsedCards.moveContainer(CANVAS_WIDTH/2+CARD_WIDTH/2,CANVAS_HEIGHT/2,400);
        _iCurrentColor = _oUsedCards.getLastCard().getSuit();
        _oInterface.refreshColor(_iCurrentColor);
       _oTurnManager.setTurn(Math.floor(Math.random() * NUM_PLAYERS) + 0 );
        iThisTurn = _oTurnManager.checkTurn();
        _aPlayersHand[iThisTurn].setOnTurn(iThisTurn);
        _oUsedCards.disableInputUsedCards();
        this.applyEffectOnCard(oNewCard,true);
        
     };
            
    this.pickCard = function(oParent,Event){
        _iPointDivisor++;
        var oLastCard = _oUsedCards.getLastCard();
        var iThisTurn = _oTurnManager.checkTurn();
        var oHandGlobalPos =_aPlayersHand[iThisTurn].getContainerPos();
        var oUsedCardsGlobalPos = _oUsedCards.getGlobalPosition();
        var oCardSound;
        _oCardsContainer.addChildAt(_oHandsContainer,_oCardsContainer.numChildren);
        _aPlayersHand[iThisTurn].setOnTop();
        if (iThisTurn===0){
            if(oParent.getRank()===oLastCard.getRank()&&oParent.getFotogram()!=="draw_four"||oParent.getSuit()===_iCurrentColor||oParent.getFotogram()==="color"){
                   this.offInputPlayer();
                   oParent.moveCard((oUsedCardsGlobalPos.x-oHandGlobalPos.x),oUsedCardsGlobalPos.y-oHandGlobalPos.y,300);
                   oCardSound =  playSound("card",1,false);
                   if (_aPlayersHand[0].getLength()===2){
                        _bUNO = true;
                    }
            }else if (oParent.getRank()===14&&this.checkAvaiableDrawFour()===true){
                this.offInputPlayer();
                oParent.moveCard((oUsedCardsGlobalPos.x-oHandGlobalPos.x),oUsedCardsGlobalPos.y-oHandGlobalPos.y,300);
                oCardSound =  playSound("card",1,false);
                if (_aPlayersHand[0].getLength()===2){
                    _bUNO = true;
                }
            }
       }
      };
        
        this.cpuPickCard = function(oParent){
        var iThisTurn = _oTurnManager.checkTurn();
        var oHandGlobalPos =_aPlayersHand[iThisTurn].getContainerPos();
        var oUsedCardsGlobalPos = _oUsedCards.getGlobalPosition();
        _oCardsContainer.addChildAt(_oHandsContainer,_oCardsContainer.numChildren);
        _aPlayersHand[iThisTurn].setOnTop();
        oParent.moveCard((oUsedCardsGlobalPos.x-oHandGlobalPos.x),oUsedCardsGlobalPos.y-oHandGlobalPos.y,400,1000);
        _oDeck.setChildDepth(2);
        _oUsedCards.setChildDepth(2);
        oParent.showCard(1000);
        };
        
     this.playedCard = function(oParent){
         var iThisTurn = _oTurnManager.checkTurn();
         var iParent = _aPlayersHand[iThisTurn].searchIndexCard(oParent);
         _oUsedCards.pushCard(new CCard(0,0,_oUsedCards.getContainer(),oParent.getFotogram(),oParent.getRank(),oParent.getSuit()));
         _oUsedCards.disableInputUsedCards();
         _oUsedCards.getLastCard().instantShow();
         _aPlayersHand[iThisTurn].removeCardByIndex(iParent);
         oParent.unload();
         if (iThisTurn!==0){
            _aPlayersHand[iThisTurn].checkUno();
        }
         if(_oUsedCards.getLastCard().getSuit()!==4){
             _iCurrentColor = _oUsedCards.getLastCard().getSuit();
             _oInterface.refreshColor(_iCurrentColor);
         }
         _aPlayersHand[iThisTurn].organizeHand(iParent);
         this.applyEffectOnCard(oParent);
     };

     this.applyEffectOnCard = function(oCard,bFirstCard){
         var oParent = this;
         var bPenality = true;
         var iPlayer;
        if (!bFirstCard){
             bFirstCard = false;
         }
         
         
         if (bFirstCard===true){
             _iNextPlayer = _oTurnManager.checkTurn();
             _oTurnManager.prevTurn();
             iPlayer = _oTurnManager.checkTurn();
         }else{
             iPlayer = _oTurnManager.checkTurn();
             _iNextPlayer = _oTurnManager.checkNextPlayer();
         }
         
        if (oCard.getFotogram()==="color"){
            if(iPlayer===0){
                if (_bUNO===true){
                    new CSelectColorPanel(oCard.getFotogram(),bPenality);
                    _oTurnManager.nextTurn();
                }else{
                    new CSelectColorPanel(oCard.getFotogram());
                    _oTurnManager.nextTurn();
                }
            }else{
                _iCurrentColor = this.onSelectColorCpu(iPlayer);
                _oTurnManager.nextTurn();
                _CAnimation.changeColor(_iCurrentColor);
            }
        }else if(oCard.getFotogram()==="draw_four"){
                if(iPlayer===0){
                    if (_bUNO===true){
                    new CSelectColorPanel(oCard.getFotogram(),bPenality);
                }else{
                    new CSelectColorPanel(oCard.getFotogram());
                }
                }else{
                    _iCurrentColor = this.onSelectColorCpu(iPlayer);
                    _oInterface.refreshColor(_iCurrentColor);
                    _CAnimation.drawFourAnim();
            }
        }else if ((oCard.getFotogram()!=="color"&&oCard.getFotogram()!=="draw_four")&&oCard.getSuit()===_iCurrentColor||oCard.getRank()===_oUsedCards.getLastCard().getRank()){
                if (oCard.getRank()===10){
                    _oTurnManager.nextTurn();
                    _oTurnManager.nextTurn();
                    if (_bUNO===true){
                        setTimeout(function(){if (_bUNO===true){oParent.drawCards(0,2,0,bPenality);};setTimeout(function(){_CAnimation.stopTurn();},800);},2000);
                    }else{
                        _CAnimation.stopTurn();
                    }
                    
                }else if(oCard.getRank()===11){ 
                    if (NUM_PLAYERS>2){
                        _oTurnManager.changeClockWise();
                        if (bFirstCard!==true){
                                _oTurnManager.nextTurn();
                            }else{
                                _oTurnManager.prevTurn();
                            }
                    }else{
                        _oTurnManager.changeClockWise();
                        _oTurnManager.nextTurn();
                        _oTurnManager.nextTurn();
                    }
                if (_bUNO===true){
                    setTimeout(function(){if (_bUNO===true){oParent.drawCards(0,2,0,bPenality)};setTimeout(function(){_CAnimation.changeClockWise(_oTurnManager.getClockWise());},1000);},2000);
                }else{    
                    _CAnimation.changeClockWise(_oTurnManager.getClockWise());
                    }
                }else if(oCard.getRank()===12){
                    if (_bUNO===true){
                        setTimeout(function(){if (_bUNO===true){oParent.drawCards(0,2,0,bPenality);};setTimeout(function(){_CAnimation.drawTwoAnim();},1000);},2000);
                    }else{
                        _CAnimation.drawTwoAnim();
                    }
                }else if(oCard.getRank()<10){
                    _oTurnManager.nextTurn();
                    if (_bUNO===true){
                         setTimeout(function(){if (_bUNO===true){oParent.drawCards(0,2,0,bPenality); }else{oParent.onNextTurn();}},2000);
                    }else{
                    this.onNextTurn();                       
                    }
                }
            }
     };
        
        this.onNextTurn = function(){
            if (this.checkGameOver()===true){
                
            }else if(_oDeck.getLength()===0&&_bEntered===false){
                _bEntered = true;
                _CAnimation.shuffleAnimation();
            }else{
                    this.setOffTurn();
                    _oDeck.enableInputDraw();
                   var iThisTurn = _oTurnManager.checkTurn();

                   _aPlayersHand[iThisTurn].setOnTurn(iThisTurn);
                   var aBestCards;
                   var oLastCard = _oUsedCards.getLastCard();
                   var oParent = this;
                   if (iThisTurn===0){
                       this.onInputPlayer();
                       if (this.onCheckDraw()===true){
                           this.checkHelpDraw();
                       }
                   }else if (iThisTurn!==0){
                            aBestCards = new Array();
                            for (var i=0;i<_aPlayersHand[iThisTurn].getLength();i++){
                                if(_aPlayersHand[iThisTurn].getCardByIndex(i).getSuit()!==4&&(_aPlayersHand[iThisTurn].getCardByIndex(i).getRank()===oLastCard.getRank()||_aPlayersHand[iThisTurn].getCardByIndex(i).getSuit()===_iCurrentColor)){
                                    if(_aPlayersHand[iThisTurn].getCardByIndex(i).getRank()===12){
                                        aBestCards.push({oCard: _aPlayersHand[iThisTurn].getCardByIndex(i), iValue: 6});
                                    }else if (_aPlayersHand[iThisTurn].getCardByIndex(i).getRank()===10){
                                        aBestCards.push({oCard: _aPlayersHand[iThisTurn].getCardByIndex(i), iValue: 5});
                                    }else if (_aPlayersHand[iThisTurn].getCardByIndex(i).getRank()===11){
                                        aBestCards.push({oCard: _aPlayersHand[iThisTurn].getCardByIndex(i), iValue: 4});
                                    }else{
                                        aBestCards.push({oCard: _aPlayersHand[iThisTurn].getCardByIndex(i), iValue: 3});
                                    }
                                }else if(_aPlayersHand[iThisTurn].getCardByIndex(i).getFotogram()==="color"){
                                    aBestCards.push({oCard: _aPlayersHand[iThisTurn].getCardByIndex(i), iValue: 2});
                                }else if(_aPlayersHand[iThisTurn].getCardByIndex(i).getFotogram()==="draw_four"){
                                    aBestCards.push({oCard: _aPlayersHand[iThisTurn].getCardByIndex(i), iValue: 1});
                                }
                            }
                            if (aBestCards.length===0){
                                this.drawCards(iThisTurn,1,1000);
                            }else{
                                aBestCards.sort(function(a,b){
                                return parseFloat(b.iValue) - parseFloat(a.iValue);});

                                oParent.cpuPickCard(aBestCards[0].oCard);
                            }
                   }
            }
        };
        
        this.checkAvaiableDrawFour = function(){
            var bCheck = true;
            var oTmpCard;
            for (var i=0;i<_aPlayersHand[0].getLength();i++){
                oTmpCard = _aPlayersHand[0].getCardByIndex(i);
                if(oTmpCard.getRank()===_oUsedCards.getLastCard().getRank()&&oTmpCard.getFotogram()!=="draw_four"||oTmpCard.getSuit()===_iCurrentColor||oTmpCard.getFotogram()==="color"){
                    bCheck = false;
                }
            }
            return bCheck;
        };
        
        this.declareUNO = function (){
            if (_bUNO === true){
                _bUNO = false;
                _aPlayersHand[0].checkUno();
            }
        };
        
        this.drawCards = function (iIndexPlayer,iNumberOfCards,iDelay,bPenality){
            if (bPenality){
                _bUNO = false;
                new createjs.Tween.get(_oAlertText).to({alpha: 1},400).wait(4000).to({alpha: 0},400);
            }
            _iCounterDraw = iNumberOfCards;
            this.drawCardsTween(iIndexPlayer,iNumberOfCards,iDelay,bPenality);
        }; 
            
        this.drawCardsTween = function(iIndexPlayer,iNumberOfCards,iDelay,bPenality){
            var oParent = this;
            var oLastCard;
            var oNewCard;
            var oCard;
            var oHandGlobalPos;
            var oCardPos;
            var oDeckGlobalPos;
            var oCardSound;
            _oCardsContainer.addChildAt(_oDecksContainer,_oCardsContainer.numChildren);
            _oDeck.setOnTop();
            
                if (_oDeck.getLength()===0&&_bEntered===false){
                    _bEntered = true;
                    _CAnimation.shuffleAnimation(iIndexPlayer,iNumberOfCards,iDelay);
                }else
                     
                if (iNumberOfCards===1){
                oLastCard = _oUsedCards.getLastCard();
                oNewCard;
                oCard = _oDeck.takeLastCard();
                oCard.setOnTop();
                oHandGlobalPos = _aPlayersHand[iIndexPlayer].getContainerPos();
                oCardPos = _aPlayersHand[iIndexPlayer].getPosNewCard();
                oDeckGlobalPos = _oDeck.getGlobalPosition();
                     
                     new createjs.Tween.get(oCard.getSprite())
                             .wait(iDelay)
                             .to({x: (oHandGlobalPos.x+oCardPos.x)-(oDeckGlobalPos.x), y: (oHandGlobalPos.y+oCardPos.y)-(oDeckGlobalPos.y)}
                             ,400
                             ,createjs.Ease.cubicOut)
                             .call(function(){
                             _aPlayersHand[iIndexPlayer].pushCard(new CCard(_aPlayersHand[iIndexPlayer].getPosNewCard().x,_aPlayersHand[iIndexPlayer].getPosNewCard().y,_aPlayersHand[iIndexPlayer].getContainer(),oCard.getFotogram(),oCard.getRank(),oCard.getSuit()));
                             oCard.unload();
                             oNewCard = _aPlayersHand[iIndexPlayer].getLastCard();
                             if (iIndexPlayer===0){
                                 oNewCard.showCard();
                                 oNewCard.onSetTurned();
                             }else{
                                 oCardSound =  playSound("card",1,false);
                             }
                              _aPlayersHand[iIndexPlayer].centerContainer();
                              if (oNewCard.getRank()===oLastCard.getRank()||oNewCard.getSuit()===_iCurrentColor||oNewCard.getFotogram()==="color"||oNewCard.getFotogram()==="draw_four"){
                                  if (iIndexPlayer!==0){
                                      oParent.onNextTurn();
                                      oCardSound =  playSound("card",1,false);
                                  }
                              }else{
                                  _aPlayersHand[iIndexPlayer].centerContainer();
                                  _oTurnManager.nextTurn();
                                  oParent.onNextTurn();
                              }
            } ); 
        }else{
                oLastCard = _oUsedCards.getLastCard();
                oNewCard;
                oCard = _oDeck.takeLastCard();
                oCard.setOnTop();
                oHandGlobalPos = _aPlayersHand[iIndexPlayer].getContainerPos();
                oCardPos = _aPlayersHand[iIndexPlayer].getPosNewCard();
                oDeckGlobalPos = _oDeck.getGlobalPosition();
                     
                     new createjs.Tween.get(oCard.getSprite())
                             .wait(iDelay)
                             .to({x: (oHandGlobalPos.x+oCardPos.x)-(oDeckGlobalPos.x), y: (oHandGlobalPos.y+oCardPos.y)-(oDeckGlobalPos.y)}
                             ,400
                             ,createjs.Ease.cubicOut)
                             .call(function(){
                             _aPlayersHand[iIndexPlayer].pushCard(new CCard(_aPlayersHand[iIndexPlayer].getPosNewCard().x,_aPlayersHand[iIndexPlayer].getPosNewCard().y,_aPlayersHand[iIndexPlayer].getContainer(),oCard.getFotogram(),oCard.getRank(),oCard.getSuit()));
                             oCard.unload();
                             oNewCard = _aPlayersHand[iIndexPlayer].getLastCard();
                             if (iIndexPlayer===0){
                                 oNewCard.showCard();
                                 oNewCard.onSetTurned();
                             }else{
                                 oCardSound =  playSound("card",1,false);
                             }
                              _aPlayersHand[iIndexPlayer].centerContainer();
                              _iCounterDraw--;
                              if (_iCounterDraw>0){
                                  oParent.drawCardsTween(iIndexPlayer,iNumberOfCards,iDelay,bPenality);
                              }else{
                                  if (!bPenality){
                                  _oTurnManager.nextTurn();
                                  _oTurnManager.nextTurn();
                                  }
                                  oParent.onNextTurn();
                              }
                                  
            });
        }
    };
        
        this.onDraw = function(){
            _oDeck.disableInputDraw();
            _bCheckDraw = false;
            s_oStage.removeChild(_oFinger);
            var bCheck = true;
            var oTmpCard;
            if (_oUsedCards.getLength()!==0&&_oTurnManager.checkTurn()===0){
                for (var i=0;i<_aPlayersHand[0].getLength();i++){
                    oTmpCard = _aPlayersHand[0].getCardByIndex(i);
                    if(oTmpCard.getRank()===_oUsedCards.getLastCard().getRank()||oTmpCard.getSuit()===_iCurrentColor||oTmpCard.getFotogram()==="color"||oTmpCard.getFotogram()==="draw_four"){
                        bCheck = false;
                    }
                }
                if(bCheck===true){
                    this.drawCards(0,1);
                    _bDrawPointer = false;
                }
            }
        };
        
        this.onCheckDraw = function(){
            var bCheck = true;
            _bCheckDraw = true;
            var oTmpCard;
            if (_oUsedCards.getLength()!==0&&_oTurnManager.checkTurn()===0){
                for (var i=0;i<_aPlayersHand[0].getLength();i++){
                    oTmpCard = _aPlayersHand[0].getCardByIndex(i);
                    if(oTmpCard.getRank()===_oUsedCards.getLastCard().getRank()||oTmpCard.getSuit()===_iCurrentColor||oTmpCard.getFotogram()==="color"||oTmpCard.getFotogram()==="draw_four"){
                        bCheck = false;
                        _bCheckDraw = false;
                    }
                }
                
                if (_bCheckDraw===true&&_oTurnManager.checkTurn()===0){
                    _bDrawPointer = true;
                }else{
                    _bDrawPointer = false;
                }
                
                return bCheck;
        }};
        
        this.onSelectColor = function(iColor){
            _iCurrentColor = iColor;
            _oInterface.refreshColor(_iCurrentColor);
        };
        
       this.onInputPlayer = function(){
              for (var i=0;i<_aPlayersHand[0].getLength();i++){
                  _aPlayersHand[0].getCardByIndex(i).onSetTurned();
              }
       };
       
       this.offInputPlayer = function(){
              for (var i=0;i<_aPlayersHand[0].getLength();i++){
                  _aPlayersHand[0].getCardByIndex(i).offSetTurned();
              }
       };
       
       this.onSelectColorCpu = function(iPlayer){
           var oTmpCard;
           var aColor = new Array();
           aColor[0] = {iColor: 0, iPoints: 0};
           aColor[1] = {iColor: 1, iPoints: 0};
           aColor[2] = {iColor: 2, iPoints: 0};
           aColor[3] = {iColor: 3, iPoints: 0};
           
           for (var i=0;i<_aPlayersHand[iPlayer].getLength();i++){
               oTmpCard = _aPlayersHand[iPlayer].getCardByIndex(i);
               for (var j=0;j<aColor.length;j++){
                   if (oTmpCard.getSuit()===j){
                       aColor[j].iPoints++;
                   }
               }
          }
          aColor.sort(function(a,b){return parseFloat(b.iPoints) - parseFloat(a.iPoints);});
          return aColor[0].iColor;
       };
       
       this.onEndDrawFour = function(){
           this.drawCards(_iNextPlayer,4,0);
       };
       
       this.onEndDrawTwo = function(){
           this.drawCards(_iNextPlayer,2,0);
       };
        
        this.getbUNO = function(){
           return _bUNO; 
        };
        
        this.checkGameOver = function(){
            var bEnded = false;
           if (_aPlayersHand[0].getLength()===0){
               this.gameOver(0);
               bEnded = true;
           }
           if (_aPlayersHand[1].getLength()===0){
               this.gameOver(1);
               bEnded = true;
           }
           if (_aPlayersHand[2]&&_aPlayersHand[2].getLength()===0){
               this.gameOver(2);
               bEnded = true;
           }
           if (_aPlayersHand[3]&&_aPlayersHand[3].getLength()===0){
               this.gameOver(3);
               bEnded = true;
           }
           return bEnded;
           
        };
        
        this.setOffTurn = function(){
           for (var i=0;i<NUM_PLAYERS;i++){
               _aPlayersHand[i].setOffTurn(i);
           } 
        };
        
        this.checkNumOfCards = function(){
            var aNewCards = new Array();
            var aTmp = new Array();
            if (_oDeck.getLength()===0){
                aNewCards = _oUsedCards.removeAllCardUnderTheDeck();
                
                this.shuffle(aNewCards);
                
                for (var i=0;i<aNewCards.length;i++){
                    _oDeck.pushCard(new CCard(0,0,_oDeck.getContainer(),aNewCards[i].getFotogram(),aNewCards[i].getRank(),aNewCards[i].getSuit()));
                    aNewCards[i].unload();
                }
                _bEntered = false;
            }
        };
        
      this.onEndShuffle = function(iIndexPlayer,iNumberOfCards,iDelay){
          this.checkNumOfCards();
            if (_iCounterDraw!==0){
              this.drawCardsTween(iIndexPlayer,iNumberOfCards,iDelay);
            }else{
                this.onNextTurn();
            }
      };  
        
    this.shuffle = function(aCards){
        var j, x, i;
        for (i = aCards.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = aCards[i - 1];
            aCards[i - 1] = aCards[j];
            aCards[j] = x;
        }
    };      
             
    
    this.unload = function(){
        _bInitGame = false;
        
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        _oInterface.unload();
        
        _bCheckDraw = false;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };
 
    this.onExit = function(){
        $(s_oMain).trigger("end_session");
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
  this.stopFinger =  function (){
     if (_bCheckDraw===true){
         _bCheckDraw = false;
     } 
  }; 

    
    this.gameOver = function(iWinner){
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        if (iWinner===0){
            _iScore = Math.floor(_iScore * (1/_iPointDivisor));
        }else{
            _iScore = 0;
        }
        
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('credits_panel'));
        _oEndPanel.show(_iScore,iWinner);
    };
    
    this.checkHelpDraw = function(){
        setTimeout(function(){ if (_bCheckDraw===true){s_oStage.addChildAt(_oFinger,s_oStage.numChildren);}},5000);
    };
    
    this.onMouseOverDeck = function(evt){
        if(!s_bMobile){
            if (_bDrawPointer===true){
                evt.target.cursor = "pointer";
            }else{
                evt.target.cursor = "default";
            }
        }   
    };

    
    this.update = function(){
      
    };

    s_oGame=this;
    
    STARTING_NUM_CARDS = oData.starting_num_cards;
    _oParent=this;
    this._init();
}



var s_oGame;
