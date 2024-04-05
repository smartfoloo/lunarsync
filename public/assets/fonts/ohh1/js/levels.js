/* 
 * Levels
 * Stores 2 generated puzzles per size for quick loading on slower devices.
 * Combined with BackgroundService's web worker approach, this brings the loading time down.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
var Levels = new (function(){
  var self = this,
      puzzles = { size4: [], size6: [], size8: [], size10: [] },
      qualityThreshold = {
        4: 60,
        6: 60,
        8: 60,
        10: 60
      };
  
  // indicates the user completed a puzzle of given size
  function finishedSize(size) {
    var puzzleArr = puzzles['size' + size];
    if (!puzzleArr || !puzzleArr.length)
      return;
    // remove the first puzzle
    puzzleArr.shift();
    // see if we can generate a (few) new one(s)
    BackgroundService.kick();
  }

  // puzzle is object with format { size:6, full:[2,1,...], empty:[0,0,2,...], quality: 76, ms: 42 }
  function addSize(size, puzzle) {
    var puzzleArr = puzzles['size' + size];
    if (!puzzleArr) 
      return false;
    puzzleArr.push(puzzle);
    BackgroundService.kick();
  }

  function hasPuzzleAvailable(size) {
    var puzzleArr = puzzles['size' + size];
    if (!puzzleArr || !puzzleArr.length) 
      return false;
    return true;
  }

  function getSize(size) {
    var puzzleArr = puzzles['size' + size];
    if (!puzzleArr || !puzzleArr.length) {
      return create(size);
    }

    var puzzle = puzzleArr[0];
    // if we have enough puzzles, generate a new one for the next time the user plays
    if (puzzleArr.length > 1) {
      puzzleArr.shift();
      BackgroundService.kick();
    }
    return puzzle;
  }

  function needs() {
    for (var checkForLength=1; checkForLength<=2; checkForLength++) {
      for (var size in qualityThreshold) {
        size = size * 1;
        var arr = puzzles['size' + size];
        if (arr.length < checkForLength) {
          return size;
        }
      }
    }
    return false;
  }

  function create(size) {
    var grid = new Grid(size),
        attempts = 0;

    var puzzle = {
      size: size,
      full: [],
      empty: [],
      quality: 0,
      ms: 0
    }

    var d = new Date();
    grid.clear();
    grid.generateFast();
    puzzle.full = grid.getValues();

    // quality control makes sure grids get proper 
    do {
      if (attempts > 0) {
        grid.clear();
        grid.state.restore('full')
      }
      grid.breakDown();
      puzzle.quality = grid.quality;
    }
    while (puzzle.quality < qualityThreshold[size] && attempts++ < 42);

    puzzle.empty = grid.getValues();
    puzzle.ms = new Date() - d;
    puzzle.quality = quality;

    return puzzle;
  }

  this.hasPuzzleAvailable = hasPuzzleAvailable;
  this.finishedSize = finishedSize;
  this.addSize = addSize;
  this.getSize = getSize;
  this.create = create;
  this.needs = needs;
  this.__defineGetter__('puzzles', function() { return puzzles; });

})();