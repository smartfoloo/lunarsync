function CCell(iX, iY, iType, iRow, iCol, iBgColor, oParentContainer){
    
    var _bLegalMove;
    
    var _iType;
    var _iRow;
    var _iCol;
    var _iBgColor;
    
    var _aMovesList = new Array();
    
    var _oPawnContainer;
    var _oPawn;
    var _oClickArea;
    var _oHighlight;
    var _oMoveFlag;
    
    this._init = function(iX, iY, iType, iRow, iCol, iBgColor, oParentContainer){
        
        _bLegalMove = false;
        
        _iType = iType;
        _iRow = iRow;
        _iCol = iCol;
        _iBgColor = iBgColor;
        
        _oPawnContainer = new createjs.Container();
        _oPawnContainer.x = iX;
        _oPawnContainer.y = iY;
        oParentContainer.addChild(_oPawnContainer);
        
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
        _oPawnContainer.addChild(_oPawn);
       
        _oMoveFlag = createSprite(oSpriteSheet,iType,PAWN_SIZE/2,PAWN_SIZE/2,PAWN_SIZE,PAWN_SIZE);        
        _oMoveFlag.alpha = 0.4;
        _oMoveFlag.visible = false;
        _oPawnContainer.addChild(_oMoveFlag);
       
        var oSprite = s_oSpriteLibrary.getSprite('highlight');
        _oHighlight = createBitmap(oSprite);
        _oHighlight.regX = oSprite.width/2;
        _oHighlight.regY = oSprite.height/2;
        _oHighlight.alpha = 0.8;
        _oHighlight.visible = false;
        _oPawnContainer.addChild(_oHighlight);
        
        
        _oClickArea = new createjs.Shape();
        _oClickArea.graphics.beginFill("rgba(158,0,0,0.01)").drawRect(-CELL_LENGTH/2, -CELL_LENGTH/2, CELL_LENGTH, CELL_LENGTH);
        _oClickArea.on("mousedown", this._onCellClick);
        _oClickArea.visible = false;
        _oPawnContainer.addChild(_oClickArea);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oPawnContainer);
        _oClickArea.off("mousedown", this._onCellClick);
    };  
    
    this.setClickableArea = function(bVal){  
        _oClickArea.visible = bVal;       
    }; 
    
    
    
    this.showMoves = function(bVal, iType){
        if(s_iGameType === MODE_HUMAN && iType === KING_BLACK){
            _oPawnContainer.rotation = 180;
        }
        _oMoveFlag.gotoAndStop(iType);
        _oMoveFlag.visible = bVal;

    };
    
    this.highlight = function(bVal, bNumFlips){
        if(s_iGameType === MODE_HUMAN && iType === KING_BLACK){
            _oPawnContainer.rotation = 180;
        }
        _oHighlight.visible = bVal;
        /*
        if(bNumFlips){
            _oHighlight.visible = bVal;
        } else {
            _oHighlight.visible = false;
        }
        */
    };
    
    this.setColor = function(iColor){
        if(s_iGameType === MODE_HUMAN && iColor === KING_BLACK){
            _oPawnContainer.rotation = 180;
        }

        _oPawn.gotoAndStop(iColor);
        _iType = iColor;

        
    };
    
    this.reversi = function(){
        if(_iType === PAWN_WHITE){
            _iType = PAWN_BLACK;
            createjs.Tween.get(_oPawnContainer).to({scaleX:0.1}, 200).call(function(){_oPawn.gotoAndStop(PAWN_BLACK);}).to({scaleX:1}, 200)
                    .call(function(){s_oGame.onFlipsEnd();});
        } else {
            _iType = PAWN_WHITE;
            createjs.Tween.get(_oPawnContainer).to({scaleX:0.1}, 200).call(function(){_oPawn.gotoAndStop(PAWN_WHITE);}).to({scaleX:1}, 200)
                    .call(function(){s_oGame.onFlipsEnd();});
        }
        
    };
    
    this._onCellClick = function(){
        s_oGame.cellClicked(_iRow, _iCol);
    };
    
    this.setType = function(iType){
        _iType = iType;
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this.getBgColor = function(){
        return _iBgColor;
    };
    
    this.setLegalMove = function(bVal){
        _bLegalMove = bVal;
    };
    
    this.isLegalMove = function(){
        return _bLegalMove;
    };
    
    this.setVisible = function(bVal){
        _oPawnContainer.visible = bVal;
    };
    
    this.getX = function(){
        return iX;  
    };
    
    this.getY = function(){
        return iY;  
    };
    
    this.getGlobalX = function(){
        return _oPawnContainer.localToGlobal(0,0).x;
    };
    
    this.getGlobalY = function(){
        return _oPawnContainer.localToGlobal(0,0).y;
    };

    this.setMovesChain = function(aList){
        _aMovesList = new Array();
        for(var i=0; i<aList.length; i++){
            _aMovesList[i] = new Array();
            for(var j=0; j<aList[i].length; j++){
                _aMovesList[i][j] = aList[i][j];
            }
            
        }
    };
    
    this.getMovesChain = function(){
        return _aMovesList;
    };
    
    this._init(iX, iY, iType, iRow, iCol, iBgColor, oParentContainer);
}