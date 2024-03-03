/* 
 * State
 * API for pushing and popping the game state and closing unavailable paths while generating.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function State(grid) {
	var self = this,
			saveSlots = {},

			stateStack,
			currentState;

  this.grid = grid;

  function clear() {
  	stateStack = {};
  	currentState = stateStack;
  }

  // adds the changed tile to the stack
  function push(tile) {
  	var id = tile.value == 1? tile.id1 : tile.id2;
  	var newState = { 'parent': currentState, tile: tile };
  	// add the new state on top of the current
  	currentState[id] = newState;
  	// for this specific tile, count how many values have been tried
  	if (currentState[tile.id])
  		currentState[tile.id]++
  	else
  		currentState[tile.id] = 1;
  	currentState = newState;
  }

  function pop() {
  	do {
  		// clear the working on tile
	  	var tile = currentState.tile;
	  	tile.clear();
	  	currentState = currentState.parent;
  	}
  	while (currentState && currentState[tile.id] == 2)
  }

  function save(saveId, values) {
    saveId = saveId || '1';
    var slot = { id: saveId, values: [], restoreCount: 0 };
    if (values) {
      for (var i=0; i<values.length; i++)
        slot.values.push(values[i])
    }
    else {
      for (var i=0; i<self.grid.tiles.length; i++)
        slot.values.push(self.grid.tiles[i].value);
    }
    saveSlots[saveId] = slot;
    return self;
  }

  function restore(saveId) {
    saveId = saveId || '1';
    var slot = saveSlots[saveId];
    slot.restoreCount++;
    for (var i=0; i<slot.values.length; i++)
      self.grid.tiles[i].value = slot.values[i];
    return self;
  }

  function getValueForTile(saveId, x, y) {
    var slot = saveSlots[saveId];
    if (!slot) 
    	return -1;
    if (isNaN(y)) {
    	var i = x,
      		x = i % self.grid.width,
      		y = Math.floor(i / self.grid.width);
    }
    return slot.values[y * self.grid.width + x];
  }

  this.clear = clear;
  this.save = save;
  this.restore = restore;
  this.push = push;
  this.pop = pop;
  this.getValueForTile = getValueForTile;
  this.__defineGetter__('currentState', function() { return currentState; })
}