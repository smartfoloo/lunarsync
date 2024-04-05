function CMovingCell(iX,iY, iType, oParentContainer){
    
    var _iX;
    var _iY;
    var _iType;
    var _iScale;
    
    
    var _oParentContainer;
    var _oPawn;
    var _oParent;
    
    this._init = function(iX,iY, iType, oParentContainer){
        
        _iX = iX;
        _iY = iY;
        _iType = iType;
        _iScale = 1;
        
        _oParentContainer = oParentContainer;
        
        var oSprite = s_oSpriteLibrary.getSprite('pawn');
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: PAWN_SIZE, height: PAWN_SIZE, regX:PAWN_SIZE/2,regY:PAWN_SIZE/2}, 
                        animations: {  white: [0], black:[1], white_checker:[2], black_checker:[3]}

        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);        
        _oPawn = createSprite(oSpriteSheet,iType,PAWN_SIZE/2,PAWN_SIZE/2,PAWN_SIZE,PAWN_SIZE);        
        _oPawn.stop();
        _oPawn.x = _iX;
        _oPawn.y = _iY;
        if(s_iGameType === MODE_HUMAN && iType === KING_BLACK){
            _oPawn.rotation = 180;
        }
        _oParentContainer.addChild(_oPawn);  
        
        
        
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oPawn);
    };
    
    this.move = function(iDestX, iDestY, iTime, iDestRow, iDestCol, aChainList){
        
        
        createjs.Tween.get(_oPawn).to({x:iDestX, y:iDestY}, iTime).call(function(){
            
            _oParent.unload();
            if(aChainList !== null){  
                
                for(var i=aChainList.length-1; i>=0; i--){
                    
                    if(aChainList[i][0].row !== iDestRow || aChainList[i][0].col !== iDestCol){

                        aChainList.splice(i,1);
                    }
                }
                
                for(var i=0; i<aChainList.length; i++){
                    aChainList[i].splice(0,1);
                }
                
            }
            s_oGame.onFinishMove(iDestRow, iDestCol, _iType, aChainList);
        
        });
        createjs.Tween.get(_oPawn).to({scaleX:_iScale + 0.2, scaleY:_iScale + 0.2}, iTime/2, createjs.Ease.cubicOut).
                to({scaleX:_iScale, scaleY:_iScale}, iTime/2, createjs.Ease.cubicIn);//.call(function(){_oPawn.gotoAndStop(PAWN_BLACK);})
    };

    _oParent = this;
    this._init(iX,iY, iType, oParentContainer);
};