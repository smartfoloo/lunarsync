function CTree(oObj){
    
    var _aNode;
    
    var _oTree;
    var _oRoot;
    
    
    
    this._init = function(oObj){
        _aNode = new Array();
        for(var i=0; i<NUM_CELL; i++){
            _aNode[i] = new Array();
            for(var j=0; j<NUM_CELL; j++){
                 _aNode[i][j] = new Array();
            }
        }
        
        _oTree = new TreeModel();        
        _oRoot = _oTree.parse(oObj);
        
        _aNode[oObj.row][oObj.col][0] = _oRoot;
    };
    
    this.getRoot = function(){
       return(_oRoot);
    };
    
    this.addNode = function(iParentRow, iParentCol, iParentIteration, iChildRow, iChildCol, iChildIteration, iEatenRow, iEatenCol){
        // Parse the new node
        _aNode[iChildRow][iChildCol][iChildIteration] = _oTree.parse({row: iChildRow, col: iChildCol, eatenrow: iEatenRow, eatencol: iEatenCol});
        // Add it to the parent
        _aNode[iParentRow][iParentCol][iParentIteration].addChild(_aNode[iChildRow][iChildCol][iChildIteration]);
    };
    
    this.getNode = function(iRow, iCol){

        _aNode[iRow][iCol][0] = _oRoot.all(function (node) {
            return node.model.row === iRow && node.model.col === iCol;
        });
        
        return _aNode[iRow][iCol][0];
    };
    
    this.getPath = function(oNode){
        return oNode.getPath();
    };
    
    this.getTerminalNodes = function(){
        
        return(
            _oRoot.all(function (node) {
                return !node.hasChildren();
            })
        );
        
    };
    
    this._init(oObj);
}