function CAnimation (){
    
    var _oDrawFour;
    var _oDrawTwo;
    var _oStopTurn;
    var _oChangeClockWise;
    var _oChangeColor;
    var _iCurrentColor;
    var _bColor;
    var _oSpecialCardSound;
    var _oChangeColorSound;
    var _oShuffleAnim;
    var _oCardShufflingSound;
    
    this.init = function(){
        
        _bColor = false;
        
        var oSprite = s_oSpriteLibrary.getSprite("draw_four_anim");
        var oData = {
            images: [oSprite],
            frames: {width: 292, height: 290, regX: 292/2, regY: 290/2},
            animations: {
                anim:{ frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], next: "stop", speed: 0.8},
                reverse: {frames: [13,12,11,10,9,8,7,6,5,4,3,2,1,0], next: [0], speed: 0.8},
                stop: [13]
            }
            
        };
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         _oDrawFour = new createjs.Sprite(oSpriteSheet,0);
         
         oSprite = s_oSpriteLibrary.getSprite("draw_two_anim");
             oData = {
             images: [oSprite],
             frames: {width: 292, height: 322, regX: 292/2, regY: 322/2},
             animations: {
                 anim:{ frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13], next: "stop", speed: 0.8},
                 reverse: {frames: [13,12,11,10,9,8,7,6,5,4,3,2,1,0], next: [0], speed: 0.8},
                 stop: [13]
             }
         };
         oSpriteSheet = new createjs.SpriteSheet(oData);
         _oDrawTwo = new createjs.Sprite(oSpriteSheet,0);
         
         oSprite = s_oSpriteLibrary.getSprite("stop_turn_anim");
         _oStopTurn = new createBitmap(oSprite,292,300);
         
         oSprite = s_oSpriteLibrary.getSprite("clock_wise_anim");
         _oChangeClockWise = new createBitmap(oSprite,292,300);
         
         oSprite = s_oSpriteLibrary.getSprite("change_color");
            oData = {
               images: [oSprite],
               frames: {width: 328, height: 315, regX: 328/2, regY: 315/2},
               animations: {
                   anim:{ frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], next: "anim", speed: 0.8},
                   stop: [16],
                   color_0: { frames: [0,1,2,3,4,5,6], speed: 0.8},
                   color_1: { frames: [0,1,2], speed: 0.8},
                   color_2: { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], speed: 0.8},
                   color_3: { frames: [0,1,2,3,4,5,6,7,8,9,10], speed: 0.8}
               }
            };
            oSpriteSheet = new createjs.SpriteSheet(oData);
            _oChangeColor = new createjs.Sprite(oSpriteSheet,0);
            
         oSprite = s_oSpriteLibrary.getSprite("shuffle_anim");
            oData = {
               images: [oSprite],
               frames: {width: 403, height: 386, regX: 403/2, regY: 386/2},
               animations: {
                   anim: { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], next: "anim" },
                   idle : [17]
               }
           };
              oSpriteSheet = new createjs.SpriteSheet(oData);
              _oShuffleAnim = new createjs.Sprite(oSpriteSheet,"idle");
    };
        
    this.drawFourAnim = function (){
        _oDrawFour.alpha = 0;
        _oDrawFour.x = CANVAS_WIDTH/2;
         _oDrawFour.y = CANVAS_HEIGHT/2;
         _oDrawFour.scaleX = 0.01;
         _oDrawFour.scaleY = 0.01;
         s_oStage.addChild(_oDrawFour);
         _oDrawFour.stop();
         _oSpecialCardSound = playSound("special_card",0.5,false);
        new createjs.Tween.get(_oDrawFour).to({alpha: 1, scaleX: 1.4, scaleY: 1.4},200, createjs.Ease.cubicOut).wait(200).call(function(){_oDrawFour.gotoAndPlay("anim");}).wait(1000).call(function(){_oDrawFour.gotoAndPlay("reverse");}).wait(200).to({alpha: 0, scaleX: 0.01, scaleY: 0.01},200, createjs.Ease.cubicIn).call(function(){ s_oStage.removeChild(_oDrawFour); s_oGame.onEndDrawFour();});
    };
    
    this.drawTwoAnim = function (){
        _oDrawTwo.alpha = 0;
         _oDrawTwo.x = CANVAS_WIDTH/2;
         _oDrawTwo.y = CANVAS_HEIGHT/2;
         _oDrawTwo.scaleX = 0.01;
         _oDrawTwo.scaleY = 0.01;
         s_oStage.addChild(_oDrawTwo);
         _oDrawTwo.stop();
         _oSpecialCardSound = playSound("special_card",0.5,false);
         new createjs.Tween.get(_oDrawTwo).to({alpha: 1, scaleX: 1.4, scaleY: 1.4},200, createjs.Ease.cubicOut).wait(200).call(function(){_oDrawTwo.gotoAndPlay("anim"); setVolume("special_card",0.2);}).wait(1000).call(function(){_oDrawTwo.gotoAndPlay("reverse"); setVolume("special_card",0.1);}).wait(200).to({alpha: 0, scaleX: 0.01, scaleY: 0.01},200, createjs.Ease.cubicIn).call(function(){s_oStage.removeChild(_oDrawTwo); s_oGame.onEndDrawTwo();});
    };
    
    this.stopTurn = function (){
       _oStopTurn.alpha = 0;
       _oStopTurn.regX = 146;
       _oStopTurn.regY = 150;
       _oStopTurn.x = CANVAS_WIDTH/2;
       _oStopTurn.y = CANVAS_HEIGHT/2;
       _oStopTurn.scaleX = 0.01;
       _oStopTurn.scaleY = 0.01;
       s_oStage.addChild(_oStopTurn);
       playSound("game_over",1,false);
       new createjs.Tween.get(_oStopTurn).to({alpha: 1, scaleX: 2, scaleY: 2},200, createjs.Ease.cubicOut).to({scaleX: 1.6, scaleY: 1.6},200).to({scaleX: 2, scaleY: 2},200).to({scaleX: 1.6, scaleY: 1.6},200).to({scaleX: 2, scaleY: 2},200).to({alpha: 0, scaleX: 0.01, scaleY: 0.01},200, createjs.Ease.cubicIn).call(function(){s_oStage.removeChild(_oStopTurn); s_oGame.onNextTurn();});
    };
    
    this.changeClockWise = function(bClockWise){
       _oChangeClockWise.alpha = 0;
       _oChangeClockWise.rotation = 0;
       _oChangeClockWise.regX = 146;
       _oChangeClockWise.regY = 150;
       _oChangeClockWise.x = CANVAS_WIDTH/2;
       _oChangeClockWise.y = CANVAS_HEIGHT/2;
       _oChangeClockWise.scaleX = 0.01;
       _oChangeClockWise.scaleY = 0.01;
       s_oStage.addChild(_oChangeClockWise);
       _oSpecialCardSound = playSound("special_card",0.5,false);
       
       if (bClockWise===false){
           new createjs.Tween.get(_oChangeClockWise).to({alpha: 1, scaleX: 2, scaleY: 2},200, createjs.Ease.cubicOut).to({rotation: 360},500).wait(500).to({rotation: -360},500).wait(500).to({alpha: 0, scaleX: 0.01, scaleY: 0.01},200, createjs.Ease.cubicIn).call(function(){ s_oStage.removeChild(_oChangeClockWise); s_oGame.onNextTurn();});;
       }else{
          new createjs.Tween.get(_oChangeClockWise).to({alpha: 1, scaleX: 2, scaleY: 2},200, createjs.Ease.cubicOut).to({rotation: -360},500).wait(500).to({rotation: 360},500).wait(500).to({alpha: 0, scaleX: 0.01, scaleY: 0.01},200, createjs.Ease.cubicIn).call(function(){ s_oStage.removeChild(_oChangeClockWise); s_oGame.onNextTurn();});; 
       }
        
    };
    
    this.changeColor = function(iColor){
        _iCurrentColor = iColor;
        _oChangeColor.alpha = 0;
        _oChangeColor.x = CANVAS_WIDTH/2;
        _oChangeColor.y = CANVAS_HEIGHT/2;
        _oChangeColor.scaleX = 0.01;
        _oChangeColor.scaleY = 0.01;
        s_oStage.addChild(_oChangeColor);
        _oChangeColor.stop();
        _oChangeColorSound = playSound("change_color",0.5,false);
        
        new createjs.Tween.get(_oChangeColor).to({alpha: 1, scaleX: 1.4, scaleY: 1.4},200, createjs.Ease.cubicOut).call(function(){
            _oChangeColor.gotoAndPlay("anim");
        }).wait(1300).call(function(){
            _oChangeColor.gotoAndStop(16);
            _oChangeColor.gotoAndPlay("color_"+iColor);
            _bColor = true;
            _oChangeColor.on("animationend",s_oCAnimation.endAnimation);
        });
    };
    
    this.endAnimation = function(){
        if (_bColor === true){
            stopSound("change_color");
            _oSpecialCardSound = playSound("special_card",1,false);
            _bColor = false;
            _oChangeColor.off("animationend",s_oCAnimation.endAnimation);
           _oChangeColor.stop(); 
           new createjs.Tween.get(_oChangeColor).to({scaleX: 2, scaleY: 2},250).to({scaleX: 1.4, scaleY: 1.4},250).to({scaleX: 2, scaleY: 2},250).to({scaleX: 1.4, scaleY: 1.4},250).to({alpha: 0, scaleX: 0.1, scaleY: 0.1},200, createjs.Ease.cubicIn).call(function(){ s_oStage.removeChild(_oChangeColor); _oChangeColor.gotoAndStop(0); s_oInterface.refreshColor(_iCurrentColor); s_oGame.onNextTurn();});
        }
    };
    
    this.shuffleAnimation = function(iIndexPlayer,iNumberOfCards,iDelay,bPenality){
        _oShuffleAnim.alpha = 0;
        _oShuffleAnim.x = CANVAS_WIDTH/2;
         _oShuffleAnim.y = CANVAS_HEIGHT/2;
         _oShuffleAnim.scaleX = 0.01;
         _oShuffleAnim.scaleY = 0.01;
         s_oStage.addChild(_oShuffleAnim);
         _oShuffleAnim.stop();
        new createjs.Tween.get(_oShuffleAnim).to({alpha: 1, scaleX: 1.6, scaleY: 1.6},400, createjs.Ease.cubicOut).call(function(){
                _oShuffleAnim.gotoAndPlay("anim");
                _oCardShufflingSound = playSound("card_dealing", 1,true);
            }).wait(1700).call(function(){
                    _oShuffleAnim.gotoAndStop("idle");
                    stopSound("change_color");}).to({alpha: 0, scaleX: 0.01, scaleY: 0.01},300, createjs.Ease.cubicIn).call(function(){
                        s_oStage.removeChild(_oShuffleAnim); 
                        s_oGame.onEndShuffle(iIndexPlayer,iNumberOfCards,iDelay,bPenality);
                    });
    };
    
    this.init();
    s_oCAnimation = this;
}

s_oCAnimation = null;