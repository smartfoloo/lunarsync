function CTurnManager (){
   var _bClockWise;
   var _iNextPlayer = 0;
   var _iThisTurn = 0;  
    
    this.init = function (){
     _bClockWise = true;

    _iThisTurn = 0;
    if (_iThisTurn===3){
        _iNextPlayer=0;
    }else{
        _iNextPlayer=_iThisTurn+1;
    }  
    s_oTurnManager = this;
   };
    
    this.changeClockWise = function (){
        if (_bClockWise===true){
            _bClockWise=false;
        }else{
            _bClockWise=true;
        }
    };
    this.nextTurn = function(){
       if (_bClockWise===true){
           if (_iThisTurn===NUM_PLAYERS-1){
               _iThisTurn=0;
               _iNextPlayer=1;
           }else{
               _iThisTurn++;
               if (_iThisTurn===NUM_PLAYERS-1){
                   _iNextPlayer=0;
               }else{
                   _iNextPlayer=_iThisTurn+1;
               }
           }
       }else{
           if (_iThisTurn===0){
               _iThisTurn=NUM_PLAYERS-1;
               _iNextPlayer = NUM_PLAYERS-2;
           }else{
               _iThisTurn--;
               if (_iThisTurn===0){
                   _iNextPlayer=NUM_PLAYERS-1;
               }else{
                   _iNextPlayer=_iThisTurn-1;
               }
           }
       } 
    };
    
    this.checkTurn = function(){
        return _iThisTurn;
    };
    
    this.prevTurn = function(){
        
        if (_bClockWise===true){
           if (_iThisTurn===0){
               _iThisTurn=NUM_PLAYERS-1;
               _iNextPlayer = NUM_PLAYERS-2;
           }else{
               _iThisTurn--;
               if (_iThisTurn===0){
                   _iNextPlayer=NUM_PLAYERS-1;
               }else{
                   _iNextPlayer=_iThisTurn-1;
               }
           }
       }else{
          if (_iThisTurn===NUM_PLAYERS-1){
               _iThisTurn=0;
               _iNextPlayer=1;
           }else{
               _iThisTurn++;
               if (_iThisTurn===NUM_PLAYERS-1){
                   _iNextPlayer=0;
               }else{
                   _iNextPlayer=_iThisTurn+1;
               }
           }
       }
    };
    
        this.checkPrevTurn = function(){
        var iPrevTurn;
        if (_bClockWise===true){
           if (_iThisTurn===0){
               iPrevTurn=NUM_PLAYERS-1;
           }else{
               iPrevTurn =  _iThisTurn-1;
           }
       }else{
          if (_iThisTurn===NUM_PLAYERS-1){
               iPrevTurn=0;
           }else{
               iPrevTurn = _iThisTurn+1;
           }
       }
       return iPrevTurn;
    };
    
    this.checkNextPlayer= function(){
        return _iNextPlayer;
    };
    
    this.setTurn = function (iTurn){
        _iThisTurn = iTurn;
        
        if (_bClockWise===true){
            if (_iThisTurn===NUM_PLAYERS-1){
                _iNextPlayer=0;
            }else{
                _iNextPlayer=_iThisTurn+1;
            }
        }else{
            if (_iThisTurn===0){
                _iNextPlayer=NUM_PLAYERS-1;
            }else{
                _iNextPlayer=_iThisTurn-1;
            }
        }
    };
    
    this.getClockWise = function (){
        return _bClockWise;
    };
    
    this.init();
};

s_oTurnManager = null;
