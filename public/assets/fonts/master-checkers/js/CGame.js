function CGame(oData){
    var _bTouchActive;
    var _bStartGame;
    var _bValidMoves;
    var _bEat;
    var _bConstrainedMoves;
    var _bBlock = false;
    
    var _iCurPlayer;
    var _iTurnStallCount;
    var _iWhiteEaten;
    var _iBlackEaten;
    var _iBlackTime;
    var _iWhiteTime;
    var _iContJump;
    var _iNumBlack;
    var _iNumWhite;
    var _iDrawCounter = 0;

    var _aCellPos;
    var _aCell;
    var _aCellSupport;
    var _aWhitePos;
    var _aBlackPos;
    var _aCellConstrained;
    var _aMovesAvailable;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oGridContainer;
    var _oDrawContainer;
    var _oThinking = null;
    var _oBoard;
    var _oActiveCell = null;
    var _oEatenPawn;
    var _oMoveTree;
    var _oDecisionTree;
    var _oMessage = null;
    
    this._init = function(){

        _bTouchActive=false;
        _bStartGame=false;
        _bValidMoves = false;
        _bEat = false;
        _bConstrainedMoves = false;
          
        _iCurPlayer = PAWN_WHITE;
        _iTurnStallCount = 0;
        _iBlackEaten = 0;
        _iWhiteEaten = 0;
        _iBlackTime = 0;
        _iWhiteTime = 0;
        _iContJump = 0;
        
        _aCellConstrained = new Array();
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas

        _oDrawContainer = new createjs.Container();
        _oDrawContainer.x = CANVAS_WIDTH/2;
        _oDrawContainer.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oDrawContainer);
    
        _oGridContainer = new createjs.Container();
        _oGridContainer.x = CANVAS_WIDTH/2;
        _oGridContainer.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oGridContainer);
         
        _oInterface = new CInterface();    
        
        var oSprite = s_oSpriteLibrary.getSprite('board8');;

        _oBoard = new createBitmap(oSprite);
        _oBoard.regX = oSprite.width/2;
        _oBoard.regY = oSprite.height/2;
        _oGridContainer.addChild(_oBoard);
        
        this._initGrid();        

        this._activeCellClick();        

        new CStartAnimation(_oDrawContainer, _aWhitePos, _aBlackPos);
    };
    
    this._initGrid = function(){
      
        var iLength = BOARD_LENGTH;
        var iNumCell = NUM_CELL;
        var iGridStart = -iLength/2;
        var iCellLength = CELL_LENGTH;
        var iCellStartPos = iGridStart + iCellLength/2;
        
        //Init Cell Position
        _aCellPos = new Array();
        for(var i=0; i<iNumCell; i++){
            _aCellPos[i] = new Array();
            for(var j=0; j<iNumCell; j++){                
                _aCellPos[i][j] = {x: iCellStartPos +j*iCellLength, y: iCellStartPos +i*iCellLength};                
            }
        }
        
        _aCell = new Array();
        _aCellSupport = new Array();
        var iBgColor = BG_BLACK;
        for(var i=0; i<iNumCell; i++){
            _aCell[i] = new Array();
            _aCellSupport[i] = new Array();
            for(var j=0; j<iNumCell; j++){
                var iType = -1;
                _aCell[i][j] = new CCell(_aCellPos[i][j].x, _aCellPos[i][j].y, iType, i,j, iBgColor,_oGridContainer);
                _aCell[i][j].setVisible(false);
                _aCellSupport[i][j] = iType;
                if(iBgColor === BG_BLACK){
                    iBgColor = BG_WHITE;
                } else {
                    iBgColor = BG_BLACK;
                }
            }
            if(i%2 === 1){
                iBgColor = BG_BLACK;
            } else {
                iBgColor = BG_WHITE;
            }
        }
        
        _aBlackPos = new Array();
        for(var i=0; i<3; i++){
            for(var j=0; j<iNumCell; j++){
                if( _aCell[i][j].getBgColor()===BG_BLACK ){
                    _aCell[i][j].setColor(PAWN_BLACK);
                    _aCellSupport[i][j] = PAWN_BLACK;
                    _aBlackPos.push({x: _aCell[i][j].getGlobalX(), y: _aCell[i][j].getGlobalY()});
                    
                }                
            }
        }
        
        _aWhitePos = new Array();
        for(var i=iNumCell - 3; i<iNumCell; i++){
            for(var j=0; j<iNumCell; j++){
                if( _aCell[i][j].getBgColor()===BG_BLACK ){
                    _aCell[i][j].setColor(PAWN_WHITE);
                    _aCellSupport[i][j] = PAWN_WHITE;
                    _aWhitePos.push({x: _aCell[i][j].getGlobalX(), y: _aCell[i][j].getGlobalY()});
                }                
            }
        } 
        
        _oInterface.activePlayer(PAWN_WHITE);

    };
    
    this._AIMoves = function(oMoves){
        
        var iMoveIndex;
        if(oMoves.length > 1){
            iMoveIndex = Math.floor(Math.random()*oMoves.length);

        } else {
            iMoveIndex = 0;
        }

        _oActiveCell = {row: oMoves[iMoveIndex].model.moves.currow, col: oMoves[iMoveIndex].model.moves.curcol};            

        var iDestRow = oMoves[iMoveIndex].model.moves.destrow;
        var iDestCol = oMoves[iMoveIndex].model.moves.destcol;

        var aList = new Array();
        if(oMoves[iMoveIndex].model.moves.rawpath === null || oMoves[iMoveIndex].model.moves.rawpath.length === 1){
            aList[0] = [{row: iDestRow, col: iDestCol}];
        }else {

            aList[0] = new Array();
            for(var i=0; i<oMoves[iMoveIndex].model.moves.rawpath.length; i++){                    
                iDestRow = oMoves[iMoveIndex].model.moves.rawpath[i].model.row;
                iDestCol = oMoves[iMoveIndex].model.moves.rawpath[i].model.col;
                aList[0].push({row: iDestRow, col: iDestCol});

            }
        }

        _aCell[_oActiveCell.row][_oActiveCell.col].setMovesChain(aList);
        
        if(_iCurPlayer === PAWN_BLACK && s_iGameType === MODE_COMPUTER){
            
                _oThinking = new CThinking();
                var iTimeThink = MIN_AI_THINKING + Math.random()*(MAX_AI_THINKING - MIN_AI_THINKING);

                
                setTimeout(function(){_oThinking.unload(); _oParent._movePawn(aList[0][0].row, aList[0][0].col); _oThinking = null; }, iTimeThink);
            }
        
    };
    
    this.changeTurn = function(){
    
        this.countPawn();
        if(_iNumBlack === 0){
            this.gameOver(WIN_WHITE);
            return;
        }
        if(_iNumWhite === 0){
            this.gameOver(WIN_BLACK);
            return;
        }
        
       
        _iDrawCounter++;
        if(_iDrawCounter === DRAW_COUNTER){
            this.gameOver(DRAW);
            return;
        }   
       
        if(_iCurPlayer === PAWN_WHITE){
            var bMovesAvailable = this._checkCanMove(PAWN_BLACK);
            if(!bMovesAvailable){
                this.gameOver(WIN_WHITE_BLACK_NOMOVES);
                return;
            }
        } else {            
            var bMovesAvailable = this._checkCanMove(PAWN_WHITE);
            if(!bMovesAvailable){
                this.gameOver(WIN_BLACK_WHITE_NOMOVES);
                return;
            }            
        }
            
        //}
       
        if(_oMessage !== null){
            _oMessage.unload();
            _oMessage = null;
        }
        
        
        if(_iCurPlayer === PAWN_BLACK){
            _iCurPlayer = PAWN_WHITE;
            if(s_iGameType === MODE_COMPUTER){
                _bBlock = false;
            }    
        } else {
            _iCurPlayer = PAWN_BLACK;
            if(s_iGameType === MODE_COMPUTER){
                _bBlock = true;
                var oNextMove = this._buildDecisionTree();
                this._AIMoves(oNextMove);
            }            
        }
        
        
        
        _oInterface.activePlayer(_iCurPlayer);
        
        if(s_iGameType === MODE_HUMAN || (s_iGameType === MODE_COMPUTER && _iCurPlayer === PAWN_WHITE)){
            this._activeCellClick();            
        }  
        
    };
    
    this._disableAllClick = function(){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                _aCell[i][j].setClickableArea(false);
            }
        }        
    };
    
    this.cellClicked = function(iRow, iCol){
        
        if(_bBlock){
            return;
        }
        
        if (_oActiveCell === null){
             this._activePawn(iRow,iCol);   

            
        }else if (_oActiveCell.row === iRow && _oActiveCell.col === iCol) {
            this._resetMoves();
            this._disableAllHighlight();
            this._activeCellClick();
            _oActiveCell = null;
        } else if ( (_oActiveCell.row !== iRow || _oActiveCell.col !== iCol) && !_aCell[iRow][iCol].isLegalMove() ) {
            this._resetMoves();
            this._activeCellClick();
            this._activePawn(iRow,iCol);
            
        } else if ( (_oActiveCell.row !== iRow || _oActiveCell.col !== iCol) && _aCell[iRow][iCol].isLegalMove() ) {
            //MOVE
            this._resetMoves();
            this._disableAllHighlight();
            this._disableAllClick();
            
            this._movePawn(iRow, iCol);
        }   
    };
    
    this._movePawn = function(iDestRow, iDestCol){
        var iCurX = _aCell[_oActiveCell.row][_oActiveCell.col].getX();
        var iCurY = _aCell[_oActiveCell.row][_oActiveCell.col].getY();
        var iCurType = _aCell[_oActiveCell.row][_oActiveCell.col].getType();

        if(iCurType < KING_WHITE){
            _iDrawCounter = 0;
        }

        var iDistRow = (_oActiveCell.row - iDestRow) / 2;
        var iDistCol = (_oActiveCell.col - iDestCol) / 2;
        if(Math.abs(iDistRow) > 0.5){
            //EAT PAWN
            _bEat = true;
            _oEatenPawn = {row: _oActiveCell.row - iDistRow, col: _oActiveCell.col - iDistCol};             
        };
        _aCell[_oActiveCell.row][_oActiveCell.col].setColor(PAWN_NULL);
        _aCellSupport[_oActiveCell.row][_oActiveCell.col] = PAWN_NULL;
        var oCopyCell = new CMovingCell(iCurX, iCurY, iCurType, _oGridContainer);            

        var iDestX = _aCell[iDestRow][iDestCol].getX();
        var iDestY = _aCell[iDestRow][iDestCol].getY();

        var aList = new Array();
        aList = _aCell[_oActiveCell.row][_oActiveCell.col].getMovesChain();        
        
        if(aList[0].length > 1){
            oCopyCell.move(iDestX, iDestY, TIME_MOVE, iDestRow, iDestCol, aList);
        } else {
            oCopyCell.move(iDestX, iDestY, TIME_MOVE, iDestRow, iDestCol, null);
        } 

        _oActiveCell = null;
    };
    
    this.onFinishMove = function(iRow, iCol, iType, aList){        
        playSound("click_cell",1,0);

        if(iType === PAWN_BLACK && iRow === NUM_CELL -1){
            playSound("king",1,0);
            
            _aCell[iRow][iCol].setColor(KING_BLACK);
            _aCellSupport[iRow][iCol] = KING_BLACK;
            _iBlackEaten--;
            _oInterface.refreshBlackPawnNumber(_iBlackEaten);
        } else if(iType === PAWN_WHITE && iRow === 0){
            playSound("king",1,0);
            
            _aCell[iRow][iCol].setColor(KING_WHITE);
            _aCellSupport[iRow][iCol] = KING_WHITE;
            _iWhiteEaten--;
            _oInterface.refreshWhitePawnNumber(_iWhiteEaten);
        } else {
            _aCell[iRow][iCol].setColor(iType);
            _aCellSupport[iRow][iCol] = iType;
        }
        
        if(_bEat){    
            
            _iDrawCounter = 0;

            
            if(_aCell[_oEatenPawn.row][_oEatenPawn.col].getType() === PAWN_BLACK){
                _iBlackEaten++;
                _oInterface.refreshBlackPawnNumber(_iBlackEaten);
            } else if(_aCell[_oEatenPawn.row][_oEatenPawn.col].getType() === PAWN_WHITE){
                _iWhiteEaten++;
                _oInterface.refreshWhitePawnNumber(_iWhiteEaten);
            } else if(_aCell[_oEatenPawn.row][_oEatenPawn.col].getType() === KING_BLACK){
                _iBlackEaten +=2;
                _oInterface.refreshBlackPawnNumber(_iBlackEaten);
            } else {
                _iWhiteEaten +=2;
                _oInterface.refreshWhitePawnNumber(_iWhiteEaten);
            }
            
            _aCell[_oEatenPawn.row][_oEatenPawn.col].setColor(PAWN_NULL);
            _aCellSupport[_oEatenPawn.row][_oEatenPawn.col] = PAWN_NULL;
            
        }
        
        
        this._resetMoves();

       if(aList !== null){
           
            _aCell[iRow][iCol].setMovesChain(aList);
           
            _oActiveCell = {row: iRow, col: iCol};
            this._disableAllHighlight();
        
            if(_iCurPlayer === PAWN_BLACK && s_iGameType === MODE_COMPUTER){
                _aCell[iRow][iCol].highlight(false);
            } else {
                _aCell[iRow][iCol].highlight(true);
            }
            
            
            for(var j=0; j<aList.length; j++){
                _aCell[aList[j][0].row][aList[j][0].col].showMoves(true, iType);
                _aCell[aList[j][0].row][aList[j][0].col].setLegalMove(true);
                _aCell[aList[j][0].row][aList[j][0].col].setClickableArea(true);
            }
            
            if(_iCurPlayer === PAWN_BLACK && s_iGameType === MODE_COMPUTER){
                
                setTimeout(function(){ _oParent._movePawn(aList[0][0].row, aList[0][0].col); }, 500);
            }
            
       } else{
           this.changeTurn();           
       }
        _bEat = false;        
    };
    
    this._activePawn = function(iRow, iCol){
        _oActiveCell = {row: iRow, col: iCol};
        
        this._disableAllHighlight();
        
        if(_iCurPlayer === PAWN_BLACK && s_iGameType === MODE_COMPUTER){
            _aCell[iRow][iCol].highlight(false, false);
        } else {
            _aCell[iRow][iCol].highlight(true);

        }
        var iType = _aCell[iRow][iCol].getType();
        this._checkLegalMoves(iRow, iCol, iType, _aCellSupport, _iCurPlayer);
        this._enableMoves(iType);
    };

    this._checkLegalMoves = function(iRow, iCol, iType, aMatrix, iCurPlayer){
        
        var bEat = false;
        var aMovesTemp = new Array();
        _aMovesAvailable = new Array();
        
        if(iType > PAWN_BLACK){
                
            //Check Left down
            if(iCol > 0 && iRow < NUM_CELL-1 && aMatrix[iRow+1][iCol-1] === PAWN_NULL){

                aMovesTemp.push({row: iRow+1, col: iCol-1, move: PAWN_MOVE, eatentype: aMatrix[iRow+1][iCol-1], eatenrow: iRow+1, eatencol:iCol-1});

            } else if(iCol > 1 && iRow < NUM_CELL-2 && aMatrix[iRow+1][iCol-1]%2 !== iCurPlayer && aMatrix[iRow+2][iCol-2] === PAWN_NULL){

                aMovesTemp.push({row: iRow+2, col: iCol-2, move: PAWN_EAT, eatentype: aMatrix[iRow+1][iCol-1], eatenrow: iRow+1, eatencol:iCol-1});
                bEat = true;
            }
            //Check Right down
            if(iCol < NUM_CELL-1 && iRow < NUM_CELL-1 && aMatrix[iRow+1][iCol+1] === PAWN_NULL){

                aMovesTemp.push({row: iRow+1, col: iCol+1, move: PAWN_MOVE, eatentype: aMatrix[iRow+1][iCol+1], eatenrow: iRow+1, eatencol:iCol+1});

            } else if(iCol < NUM_CELL-2 && iRow < NUM_CELL-2 && aMatrix[iRow+1][iCol+1]%2 !== iCurPlayer && aMatrix[iRow+2][iCol+2] === PAWN_NULL){

                aMovesTemp.push({row: iRow+2, col: iCol+2, move: PAWN_EAT, eatentype: aMatrix[iRow+1][iCol+1], eatenrow: iRow+1, eatencol:iCol+1});               
                bEat = true;
            }
            //Check Left up
            if(iCol > 0 && iRow > 0 && aMatrix[iRow-1][iCol-1] === PAWN_NULL){

                aMovesTemp.push({row: iRow-1, col: iCol-1, move: PAWN_MOVE, eatentype: aMatrix[iRow-1][iCol-1], eatenrow: iRow-1, eatencol:iCol-1});

            } else if(iCol > 1 && iRow > 1 && aMatrix[iRow-1][iCol-1]%2 !== iCurPlayer && aMatrix[iRow-2][iCol-2] === PAWN_NULL){
                aMovesTemp.push({row: iRow-2, col: iCol-2, move: PAWN_EAT, eatentype: aMatrix[iRow-1][iCol-1], eatenrow: iRow-1, eatencol:iCol-1});
                bEat = true;
            }
            //Check Right up
            if(iCol < NUM_CELL-1 && iRow > 0 && aMatrix[iRow-1][iCol+1] === PAWN_NULL){

                aMovesTemp.push({row: iRow-1, col: iCol+1, move: PAWN_MOVE, eatentype: aMatrix[iRow-1][iCol+1], eatenrow: iRow-1, eatencol:iCol+1});

            } else if(iCol < NUM_CELL-2 && iRow > 1 && aMatrix[iRow-1][iCol+1]%2 !== iCurPlayer && aMatrix[iRow-2][iCol+2] === PAWN_NULL){

                aMovesTemp.push({row: iRow-2, col: iCol+2, move: PAWN_EAT, eatentype: aMatrix[iRow-1][iCol+1], eatenrow: iRow-1, eatencol:iCol+1});
                bEat = true;
            }
        }
        
        if(iType === PAWN_WHITE){
            //Check Left
            if(iCol > 0 && iRow > 0 && aMatrix[iRow-1][iCol-1] === PAWN_NULL){

                aMovesTemp.push({row: iRow-1, col: iCol-1, move: PAWN_MOVE, eatentype: aMatrix[iRow-1][iCol-1], eatenrow: iRow-1, eatencol:iCol-1});

            } else if(iCol > 1 && iRow > 1 && aMatrix[iRow-1][iCol-1]%2 !== iCurPlayer && aMatrix[iRow-2][iCol-2] === PAWN_NULL){

                aMovesTemp.push({row: iRow-2, col: iCol-2, move: PAWN_EAT, eatentype: aMatrix[iRow-1][iCol-1], eatenrow: iRow-1, eatencol:iCol-1});
                bEat = true;
            }
            //Check Right
            if(iCol < NUM_CELL-1 && iRow > 0 && aMatrix[iRow-1][iCol+1] === PAWN_NULL){

                aMovesTemp.push({row: iRow-1, col: iCol+1, move: PAWN_MOVE, eatentype: aMatrix[iRow-1][iCol+1], eatenrow: iRow-1, eatencol:iCol+1});

            } else if(iCol < NUM_CELL-2 && iRow > 1 && aMatrix[iRow-1][iCol+1]%2 !== iCurPlayer && aMatrix[iRow-2][iCol+2] === PAWN_NULL){

                aMovesTemp.push({row: iRow-2, col: iCol+2, move: PAWN_EAT, eatentype: aMatrix[iRow-1][iCol+1], eatenrow: iRow-1, eatencol:iCol+1});
                bEat = true;
            }

        } else if(iType === PAWN_BLACK){
            //Check Left
            if(iCol > 0 && iRow < NUM_CELL-1 && aMatrix[iRow+1][iCol-1] === PAWN_NULL){

                aMovesTemp.push({row: iRow+1, col: iCol-1, move: PAWN_MOVE, eatentype: aMatrix[iRow+1][iCol-1], eatenrow: iRow+1, eatencol:iCol-1});

            } else if(iCol > 1 && iRow < NUM_CELL-2 && aMatrix[iRow+1][iCol-1]%2 !== iCurPlayer && aMatrix[iRow+2][iCol-2] === PAWN_NULL){

                aMovesTemp.push({row: iRow+2, col: iCol-2, move: PAWN_EAT, eatentype: aMatrix[iRow+1][iCol-1], eatenrow: iRow+1, eatencol:iCol-1});
                bEat = true;
            }
            //Check Right
            if(iCol < NUM_CELL-1 && iRow < NUM_CELL-1 && aMatrix[iRow+1][iCol+1] === PAWN_NULL){

                aMovesTemp.push({row: iRow+1, col: iCol+1, move: PAWN_MOVE, eatentype: aMatrix[iRow+1][iCol+1], eatenrow: iRow+1, eatencol:iCol+1});

            } else if(iCol < NUM_CELL-2 && iRow < NUM_CELL-2 && aMatrix[iRow+1][iCol+1]%2 !== iCurPlayer && aMatrix[iRow+2][iCol+2] === PAWN_NULL){

                aMovesTemp.push({row: iRow+2, col: iCol+2, move: PAWN_EAT, eatentype: aMatrix[iRow+1][iCol+1], eatenrow: iRow+1, eatencol:iCol+1});               
                bEat = true;
            }
        }
        
        if(bEat){
            for (var i=0; i<aMovesTemp.length; i++){
                if(aMovesTemp[i].move === PAWN_EAT){
                    _aMovesAvailable.push(aMovesTemp[i]); 
                }
            }
            return {move: PAWN_EAT, listmove: _aMovesAvailable};
        } else {
            for (var i=0; i<aMovesTemp.length; i++){
                if(aMovesTemp[i].move === PAWN_MOVE){
                    _aMovesAvailable.push(aMovesTemp[i]); 
                }
            }return {move: PAWN_MOVE, listmove: _aMovesAvailable};
        }
    };
    
    this._enableMoves = function(iType){
        
        var iDestRow;
        var iDestCol;
        for (var i=0; i<_aMovesAvailable.length; i++){
            iDestRow = _aMovesAvailable[i].row;
            iDestCol = _aMovesAvailable[i].col;
            
            _aCell[iDestRow][iDestCol].showMoves(true, iType);
            _aCell[iDestRow][iDestCol].setLegalMove(true);
            _aCell[iDestRow][iDestCol].setClickableArea(true);            
        }
    };
    
    this.setShowNumFlip = function(){        
        this.calcFlipCounts();        
    };
        
    this.restartGame = function () {
        this.unload();
        this._init();
    };        
    
    this.pauseGame = function(bVal){
        _bStartGame = !bVal;
    };
    
    this.unload = function(){
        _bStartGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

           
    };
    
    this.onRestart = function(){
        this.unload();
        $(s_oMain).trigger("start_session");
        s_oMain.gotoGame(s_gameMode);
    }
 
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
    };
    
    this.gameOver = function(iWinner){  
        _bStartGame = false;
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(iWinner, _iBlackTime, _iWhiteTime);
        _oInterface.setInfoVisible(false);
    };

    
    this.update = function(){
        if(_bStartGame){
            
            if(_oThinking !== null){
                _oThinking.update();
            }
            
            if(_iCurPlayer === PAWN_WHITE){
                _iWhiteTime += s_iTimeElaps;
                _oInterface.refreshWhiteTime(_iWhiteTime);
            } else {
                _iBlackTime += s_iTimeElaps;
                _oInterface.refreshBlackTime(_iBlackTime);
            }                     
        }
    };

    this.numFlips = function (iX, iY) {
        var iDeltaX, iDeltaY, iDistance;
        var iPosX, iPosY;
        var iCount = 0;

        for(iDeltaY = -1; iDeltaY <= 1; iDeltaY++) {
            for(iDeltaX = -1; iDeltaX <= 1; iDeltaX++) {
                for(iDistance = 1;; iDistance++) {
                    iPosX = iX + (iDistance * iDeltaX);
                    iPosY = iY + (iDistance * iDeltaY);

                    if(iPosX < 0 || iPosX >= NUM_CELL || iPosY < 0 || iPosY >= NUM_CELL){
                        break;
                    }
                       
                    if(_aCell[iPosX][iPosY].getType() === PAWN_NULL){
                        break;
                    }                        

                    if(_aCell[iPosX][iPosY].getType() === _iCurPlayer) {
                        iCount += iDistance - 1;
                        break;
                    }
                }
            }
        }
        
        return(iCount);
    };
    
    this._disableAllHighlight = function(){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                _aCell[i][j].highlight(false);
                _aCell[i][j].showMoves(false, false);
            }
        }            
    };
    
    this.setAllVisible = function(bVal){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                _aCell[i][j].setVisible(bVal);   
            }
        }      
    };
    
    this._checkMatrix = function(aMatrixToCheck){
        var iRowToSee = "";
        for(var i = 0; i < NUM_CELL; i++) {            
            for(var j = 0; j < NUM_CELL; j++) {
                if(aMatrixToCheck[i][j] >= 0){
                    iRowToSee += " " +aMatrixToCheck[i][j] + " | ";
                } else {
                    iRowToSee += aMatrixToCheck[i][j] + " | ";
                }  
            }
            iRowToSee += "|| "+i+"\n"
            
        }  
        trace(iRowToSee);
    };
    
    this._copyMatrix = function(aMatrixToCopy){
        
        var oMatrix = new Array();
        for(var i = 0; i < NUM_CELL; i++) {
            oMatrix[i] = new Array(); 
            for(var j = 0; j < NUM_CELL; j++) {
                oMatrix[i][j] = aMatrixToCopy[i][j];   
            }
        }

        return oMatrix;
    };
    
    this._resetMoves = function(){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                _aCell[i][j].setLegalMove(false);   
            }
        }      
    };
      
    this._checkRecursivePawn = function(iRow, iCol, iType, iCurPlayer, aCurBoard){    
        
        var oCheckMove = this._checkLegalMoves(iRow,iCol,iType, aCurBoard, iCurPlayer); 
        
        if(oCheckMove.move === PAWN_EAT){
            _bConstrainedMoves = true;
            
            for(var i=0; i<oCheckMove.listmove.length; i++){  
                _oMoveTree.addNode(iRow, iCol, 0, oCheckMove.listmove[i].row, oCheckMove.listmove[i].col, 0, oCheckMove.listmove[i].eatenrow, oCheckMove.listmove[i].eatencol);
                this._checkRecursivePawn(oCheckMove.listmove[i].row,oCheckMove.listmove[i].col, iType, iCurPlayer, aCurBoard);
            } 
            
        }
        

    };

    this._checkRecursiveKing = function(iRow, iCol, iType, aCurMatrix, iDepth, iCurPlayer){
        

        var oCheckMove = this._checkLegalMoves(iRow,iCol,iType, aCurMatrix, iCurPlayer);   
        
        if(oCheckMove.move === PAWN_EAT){ 
            _bConstrainedMoves = true;
            
            for(var i=0; i<oCheckMove.listmove.length; i++){  

                _oMoveTree.addNode(iRow, iCol, iDepth, oCheckMove.listmove[i].row, oCheckMove.listmove[i].col, iDepth+1, oCheckMove.listmove[i].eatenrow, oCheckMove.listmove[i].eatencol);
               

                if(i === oCheckMove.listmove.length-1){
                    for(var j=0; j<oCheckMove.listmove.length; j++){
                        var aNewMatrix = this._copyMatrix(aCurMatrix);
                        aNewMatrix[oCheckMove.listmove[j].eatenrow][oCheckMove.listmove[j].eatencol] = PAWN_NULL;
                        this._checkRecursiveKing(oCheckMove.listmove[j].row,oCheckMove.listmove[j].col, iType, aNewMatrix, iDepth+1, iCurPlayer);
                    }
                }    
                
            }             
        }
        
    };

    this._checkConstrainedMoves = function(){  
        _aCellConstrained = new Array();
        _bConstrainedMoves = false;
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                if(_aCell[i][j].getType() === _iCurPlayer){
                    _oMoveTree = new CTree({row:i, col:j});
                    this._checkRecursivePawn(i,j, _aCell[i][j].getType(), _iCurPlayer, _aCellSupport);
                    
                    var oTerminalNodes = _oMoveTree.getTerminalNodes();
                    
                    var aPath = new Array();
                    for(var n=0; n<oTerminalNodes.length; n++){
                        aPath[n] = _oMoveTree.getPath(oTerminalNodes[n]);
                    }
                    
                    _aCell[i][j].setMovesChain(aPath);
 
                } else if((_aCell[i][j].getType() === KING_BLACK || _aCell[i][j].getType() === KING_WHITE) && _aCell[i][j].getType()%2 === _iCurPlayer){
                    _oMoveTree = new CTree({row:i, col:j});
                    var aCurMatrix = this._copyMatrix(_aCellSupport);
                    aCurMatrix[i][j] = PAWN_NULL; //COUSE KING CAN GO BACK, WE NEED TO FREE STARTING CELL WHEN COMPUTE
                    this._checkRecursiveKing(i,j, _aCell[i][j].getType(), aCurMatrix, 0, _iCurPlayer);       
                    _bTerminal =false;
                    
                    var oTerminalNodes = _oMoveTree.getTerminalNodes();
                    
                    var aPath = new Array();
                    for(var n=0; n<oTerminalNodes.length; n++){
                        aPath[n] = _oMoveTree.getPath(oTerminalNodes[n]);
                    }
                    
                    _aCell[i][j].setMovesChain(aPath);

                }
                
            }
        }
        
    };

    this._activeCellClick = function(){
        
        this._checkConstrainedMoves();
        
        this._resetMoves();
        this._disableAllHighlight();
        this._disableAllClick();
        
        if(_bConstrainedMoves){            
            this._evaluatePath();

            for(var i = 0; i < _aCellConstrained.length; i++){
                var iRow = _aCellConstrained[i].row;
                var iCol = _aCellConstrained[i].col;
                
                if(_iCurPlayer === PAWN_BLACK && s_iGameType === MODE_COMPUTER){

                } else {
                    _aCell[iRow][iCol].setClickableArea(true);
                    _aCell[iRow][iCol].highlight(true);
                }                
            }
            
            if(_oMessage === null){
                _oMessage = new CMessage(_iCurPlayer, TEXT_JUMP);
            }
            
            
        } else {
            for(var i = 0; i < NUM_CELL; i++) {
                for(var j = 0; j < NUM_CELL; j++) {
                    _aCell[i][j].setClickableArea(false);
                    if(_aCell[i][j].getType()%2 === _iCurPlayer){                    
                        if(_iCurPlayer === PAWN_BLACK && s_iGameType === MODE_COMPUTER){

                        } else {
                            _aCell[i][j].setClickableArea(true);                       
                        }
                    }
                }
            }
        }        
    };
    
    this._evaluatePath = function(){       
        ////////CHECK RULE 1////////////
        var iMax = 0;
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                if(_aCell[i][j].getType()%2 === _iCurPlayer){
                    for(var n=0; n<_aCell[i][j].getMovesChain().length; n++){
                        if(iMax < _aCell[i][j].getMovesChain()[n].length){
                            iMax = _aCell[i][j].getMovesChain()[n].length;
                        }                            
                    }                        
                }
            }
        }
        ////////CHECK RULE 2/////////////////
        var bKingExist = false;
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                if(_aCell[i][j].getType()%2 === _iCurPlayer){
                    for(var n=0; n<_aCell[i][j].getMovesChain().length; n++){
                        if(iMax === _aCell[i][j].getMovesChain()[n].length){
                            if(_aCell[i][j].getType() > PAWN_BLACK){
                                bKingExist = true;
                            }
                        }                            
                    }                        
                }
            }
        }       
        
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                if(_aCell[i][j].getType()%2 === _iCurPlayer){
                    var aNewPath = new Array();
                    var bPathFound = false;
                    for(var n=0; n<_aCell[i][j].getMovesChain().length; n++){
                        aNewPath[n] = new Array();
                        if(bKingExist){
                            if(iMax === _aCell[i][j].getMovesChain()[n].length && _aCell[i][j].getType() > PAWN_BLACK){
                                for(var k=0; k<iMax; k++){
                                    aNewPath[n].push({row:_aCell[i][j].getMovesChain()[n][k].model.row, col:_aCell[i][j].getMovesChain()[n][k].model.col});
                                }

                                bPathFound = true;
                            }       
                        } else {
                            if(iMax === _aCell[i][j].getMovesChain()[n].length){
                                for(var k=0; k<iMax; k++){
                                    aNewPath[n].push({row:_aCell[i][j].getMovesChain()[n][k].model.row, col:_aCell[i][j].getMovesChain()[n][k].model.col});
                                }

                                bPathFound = true;
                            }                            
                        }                                             
                    }

                    for(var n=aNewPath.length-1; n>=0; n--){
                        if(aNewPath[n].length === 0){
                            aNewPath.splice(n,1);
                        } else {
                            aNewPath[n].splice(0,1);
                        }
                    }
                    
                    _aCell[i][j].setMovesChain(aNewPath);
                    if(bPathFound){
                        _aCellConstrained.push({row:i, col:j});
                    }
                }
            }
        }
    };
       
    this._checkBoard = function(){
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++){
                trace(_aCell[i][j].isLegalMove());
            }
        }
    };

    this._calculateMin = function(iA, iB){
        if(iA < iB){
            return iA;
        } else {
            return iB;
        }
    };
    
    this._calculateMax = function(iA, iB){
        if(iA > iB){
            return iA;
        } else {
            return iB;
        }
    };
    
    this._minimax = function(oNode, iDepth){
        if(!oNode.hasChildren() || iDepth === 0){
            return oNode.model.rating;
        }
        
        var iAlpha;
        if(iDepth%2 === 0){
            if(SEARCH_DEPTH%2 === 0){
                iAlpha = -9999;
                for(var i=0; i<oNode.children.length; i++){
                    iAlpha = this._calculateMax(iAlpha, this._minimax(oNode.children[i], iDepth-1));
                }
            } else {
                iAlpha = +9999;
                for(var i=0; i<oNode.children.length; i++){
                    iAlpha = this._calculateMin(iAlpha, this._minimax(oNode.children[i], iDepth-1));
                }
            }
            
            //oNode.model.rating = iAlpha;
            
        } else if(iDepth%2 === 1) {
            if(SEARCH_DEPTH%2 === 0){
                iAlpha = 9999;
                for(var i=0; i<oNode.children.length; i++){
                    iAlpha = this._calculateMin(iAlpha, this._minimax(oNode.children[i], iDepth-1));
                }
            } else {
                iAlpha = -9999;
                for(var i=0; i<oNode.children.length; i++){
                    iAlpha = this._calculateMax(iAlpha, this._minimax(oNode.children[i], iDepth-1));
                }
            }
            //oNode.model.rating = iAlpha;
        }
              
        oNode.model.rating = iAlpha;
        
        return iAlpha;        
    };    
    
    
    this._buildDecisionTree = function(){
        var iStartingDepth = 0;
        _oDecisionTree = new CTreeDecision({rating: 0, moves: [], depth:iStartingDepth});
        var aCopyBoard = this._copyMatrix(_aCellSupport);
        this._buildDecisionRecursive(aCopyBoard, iStartingDepth, 0);

        var iValue = this._minimax(_oDecisionTree.getRoot(),SEARCH_DEPTH);
        var iChildOfRoot = 1;
        
        var oAIMoves = _oDecisionTree.getNode(iValue, iChildOfRoot);
        
        return oAIMoves;
    };
    
    this._buildDecisionRecursive = function(aCurBoard, iParentDepth, iParentNumMove){
        
        if(iParentDepth === SEARCH_DEPTH){
            return;
        }
        
        var aAllMoves = this._findAllMoves(aCurBoard, (iParentDepth+_iCurPlayer)%2);
        var aNewBoard = new Array();
        for(var i=0; i<aAllMoves.length; i++){
            aNewBoard[i] = this._buildNewBoard(aCurBoard,aAllMoves[i]);
            
            var obj = this._evalBoard(aNewBoard[i]);
            //var iRate = this._evalBoard(aNewBoard[i]).rate;
            //var oBlackMatrix = 
            _oDecisionTree.addNode(iParentDepth, iParentNumMove, iParentDepth+1, i, obj.rate, aAllMoves[i], obj.blackmatrix, obj.whitematrix);
            
            if(i === aAllMoves.length-1){  
                for(var j=0; j<aAllMoves.length; j++){
                    this._buildDecisionRecursive(aNewBoard[j], iParentDepth+1, j);
                }                
            }
            
        }     
    };
    
    this._findAllMoves = function(aCurBoard, iCurPlayer){
        var oMove;
        var bEat = false;
        var aMovesList = new Array();
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++){
                if(aCurBoard[i][j]%2 === iCurPlayer){
                    
                    oMove = this._checkLegalMoves(i,j,aCurBoard[i][j], aCurBoard, iCurPlayer);
                    if(oMove.move === PAWN_MOVE && oMove.listmove.length !== 0){
                        for(var n=0; n<oMove.listmove.length; n++){
                            aMovesList.push({currow:i, curcol:j, pawntype: aCurBoard[i][j], movetype: PAWN_MOVE, destrow:oMove.listmove[n].row, destcol:oMove.listmove[n].col, rawpath:null});
                        }                      
                    } else if(oMove.move === PAWN_EAT){
                        bEat = true;
                        _oMoveTree = new CTree({row:i, col:j});
                        
                        if(aCurBoard[i][j] === iCurPlayer){                            
                            this._checkRecursivePawn(i,j, aCurBoard[i][j], iCurPlayer, aCurBoard);  
                            
                            var oTerminalNodes = _oMoveTree.getTerminalNodes();
                            var aPath = new Array();
                            for(var n=0; n<oTerminalNodes.length; n++){
                                
                                aPath[n] = _oMoveTree.getPath(oTerminalNodes[n]);
                                aPath[n].splice(0,1);
                                aMovesList.push({currow:i, curcol:j, pawntype: aCurBoard[i][j], movetype: PAWN_EAT, 
                                                    destrow:aPath[n][aPath[n].length-1].model.row, destcol:aPath[n][aPath[n].length-1].model.col, 
                                                        rawpath:aPath[n]});
                            }                   
                        } else if((aCurBoard[i][j] === KING_BLACK || aCurBoard[i][j] === KING_WHITE) && aCurBoard[i][j]%2 === iCurPlayer){
                            var aCurMatrix = this._copyMatrix(aCurBoard);
                            aCurMatrix[i][j] = PAWN_NULL; //COUSE KING CAN GO BACK, WE NEED TO FREE STARTING CELL WHEN COMPUTE
                            this._checkRecursiveKing(i,j, aCurBoard[i][j], aCurMatrix, 0, iCurPlayer);       
                            _bTerminal =false;

                            var oTerminalNodes = _oMoveTree.getTerminalNodes();

                            var aPath = new Array();
                            for(var n=0; n<oTerminalNodes.length; n++){
                                aPath[n] = _oMoveTree.getPath(oTerminalNodes[n]);
                                aPath[n].splice(0,1);
                                aMovesList.push({currow:i, curcol:j, pawntype: aCurBoard[i][j], movetype: PAWN_EAT, 
                                                    destrow:aPath[n][aPath[n].length-1].model.row, destcol:aPath[n][aPath[n].length-1].model.col, 
                                                        rawpath:aPath[n]});
                            }
                        }
                    }
                }
            }
        }

        if(bEat){            
            bEat = false;
            for(var i=aMovesList.length-1; i>=0; i--){
                if(aMovesList[i].movetype === PAWN_MOVE){
                    aMovesList.splice(i,1);
                }
            }
            aMovesList = this._evaluatePathForAI(aMovesList);
        }                
        
        
        return aMovesList;
       
    };
    
    this._evaluatePathForAI = function(aMovesList){      
        ////////CHECK RULE 1////////////
        var iMax = 0;
        for(var i=0; i<aMovesList.length; i++){
            if(iMax < aMovesList[i].rawpath.length){
                iMax = aMovesList[i].rawpath.length;
            } 
        }
       
        ////////CHECK RULE 2/////////////////
        var bKingExist = false;
        for(var i=0; i<aMovesList.length; i++){            
            if(iMax === aMovesList[i].rawpath.length){
                if(aMovesList[i].pawntype > PAWN_BLACK){
                    bKingExist = true;
                }   
            }                             
        }
        
        var aNewList = new Array();
        for(var i=0; i<aMovesList.length; i++){
            if(bKingExist){
                if(iMax === aMovesList[i].rawpath.length && aMovesList[i].pawntype > PAWN_BLACK){
                    aNewList.push(aMovesList[i]);
                }       
            } else{
                if(iMax === aMovesList[i].rawpath.length){
                    aNewList.push(aMovesList[i]);
                }  
            }            
        }
              
              
        return aNewList;      
        
    };
    
    this._buildNewBoard = function(aCurBoard, aCurMoves){
        
        var aRefactoredMatrix = this._copyMatrix(aCurBoard);
        
        aRefactoredMatrix[aCurMoves.currow][aCurMoves.curcol] = PAWN_NULL;
        aRefactoredMatrix[aCurMoves.destrow][aCurMoves.destcol] = aCurMoves.pawntype;
        
        if(aCurMoves.rawpath !== null){
            for(var i=0; i<aCurMoves.rawpath.length; i++){
                aRefactoredMatrix[aCurMoves.rawpath[i].model.eatenrow][aCurMoves.rawpath[i].model.eatencol] = PAWN_NULL;
            }
        }
        return aRefactoredMatrix;
    };
    
    this._evalBoard = function(aCurBoard){  
        
        
        var aKingBlackWeightMatrix = new Array();
        aKingBlackWeightMatrix = this._buildDistanceMatrix(aCurBoard, PAWN_BLACK);
        
        var aKingWhiteWeightMatrix = new Array();
        aKingWhiteWeightMatrix = this._buildDistanceMatrix(aCurBoard, PAWN_WHITE);
        //this._checkMatrix(aKingWhiteWeightMatrix)
        
        var iNumWhite = 0;
        var iNumKingWhite = 0;
        var iNumBlack = 0;
        var iNumKingBlack = 0;
        
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                if(aCurBoard[i][j] === PAWN_BLACK){
                    iNumBlack++;
                } else if(aCurBoard[i][j] === PAWN_WHITE){
                    iNumWhite++;
                } else if(aCurBoard[i][j] === KING_BLACK){
                    //iNumKingBlack++
                    iNumKingBlack += aKingBlackWeightMatrix[i][j];
                } else if(aCurBoard[i][j] === KING_WHITE){
                    //iNumKingWhite++
                    iNumKingWhite += aKingBlackWeightMatrix[i][j];
                }                
            }
        }
        
        var iKingWeight = 1.4;
        var iRate = iNumBlack - iNumWhite + iKingWeight*(iNumKingBlack - iNumKingWhite); 
        
        return {rate: iRate, blackmatrix: aKingBlackWeightMatrix, whitematrix: aKingWhiteWeightMatrix};        
    };

    this._buildDistanceMatrix = function(aCurBoard, iCurPlayer){
        var aPawnList = new Array();
        var bOnlyKing = true;
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                if(aCurBoard[i][j] < KING_WHITE && aCurBoard[i][j] !== -1){
                    bOnlyKing = false;
                }
                if(aCurBoard[i][j]%2 !== iCurPlayer && aCurBoard[i][j] > -1){
                    aPawnList.push({row: i, col:j});
                }
            }
        }
        
        var aKingWeightMatrix = new Array();
        if((!bOnlyKing || aPawnList.length === 0)){            
            
            aKingWeightMatrix = [
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1]
            ];
            
        } else if(bOnlyKing){
            var iRowPos;
            var iColPos;
            var aPartialMatrix = new Array();
            for(var i=0; i<aPawnList.length; i++){
                iRowPos = aPawnList[i].row;
                iColPos = aPawnList[i].col;
                
                aPartialMatrix[i] = new Array();
                var iRowNumber;
                var iColNumber;
                for(var n=0; n<NUM_CELL; n++){
                    aPartialMatrix[i][n] = new Array();                    
                    for(var k=0; k<NUM_CELL; k++){
                        //iRowNumber = Math.ceil((NUM_CELL - (Math.abs(iRowPos - n))) / 2);
                        //iColNumber = Math.ceil((NUM_CELL - (Math.abs(iColPos - k))) / 2);
                        iRowNumber = NUM_CELL - (Math.abs(iRowPos - n));
                        iColNumber = NUM_CELL - (Math.abs(iColPos - k));
                        aPartialMatrix[i][n][k] = this._calculateMin(iRowNumber, iColNumber);
                    }    
                }                
            }
            
            var aTemp = new Array();
            aTemp = aPartialMatrix[0];
            for(var i=0; i<aPawnList.length; i++){
                for(var n=0; n<NUM_CELL; n++){
                    for(var k=0; k<NUM_CELL; k++){
                        if(aTemp[n][k] < aPartialMatrix[i][n][k]){
                            aTemp[n][k] = aPartialMatrix[i][n][k];
                        }
                    }                    
                }
            }
            aKingWeightMatrix = aTemp;
            
        }
        return aKingWeightMatrix;
    };

    
    this.countPawn = function(){
        var iType;
        _iNumBlack = 0;
        _iNumWhite = 0;
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                iType = _aCell[i][j].getType()%2;
                if(iType === PAWN_BLACK){
                    _iNumBlack++;
                } else if(iType === PAWN_WHITE) {
                    _iNumWhite++;
                }
            }
        }
    };
    
    this._checkCanMove = function(iCurPlayer){
        var oMoves;
        for(var i = 0; i < NUM_CELL; i++) {
            for(var j = 0; j < NUM_CELL; j++) {
                if(_aCellSupport[i][j]%2 === iCurPlayer){
                    oMoves = this._checkLegalMoves(i,j,_aCellSupport[i][j], _aCellSupport, iCurPlayer);
                    if(oMoves.listmove.length > 0){
                        return true;
                    }
                }
                
            }
        }
        
        return false;
    };
    
    this.nullMessage = function(){
        _oMessage = null;
    };

    s_oGame=this;
    
    
    _oParent=this;
    this._init();
}

var s_oGame;
