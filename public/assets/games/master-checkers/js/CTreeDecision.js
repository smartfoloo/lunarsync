function CTreeDecision(oObj){
    
    var _aNode;
    
    var _oTree;
    var _oRoot;
    
    
    
    this._init = function(oObj){
        _aNode = new Array();
        for(var i=0; i<SEARCH_DEPTH+1; i++){
            _aNode[i] = new Array();
        }
        
        _oTree = new TreeModel();        
        _oRoot = _oTree.parse(oObj);
        
        _aNode[0][0] = _oRoot;
    };
    
    this.getRoot = function(){
       return(_oRoot);
    };
    
    this.addNode = function(iParentRow, iParentCol, iChildRow, iChildCol, iRate, aMove, aBlackMatrix, aWhiteMatrix){
        // Parse the new node
        _aNode[iChildRow][iChildCol] = _oTree.parse({rating: iRate, moves: aMove, depth:iChildRow, blackmatrix: aBlackMatrix, whitematrix: aWhiteMatrix});
        // Add it to the parent
        _aNode[iParentRow][iParentCol].addChild(_aNode[iChildRow][iChildCol]);
    };
    
    this.getNode = function(iRate, iDepth){
        
        return (
            _oRoot.all(function (node) {
                return node.model.rating === iRate && node.model.depth === iDepth;
            })
        );        
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