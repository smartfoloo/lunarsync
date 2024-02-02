/* 
 * Tile
 * Object for storing a single tile. Allows for collecing its own state information, marking, clearing, etc.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function Tile(value, grid, index) {
  var self = this,
      x = this.x = index % grid.width,
      y = this.y = Math.floor(index  / grid.width),
      id = this.id = x + ',' + y,
      reg0 = new RegExp('0','g'),
      possibleValues = [],
      emptyColPairWith = null, // other pair that this tile is an empty pair with
      emptyRowPairWith = null; // other pair that this tile is an empty pair with

  var Directions = {
    Left: 'Left',
    Right: 'Right',
    Up: 'Up',
    Down: 'Down'
  }
  
  // prepare ids for simple backtracking
  this.id1 = id + '=' + 1;
  this.id2 = id + '=' + 2;

  function clear() {
    setValue(0);
  }

  function traverse(hor, ver) {
    var newX = x + hor,
        newY = y + ver;
    return grid.tile(newX, newY);
  }

  function right() { return move(Directions.Right); };
  function left() { return move(Directions.Left); };
  function up() { return move(Directions.Up); };
  function down() { return move(Directions.Down); };
  
  function move(dir) { 
    switch(dir) {
      case Directions.Right: 
        return traverse(1, 0);
      case Directions.Left: 
        return traverse(-1, 0);
      case Directions.Up: 
        return traverse(0, -1);
      case Directions.Down: 
        return traverse(0, 1);
    }
  }

  function setValue(v) {
    value = v;
    grid.setValue(x,y,index,v);
    if (!grid.rendered)
      grid.render();
    else {
      var $tile = $('#tile-' + x + '-' + y);
      $tile.removeClass().addClass('tile tile-' + value);
    }
    return self;
  }

  function isPartOfTripleX() {
    var partOfTripleX = false,
        v = value;
    if (!v) return false;
    var l = Directions.Left, r = Directions.Right;
    partOfTripleX = 
      (move(l).value == v && move(l).move(l).value == v) ||
      (move(r).value == v && move(r).move(r).value == v) ||
      (move(l).value == v && move(r).value == v);
    return partOfTripleX;
  }
  
  function isPartOfTripleY() {
    var partOfTripleY = false,
        v = value;
    if (!v) return false;
    var u = Directions.Up, d = Directions.Down;
    partOfTripleY = 
      (move(u).value == v && move(u).move(u).value == v) ||
      (move(d).value == v && move(d).move(d).value == v) ||
      (move(u).value == v && move(d).value == v);
    return partOfTripleY;
  }

  function isPartOfTriple() {
    return partOfTripleX() || partOfTripleY();
  }

  function collect(hint) {
    if (value > 0) 
      return self;
    
    possibleValues = [1, 2];
    emptyRowPairWith = null;
    emptyColPairWith = null;

    // first pass is to check four doubles, in betweens, and 50/50 row/col spread
    for (var v = 1; v <= 2; v++) {
      var opp = v == 1? 2 : 1;

      // check doubles and in betweens
      for (var dir in Directions) {
        if (move(dir).value == v && move(dir).move(dir).value == v) {
          possibleValues = [opp];

          // set the hint
          if (hint && hint.active)
            hint.mark(self, v == 2? HintType.MaxTwoBlue : HintType.MaxTwoRed);

          return self;
        }
      }

      if ((move(Directions.Left).value == v && move(Directions.Right).value == v) ||  
          (move(Directions.Up).value == v && move(Directions.Down).value == v)) {
        possibleValues = [opp];

        // set the hint
        if (hint && hint.active)
          hint.mark(self, v == 2? HintType.MaxTwoBlue : HintType.MaxTwoRed);

        return self;
      }
    }

    // quick check for too many 1 or 2
    var rowInfo = grid.getRowInfo(y);
    if (rowInfo.nr1s >= grid.maxPerRow) {
      possibleValues = [2];
      if (hint && hint.active)
        hint.mark(self, HintType.RowMustBeBalanced);
      return self;
    }
    if (rowInfo.nr2s >= grid.maxPerRow) {
      possibleValues = [1];
      if (hint && hint.active)
        hint.mark(self, HintType.RowMustBeBalanced);
      return self;
    }
    if (rowInfo.nr0s == 2) {
      rowInfo.str.replace(reg0,function(m,i){
        if (i != self.x) 
          emptyRowPairWith = grid.tile(i,self.y);
      });
    }
    var colInfo = grid.getColInfo(x);
    if (colInfo.nr1s >= grid.maxPerCol) {
      possibleValues = [2];
      if (hint && hint.active)
        hint.mark(self, HintType.ColMustBeBalanced);
      return self;
    }
    if (colInfo.nr2s >= grid.maxPerCol) {
      possibleValues = [1];
      if (hint && hint.active)
        hint.mark(self, HintType.ColMustBeBalanced);
      return self;
    }
    if (colInfo.nr0s == 2) {
      colInfo.str.replace(reg0,function(m,i){
        if (i != self.y) 
          emptyColPairWith = grid.tile(self.x,i);
      });
    }

    return self;
  }

  function mark() {
    var $tile = $('#tile-' + x + '-' + y);
    $tile.addClass('marked');
    return self;
  }

  function unmark() {
    var $tile = $('#tile-' + x + '-' + y);
    $tile.removeClass('marked');
    return self;
  }

  this.right = right;
  this.left = left;
  this.up = up;
  this.down = down;
  this.move = move;
  this.clear = clear;
  this.collect = collect;
  this.mark = mark;
  this.unmark = unmark;
  this.isPartOfTripleX = isPartOfTripleX;
  this.isPartOfTripleY = isPartOfTripleY;
  this.isPartOfTriple = isPartOfTriple;

  this.__defineGetter__('value', function() { return value; })
  this.__defineSetter__('value', function(v) { return setValue(v); })
  this.__defineGetter__('isEmpty', function() { return value == 0; })
  this.__defineGetter__('possibleValues', function() { return possibleValues; })
  this.__defineSetter__('possibleValues', function(v) { possibleValues = v; })
  this.__defineGetter__('emptyRowPairWith', function() { return emptyRowPairWith; })
  this.__defineGetter__('emptyColPairWith', function() { return emptyColPairWith; })
}

function opposite(value) {
  switch(value) {
    case Directions.Right: return Directions.Left;
    case Directions.Left: return Directions.Right;
    case Directions.Up: return Directions.Down;
    case Directions.Down: return Directions.Up;
  }
  return null;
}