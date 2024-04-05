/* 
 * Grid
 * Contains a grid of Tiles and APIs to generate, clear, mark, etc.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function Grid(size, height, id) {
  var self = this,
      id = id || 'board';
      width = size,
      height = height || size,
      tiles = [],
      renderTOH = 0,
      noRender = false;
      emptyTile = new Tile(-99,self,-99),
      maxPerRow = Math.ceil(width/2),
      maxPerCol = Math.ceil(height/2),

      wreg = new RegExp('[12]{' + width + '}'),
      hreg = new RegExp('[12]{' + height + '}'),
      tripleReg = new RegExp('1{3}|2{3}'),
      count0reg = new RegExp('[^0]', 'g'),
      count1reg = new RegExp('[^1]', 'g'),
      count2reg = new RegExp('[^2]', 'g'),
      rendered = false,
      quality = 0,
      tileToSolve = null;

  var state = self.state = new State(this);
  var hint = self.hint = new Hint(this);

  function each(handler) {
    for (var i=0; i<tiles.length; i++) {
      var x = i%width,
          y = Math.floor(i/width),
          tile = tiles[i],
          result = handler.call(tile, x, y, i, tile);
      if (result)
        break;
    }
    return self;
  }

  function load(values, fullStateValues) {
    if (values) {
      width = height = Math.sqrt(values.length);
      if (fullStateValues)
        self.state.save('full', fullStateValues);
    }
    tiles = [];
    for (var i=0; i<width*height; i++) {
      var value = values? values[i] : 0;
      tiles[i] = new Tile(value, self, i);
    }
    render();
    return self;
  }

  function getIndex(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height)
      return -1;
    return y * width + x;
  }

  function render() {
  }

  function domRenderer(direct) {
    if (noRender) return;
    clearTimeout(renderTOH);
    if (!direct) {
      renderTOH = setTimeout(function() {domRenderer(true);}, 0);
      return;
    }
    if (Game.debug)
      console.log('rendering...')
    rendered = false;
    var html = '<table data-grid="' + id + '" id="grid" cellpadding=0 cellspacing=0>';
    for (var y=0; y<height; y++) {
      html += '<tr>';
      for (var x=0; x<width; x++) {
        var index = getIndex(x,y),
            tile = tiles[index],
            label = tile? ((tile.value > 0)? tile.value : '') : '';
        var odd = (x + (y % 2)) % 2;
        html += '<td data-x="'+x+'" data-y="'+y+'" class="' + (odd? 'even' : 'odd') + '"><div id="tile-' + x + '-' + y + '" class="tile tile-' + label + '"><div class="inner"></div></div></td>';
      }      
      html += '</tr>';
    }
    html += '</table>';
    $('#' + id).html(html);
    Game.resize();
    rendered = true;
    return self;
  }

  function getTile(x, y) {
    // if no y is specified, use x as interger
    if (isNaN(x)) return emptyTile;
    if (isNaN(y)) {
      var i = x;
      x = i % width,
      y = Math.floor(i / width);
    }
    if (x < 0 || x >= width || y < 0 || y >= height)
      return emptyTile;
    return tiles[getIndex(x,y)];
  }
  var tile = getTile; // other reference

  function clear() {
    each(function() { this.clear(); });
    return self;
  }

  function getEmptyTiles() {
    var emptyTiles = [];
    each(function() {
      if (this.isEmpty)
        emptyTiles.push(this);
    })
    return emptyTiles;
  }

  function generate() {
    var result = solve(true);
    self.state.save('full');
    return result;
  }

  function step(isGenerating) {
    return solve(isGenerating, true);
  }

  function ease(percentage) {
    var emptyTiles = getEmptyTiles(),
        easeCount = percentage? Math.floor((percentage / 100) * emptyTiles.length) : 1;
    if (!emptyTiles.length)
      return self;
    
    Utils.shuffle(emptyTiles);
    for (var i=0; i<easeCount; i++) {
      var tile = emptyTiles[i];
      tile.value = self.state.getValueForTile('full', tile.x, tile.y);
    }
    return self;
  }

  function solve(isGenerating, stepByStep) {
    var attempts = 0,
        tile,
        emptyTiles,
        pool = tiles;
    
    self.state.clear();
    noRender = true;

    // for stepByStep solving, randomize the pool
    if (isGenerating || stepByStep) {
      var pool = tiles.concat();
      Utils.shuffle(pool);
    }
    // if tileToSolve, put its row/col items first as they hugely increase time to solve tileToSolve
    if (tileToSolve) {
      var sameRow = [],
          sameCol = [],
          pool2 = [];
      each(function(x,y,i) { 
        if (x == tileToSolve.x)
          sameCol.push(this)
        else if (y == tileToSolve.y)
          sameRow.push(this)
        else 
          pool2.push(this);
      });
      // put all its row/col items first, then tileToSolve (again), then the rest
      pool = sameRow.concat(sameCol, [tileToSolve], pool2);
    }

    var totalAtt = width * height * 50;
    while (attempts++ < totalAtt) {
      emptyTiles = [];
      var tileChanged = false;

      // phase 1: try easy fixes while building a pool of remaining empty tiles
      for (var i=0; i<pool.length; i++) {
        tile = pool[i];
        if (!tile.isEmpty)
          continue
        var tileCanBeSolved = solveTile(tile);
        if (tileCanBeSolved) {
          if (hint.active)
            return;
          tileChanged = tile;
          break;
        }
        else {
          emptyTiles.push(tile);
        }
      }

      // when the broken tile was found, quickly return true!
      if (tileToSolve && tileChanged && tileToSolve.x == tileChanged.x && tileToSolve.y == tileChanged.y) {
        //console.log('quickwin!', attempts)
        return true;
      }

      // phase 2: no tile changed and empty ones left: pick random and try both values
      if (!tileChanged && emptyTiles.length && isGenerating) {
        tile = emptyTiles[0];
        // try both values
        var valueToTry = Utils.pick(tile.possibleValues);
        tile.value = valueToTry;
        self.state.push(tile); // mark this value as used
        if (!isValid()) {
          self.state.pop(tile);
          tile.value = valueToTry == 1? 2 : 1;
          self.state.push(tile);
          if (!isValid()) {
            self.state.pop(tile);
          }
        }

        continue;
      }

      // phase 3: push changed tile and check validity
      if (tileChanged) {
        self.state.push(tileChanged);
        if (!isValid()) {
          self.state.pop();
        }
      }
      // no tile changed and no empty tiles left? break the while loop!
      else
        break;

      if (stepByStep) {
        break; // step by step solving? quit
      }
    }

    //console.log(attempts, isGenerating == true)

    noRender = false;
    render();
    return getEmptyTiles().length == 0;
  }

  function generateFast() {
    var combos = [],
        tripleReg = new RegExp('0{3}|1{3}', 'g');

    noRender = true;
    
    function generateCombos() {
      for (var i=0,l=Math.pow(2,width); i<l; i++) {
        var c = Utils.padLeft((i).toString(2), width);
        if (c.match(tripleReg) ||
          (c.split(0).length-1) > maxPerRow || 
          (c.split(1).length-1) > maxPerRow)
          continue;
        combos.push(c);
      }
    }

    generateCombos();

    Utils.shuffle(combos);

    function clearRow(y) {
      for (var x=0; x<width; x++) {
        var tile = getTile(x, y);
        tile.clear();
      }
      var combo = comboUsed[y];
      if (combo) {
        combos.push(combo);
        delete comboUsed[y];
      }
    }
    
    var y = 0,
        comboUsed = [],
        attempts = Utils.fillArray(0,0,width);
    do {
      attempts[y]++;
      var combo = combos.shift();
      for (var x=0; x<width; x++) {
        var tile = getTile(x, y);
        tile.value = (combo.charAt(x) * 1) + 1;
      }
      if (isValid()) {
        comboUsed[y] = combo;
        y++;
      }
      else {
        combos.push(combo);
        clearRow(y);
        if (attempts[y] >= combos.length) {
          attempts[y] = 0;
          var clearFromY = 1;
          for (var y2 = clearFromY; y2 < y; y2++) {
            clearRow(y2);
            attempts[y2] = 0;
          }
          y = clearFromY;
        }
      }
    }
    while (y < height);
    self.state.save('full');
    noRender = false;
  }

  function solveTile(tile) {
    tile.collect(hint);

    // if the current tile already has a closed path with either value 1 or 0, consider the other one as single option
    if (self.state.currentState) {
      if (self.state.currentState[tile.id2])
        tile.possibleValues = [1];
      else if (self.state.currentState[tile.id1])
        tile.possibleValues = [2];
    }

    if (tile.possibleValues.length == 1) {
      
      if (hint.active)
        return true;

      // tile can be solved
      tile.value = tile.possibleValues[0];
      return true;
    }
    if (tile.emptyRowPairWith) {
      if (findCombo(tile, tile.emptyRowPairWith)) {
        
        // if we're looking for a hint, clear the tile and set the hint
        if (hint.active) {
          tile.clear();
          var hType = HintType.SinglePossibleRowCombo,
              doubleRowOrCol = [];
          if (hint.doubleColFound.length) {
            hType = HintType.ColsMustBeUnique;
            doubleRowOrCol = hint.doubleColFound;
          }
          else if (hint.doubleRowFound.length) {
            hType = HintType.RowsMustBeUnique;
            doubleRowOrCol = hint.doubleRowFound;
          }
          hint.mark(tile, hType, tile.emptyRowPairWith, doubleRowOrCol);
          return true;
        }

        // tile can be solved
        return true;
      }
    }
    if (tile.emptyColPairWith) {
      if (findCombo(tile, tile.emptyColPairWith)) {

        // if we're looking for a hint, clear the tile and set the hint
        if (hint.active) {
          tile.clear();
          var hType = HintType.SinglePossibleColCombo,
              doubleRowOrCol = [];
          if (hint.doubleColFound.length) {
            hType = HintType.ColsMustBeUnique;
            doubleRowOrCol = hint.doubleColFound;
          }
          else if (hint.doubleRowFound.length) {
            hType = HintType.RowsMustBeUnique;
            doubleRowOrCol = hint.doubleRowFound;
          }
          hint.mark(tile, hType, tile.emptyColPairWith, doubleRowOrCol);
          return true;
        }

        // tile can be solved
        return true;
      }
    }
    return false;
  }

  // finds a valid combo for tile1 and tile2 based on inverting an invalid attempt
  function findCombo(tile, tile2) {
    // see if we're checking a row or column
    for (var valueForTile1 = 1; valueForTile1 <= 2; valueForTile1++) {
      tile.value = valueForTile1;
      tile2.value = valueForTile1==1?2:1;
      if (!isValid()) {
        // only fill out a single tile (the first), which makes backtracking easier
        tile.value = valueForTile1==1?2:1;
        tile2.clear();
        return true;
      }
    }
    tile.clear();
    tile2.clear();
    return false;
  }

  // gridInfo section is for speeding up isValid method
  var gridInfo = {
    cols: [],
    rows: [],
    colInfo: [],
    rowInfo: []
  }
  for (var i=0; i<width; i++) {
    gridInfo.cols[i] = Utils.fillArray(0,0,height);
    gridInfo.rows[i] = Utils.fillArray(0,0,width);
  }

  // used for keeping row/col info, and erasing their string representations upon a value change
  function setValue(x,y,i,v) {
    gridInfo.cols[x][y] = v;
    gridInfo.rows[y][x] = v;
    gridInfo.colInfo[x] = 0;
    gridInfo.rowInfo[y] = 0;
  }

  function getColInfo(i) {
    var info = gridInfo.colInfo[i];
    if (!info) {
      var str = gridInfo.cols[i].join('');
      info = gridInfo.colInfo[i] = {
        str: str,
        nr0s: str.replace(count0reg,'').length, 
        nr1s: str.replace(count1reg,'').length, 
        //nr2s: str.replace(count2reg,'').length, 
        hasTriple: tripleReg.test(str),
        //isFull: !/0/.test(str)
      }
      info.isFull = info.nr0s == 0;
      info.nr2s = height - info.nr0s - info.nr1s;
      info.isInvalid = info.nr1s > maxPerRow || info.nr2s > maxPerRow || info.hasTriple; 
    }
    return info;
  }

  function getRowInfo(i) {
    var info = gridInfo.rowInfo[i];
    if (!info) {
      var str = gridInfo.rows[i].join('');
      info = gridInfo.rowInfo[i] = {
        str: str,
        nr0s: str.replace(count0reg,'').length, 
        nr1s: str.replace(count1reg,'').length, 
        //nr2s: str.replace(count2reg,'').length, 
        hasTriple: tripleReg.test(str)
        //isFull: !/0/.test(str)
      }
      info.isFull = info.nr0s == 0;
      info.nr2s = width - info.nr0s - info.nr1s;
      info.isInvalid = info.nr1s > maxPerRow || info.nr2s > maxPerRow || info.hasTriple; 
    }
    return info;
  }

  // not a full isValid check, only checks for balanced spread of 0's and 1's
  function isValid() {
    hint.doubleColFound = [];
    hint.doubleRowFound = [];

    var rows = {},
        cols = {};
    for (var i=0; i<width; i++) {
      var info = getColInfo(i);
      // if too many 1's or 2's found, or three in a row, leave
      if (info.isInvalid)
        return false;
      // if no empty tiles found, see if it's double
      if (info.isFull) {
        if (cols[info.str]) {

          info.unique = false;

          if (hint.active)
            hint.doubleColFound.push(cols[info.str]-1, i);
          return false;
        }
        else {
          info.unique = true;
          cols[info.str] = i + 1;
        }
      }

      var info = getRowInfo(i);
      // if too many 1's or 2's found, or three in a row, leave
      if (info.isInvalid)
        return false;
      // if no empty tiles found, see if it's double
      if (info.isFull) {
        if (rows[info.str]) {

          info.unique = false;

          if (hint.active)
            hint.doubleRowFound.push(rows[info.str]-1, i);
          return false;
        }
        else {
          info.unique = true;
          rows[info.str] = i + 1;
        }
      }
    }

    return true;
  }

  function breakDownSimple() {
    var tile,
        pool = tiles.concat(),
        i = 0;

    Utils.shuffle(pool);
    var remainingTiles = [];

    while (i < pool.length) {
      tile = pool[i++];
      var prevValue = tile.value;
      tile.clear();
      // if only this one cleared tile cannot be solved
      if (!solveTile(tile)) {
        // restore its value
        tile.value = prevValue;
        remainingTiles.push(tile);
      } else {
        tile.clear();
      }
    }
    quality = Math.round(100 * (getEmptyTiles().length / (width * height)));
    return remainingTiles;
  }
  
  function breakDown(remainingTiles) {
    var attempts = 0,
        tile,
        pool = remainingTiles || tiles.concat();

    tileToSolve = null;
    self.state.clear();
    //State.save('full');

    //console.log('items to solve', pool.length)

    if (!remainingTiles)
      Utils.shuffle(pool); // not shuffling increases quality!

    var i=0;
    while (i < pool.length && attempts++ < 6) {
      tile = pool[i++];
      tileToSolve = tile;
      var clearedTile = tile,
          clearedTileValue = tile.value; 
      tile.clear();
      self.state.save('breakdown');
      //console.log('save breakdown')
      if (solve()) {
        self.state.restore('breakdown');
        attempts = 0;
      } else {
        self.state.restore('breakdown');
        clearedTile.value = clearedTileValue;
      }
    }
    tileToSolve = null;
    self.state.save('empty');
    quality = Math.round(100 * (getEmptyTiles().length / (width * height)));

    // mark remaining tiles as system
    each(function() {
      if (!this.isEmpty)
        this.system = true;
    })
  }

  function markRow(y) {
    for (var x=0; x<width; x++)
      tile(x,y).mark();
    return self;
  }
  
  function unmarkRow(y) {
    for (var x=0; x<width; x++)
      tile(x,y).unmark();
    return self;
  }

  function markCol(x) {
    for (var y=0; y<height; y++)
      tile(x,y).mark();
    return self;
  }
  
  function unmarkCol(x) {
    for (var y=0; y<height; y++)
      tile(x,y).unmark();
    return self;
  }

  function unmark(x, y) {
    if (typeof x == 'number' && typeof y == 'number') {
      tile(x,y).unmark();
      return self;
    }
    for (var y=0; y<height; y++)
      for (var x=0; x<width; x++)
        tile(x,y).unmark();
    return self;
  }

  function mark(x, y) {
    tile(x,y).mark();
    return self;
  }

  function getWrongTiles() {
    var wrongTiles = [];
    each(function(x,y,i,tile){
      var currentValue = tile.value,
          okValue = self.state.getValueForTile('full',x,y);
      if (currentValue > 0 && currentValue != okValue)
        wrongTiles.push(tile);
    })
    return wrongTiles;
  }

  function getValues() {
    var values = [];
    each(function(){ values.push(this.value)});
    return values;
  }


  this.each = each;
  this.render = render;
  this.getIndex = getIndex;
  this.tile = tile;
  this.generate = generate;
  this.generateFast = generateFast;
  this.breakDown = breakDown;
  this.breakDownSimple = breakDownSimple;
  this.clear = clear;
  this.load = load;
  this.solve = solve;
  this.step = step;
  this.isValid = isValid;
  this.ease = ease;
  this.size = size;
  this.markRow = markRow;
  this.unmarkRow = unmarkRow;
  this.markCol = markCol;
  this.unmarkCol = unmarkCol;
  this.mark = mark;
  this.unmark = unmark;
  this.getValues = getValues;
  this.setValue = setValue;
  this.getColInfo = getColInfo;
  this.getRowInfo = getRowInfo;

  this.activateDomRenderer = function() {
    render = this.render = domRenderer;
    noRender = false;
  }

  this.__defineGetter__('tiles', function() { return tiles; })
  this.__defineGetter__('width', function() { return width; })
  this.__defineGetter__('height', function() { return height; })
  this.__defineGetter__('emptyTileCount', function() { return getEmptyTiles().length; })
  this.__defineGetter__('emptyTiles', function() { return getEmptyTiles(); })
  this.__defineGetter__('wrongTiles', function() { return getWrongTiles(); })
  this.__defineGetter__('rendered', function() { return rendered; })
  this.__defineGetter__('id', function() { return id; })
  this.__defineGetter__('quality', function() { return quality; })
  this.__defineGetter__('info', function() { return gridInfo; })
  this.__defineGetter__('maxPerRow', function() { return maxPerRow; })
  this.__defineGetter__('maxPerCol', function() { return maxPerCol; })
  this.__defineGetter__('hint', function() { return hint; })

  load();
}

//static creator
Grid.generate = function(size) {
  var grid,
      attempts = 0;
  do {
    grid = new Grid(size);
    grid.generate();
  }
  while (grid.emptyTileCount > 0 && attempts++ < 1)
  return grid;
}