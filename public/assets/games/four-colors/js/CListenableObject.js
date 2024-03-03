function CListernableObject(){
    var _aCB;


    this._init = function(){
            _aCB = new Array(); 
        };

        this.addEventListener = function (szEvent, cb, owner) {
        _aCB[szEvent] = { cb: cb,  owner: owner } ;
    };


    this.removeEventListener = function (szEvent) {
        _aCB[szEvent] = null;
    };    


    this.callEvent = function( szEvent, aData ){
        if (_aCB[szEvent]) {
            if( aData ){
                _aCB[szEvent].cb.apply(_aCB[szEvent].owner, [aData]);
                //_aCB[szEvent].cb.call(_aCB[szEvent].owner, aData);
            }else{
                _aCB[szEvent].cb.call(_aCB[szEvent].owner);
            }
        }  
    };


    this._init();
};