/* 
 * Game
 * The main 0h h1 game, a singleton object in global scope.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
var Game = new (function() {
  var self = this,
      debug = Config.debug,
      tweet = Config.tweet,
      startedTutorial = false,
      grid,
      sizes = [4,6,8,10],
      lastSize = 0,
      currentPuzzle = null,
      checkTOH = 0,
      ojoos = ['Wonderful','Spectacular','Marvelous','Outstanding','Remarkable','Shazam','Impressive','Great','Well done','Fabulous','Clever','Dazzling','Fantastic','Excellent','Nice','Super','Awesome','Ojoo','Brilliant','Splendid','Exceptional','Magnificent','Yay'],
      remainingOjoos = [],
      endGameTOH1,
      endGameTOH2,
      endGameTOH3,
      onHomeScreen = true,
      undoStack = [],
      undone = false,
      gameEnded = false;

  function init() {
    $('#scorenr').html(getScore());
    $('#tweeturl').hide();
    
    if (Utils.isTouch())
      $('html').addClass('touch');
    
    $('[data-size]').each(function(i,el){
      var $el = $(el),
          size = $el.attr('data-size') * 1,
          label = sizes[size - 1];
      $el.html(label)
      $el.on('touchstart mousedown', function(evt){
        if (Utils.isDoubleTapBug(evt)) return false;
        var size = sizes[$(evt.target).closest('[data-size]').attr('data-size') * 1 - 1];
        loadGame(size);
      })
    })
    resize();
    $(window).on('resize', resize);
    $(window).on('orientationchange', resize);

    showTitleScreen();
    resize();
    
    var colors = ['#a7327c', '#c24b31', '#c0cd31']
    Utils.setColorScheme(colors[1]);
  }

  function start() {
    // kick in the bgservice in a few ms (fixes non-working iOS5)
    setTimeout(function() {
      BackgroundService.kick();
    }, 100);
    if (debug) {
      addEventListeners();
      showMenu();
      return;
    }
    setTimeout(function(){$('.hide0').removeClass('hide0')}, 300);
    setTimeout(function(){$('.hide1').removeClass('hide1')}, 1300);
    setTimeout(function(){$('.show01').removeClass('hidehs')}, 2300);
    setTimeout(function(){$('.show01').removeClass('show01').addClass('hidehs'); addEventListeners();}, 4200);
  }

  function resize() {
    var desired = {
          width: 320,
          height: 480
        },
        aspectRatio = desired.width / desired.height,
        viewport = {
          width: $('#feelsize').width(),
          height: $('#feelsize').height()
        },
        sizeToWidth = ((viewport.width / viewport.height) < aspectRatio)

    var box = {
      width: Math.floor(sizeToWidth? viewport.width : (viewport.height/desired.height) * desired.width),
      height: Math.floor(sizeToWidth? (viewport.width/desired.width) * desired.height : viewport.height)
    }

    $('#container').css({'width': box.width + 'px', 'height': box.height + 'px'});

    var containerSize = box.width;

    $('h1').css('font-size', Math.round(containerSize * .24) + 'px')
    $('h2').css('font-size', Math.round(containerSize * .18) + 'px')
    $('h3').css('font-size', Math.round(containerSize * .15) + 'px')
    $('p').css('font-size', Math.round(containerSize * .07) + 'px')
    $('#menu h2').css('font-size', Math.round(containerSize * .24) + 'px')
    $('#menu p').css('font-size', Math.round(containerSize * .1) + 'px')
    $('#menu p').css('padding', Math.round(containerSize * .05) + 'px 0')
    $('#menu p').css('line-height', Math.round(containerSize * .1) + 'px')
    var scoreSize = Math.round(containerSize * .1);
    $('#score').css({'font-size': scoreSize + 'px', 'line-height': (scoreSize * 0.85) + 'px', 'height': scoreSize + 'px'});

    var iconSize = Math.floor((22/320) * containerSize);
    $('.icon').css({width:iconSize,height:iconSize,marginLeft:iconSize,marginRight:iconSize});

    $('.board table').each(function(i,el){
      var $el = $(el),
          id = $el.attr('data-grid'),
          w = $el.width(),
          size = $el.find('tr').first().children('td').length;
      
      var tileSize = Math.floor(w / size);
      
      if (!tileSize) return;

      $el.find('.tile').css({width:tileSize,height:tileSize,'line-height':Math.round(tileSize * 0.85) + 'px','font-size':Math.round(tileSize * 0.5) + 'px'});
      var radius = Math.round(tileSize * 0.1);
      var radiusCss = '#' + id + ' .tile .inner { border-radius: ' + radius + 'px; }' +
        '#' + id + ' .tile-1 .inner:after, #' + id + ' .tile-2 .inner:after { border-radius: ' + radius + 'px; }';
      
      Utils.createCSS(radiusCss, id + 'radius');
      Utils.createCSS('.tile.marked .inner { border-width: ' + Math.floor(tileSize / 24)+ 'px }', 'tileSize');
    });
    $('#digits').width($('#titlegrid table').width()).height($('#titlegrid table').height())
    $('#digits').css({'line-height':Math.round($('#titlegrid table').height() * 0.92) + 'px','font-size':$('#titlegrid table').height() * .5 + 'px'});

    var topVSpace = Math.floor($('#container').height() / 2 - $('#board').height() / 2);
    $('#hintMsg').height(topVSpace + 'px');
  }

  function showTitleScreen() {
    onHomeScreen = true;
    $('.screen').hide().removeClass('show');
    $('#title').show();
    setTimeout(function() { $('#title').addClass('show'); },0);
  }

  function showGame() {
    onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#game').show();
    setTimeout(function() { $('#game').addClass('show'); },0);
    resize();
  }

  function showMenu() {
    onHomeScreen = true;
    clearTimeouts();
    $('.screen').hide().removeClass('show');
    $('#menu').show();
    $('#scorenr').html(getScore());
    setTimeout(function() { $('#menu').addClass('show'); },0);
    resize();
  }

  function showAbout() {
    onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#about').show();
    setTimeout(function() { $('#about').addClass('show'); },0);
    resize();
  }

  function showSizes() {
    onHomeScreen = false;
    showGame();
    $('#boardsize').html('<span>Select a size</span>');
    $('#menugrid').removeClass('hidden');
    $('#board').addClass('hidden');
    $('#bar [data-action]').not('[data-action="back"]').hide();
    $('#board').addClass('hidden');
    $('#score').show();
    setTimeout(function() {
      if (grid) grid.clear();
      $('#score').addClass('show');
    },0);
  }

  function showLoad() {
    onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#loading').show();
    setTimeout(function() { $('#loading').addClass('show'); },0);
  }
  
  function loadGame(size) {
    onHomeScreen = false;
    $('#game').removeClass('show')
    showLoad();
    resize();
    
    // don't show a loading screen if we have a puzzle ready
    if (Levels.hasPuzzleAvailable(size)) {
      setTimeout(function() {
        startGame(Levels.getSize(size));
      },100);
      return;
    }

    setTimeout(function() {
      var puzzle = Levels.getSize(size);
      startGame(puzzle);
    }, 100);
  }

  // puzzle is object with format { size:6, full:[2,1,...], empty:[0,0,2,...], quality: 76, ms: 42 }
  function startGame(puzzle) {
    onHomeScreen = false;
    if (!puzzle || !puzzle.size || !puzzle.full)
      throw 'no proper puzzle object received'
    
    //console.log(puzzle);
    clearTimeouts();
    if (window.STOPPED) return;
    startedTutorial = false;
    $('#undo').closest('.iconcon').css('display', 'inline-block');
    $('#menugrid').addClass('hidden');
    $('#board').removeClass('hidden');
    $('#bar [data-action]').show();
    $('#tweeturl').hide();
    $('#chooseSize').removeClass('show');
    $('#score').removeClass('show').hide();
    $('#bar [data-action="help"]').removeClass('hidden wiggle');
    $('#boardsize').html('<span>' + puzzle.size + ' x ' + puzzle.size + '</span>');
    grid = new Grid(puzzle.size, puzzle.size);
    lastSize = puzzle.size;

    grid.load(puzzle.empty, puzzle.full);
    // set system tiles manually
    grid.each(function(){
      this.value = this.value; // yes, do so
      if (this.value > 0)
        this.system = true;
    });
    grid.state.save('empty');


    currentPuzzle = puzzle;
    grid.hint.active = true;
    grid.activateDomRenderer();
    grid.render();
    undoStack = [];
    undone = false;
    gameEnded = false;

    setTimeout(showGame, 0);
  }

  function endGame() {
    // first of all, save the score, so if you quit while the animation runs, the score is kept
    var oldScore = getScore(),
        newScore = setScore(grid.width * grid.height);

    grid.unmark();
    grid.hint.hide();
    grid.hint.active = false;
    var ojoo = getOjoo() + '!';
    $('#boardsize').html('<span>' + ojoo + '</span>');
    grid.each(function() { this.system = true; });
    $('#bar [data-action]').not('[data-action="back"]').hide();

    endGameTOH3 = setTimeout(function(){
      $('#grid .tile').addClass('completed');
      endGameTOH1 = setTimeout(function() {
        $('#board').addClass('hidden');
        endGameTOH2 = setTimeout(function() {
          gameEnded = true;
          $('#menugrid').removeClass('hidden');
          $('#chooseSize').addClass('show');
          $('#score').show();

          // animate the score visually from its old value to the new one
          if (!startedTutorial) {
            if (newScore > oldScore) {
              animateScore(oldScore, newScore);
              if (tweet && !currentPuzzle.isTutorial) {
                updateTweetUrl(currentPuzzle.size);
                $('#tweeturl').show();
              }
            }
          }

          setTimeout(function() { $('#score').addClass('show');}, 0);

        }, 50);
      }, 2000);
    }, 1200);

    // shift
    if (!currentPuzzle.isTutorial)
      Levels.finishedSize(grid.width);
  }

  function quitCurrentGame() {
    gameEnded = true;
    if (grid) {
      grid.unmark();
      grid.hint.hide();
      grid.hint.active = false;
      grid.each(function() { this.system = true; });
    }
    showSizes();
  }

  function addEventListeners() {
    document.addEventListener("backbutton", backButtonPressed, false);

    $(document).on('keydown', function(evt){
      if (evt.keyCode == 27 /* escape */) { backButtonPressed(); return false; }
      if (evt.keyCode == 32 /* space */) { doAction('help'); return false; }
      if (evt.keyCode == 90 /* Z */ && (evt.metaKey || evt.ctrlKey)) {
        doAction('undo');
        return false;
      }
    });
    $(document).on('touchend mouseup', click);
    $(document).on('touchstart mousedown', '#grid td', function(e) {
      if (Utils.isDoubleTapBug(e)) return false;
      var $el = $(e.target).closest('td'),
          x = $el.attr('data-x') * 1,
          y = $el.attr('data-y') * 1,
          tile = grid.tile(x, y);

      clearTimeout(checkTOH);

      if (tile.system) {
        var $tile = $el.find('.tile');
        $tile.addClass('error');
        setTimeout(function() {
          $tile.removeClass('error');
        }, 500);
        return false;
      }
      
      if (Tutorial.active) {
        Tutorial.tapTile(tile);
        return false;
      }
      
      if (grid && grid.hint)
        grid.hint.clear();

      // create new undo
      var undoState = [tile, tile.value, new Date()];
      if (undoStack.length) {
        // check if the last state was done a few ms ago, then consider it as one change
        var lastState = undoStack[undoStack.length - 1],
            lastTile = lastState[0],
            lastChange = lastState[2];
        if (lastTile.id != tile.id || (new Date() - lastChange > 500))
          undoStack.push(undoState);
      } 
      else
        undoStack.push(undoState);

      if (tile.isEmpty)
        tile.value = 1;
      else if (tile.value == 1)
        tile.value = 2;
      else
        tile.clear();

      if (tile.value > 0)
        checkTOH = setTimeout(function(){checkForLevelComplete();}, 700);
      return false;
    });
  }

  function click(evt) {
    if (Utils.isDoubleTapBug(evt)) return false;
    var $el = $(evt.target).closest('*[data-action]'),
        action = $(evt.target).closest('*[data-action]').attr('data-action'),
        value = $el.attr('data-value');
    if (action) {
      doAction(action, value);
      return false;
    }
  }

  function doAction(action, value) {
    switch (action) {
      case 'close-titleScreen':
        if (!tutorialPlayed())
          startTutorial();
        else
          showMenu();
        break;
      case 'show-menu':
        clearTimeout(checkTOH);
        Tutorial.end();
        if (grid)
          grid.hint.clear();
        showMenu();
        break;
      case 'back':
        if (gameEnded) 
          return doAction('show-menu');
        clearTimeout(checkTOH);
        Tutorial.end();
        quitCurrentGame();
        break;
      case 'next':
        clearTimeout(checkTOH);
        Tutorial.end();
        if (grid)
          grid.hint.clear();
        loadGame(lastSize);
        break;
      case 'undo':
        if (!gameEnded)
          undo();
        break;
      case 'retry':
        clearTimeout(checkTOH);
        $('#game').removeClass('show')
        if (Tutorial.active || currentPuzzle.isTutorial) {
          setTimeout(function(){
            Tutorial.start();
          }, 300);
          return;
        }
        setTimeout(function(){
          startGame(currentPuzzle);
        }, 300);
        //grid.hint.clear();
        //grid.each(function() { this.system = true;});

        //grid.state.restore('empty');
        break;
      case 'help':
        if (gameEnded) 
          break;
        clearTimeout(checkTOH);
        if (Tutorial.active && !Tutorial.hintAllowed())
          return;
        if (grid.hint.visible)
          grid.hint.clear();
        else {
          grid.hint.clear();
          grid.hint.next();
        }
        break;
      case 'play':
        showSizes();
        break;
      case 'tutorial':
        startTutorial();
        break;
      case 'about':
        showAbout();
        break;
    }
  }

  function checkForLevelComplete() {
    if (grid.emptyTileCount > 0)
      return;

    if (grid.wrongTiles.length > 0) {
      grid.hint.next();
      return;
    }

    endGame();
  }

  function tutorialPlayed() {
    if (!window.localStorage) return true;
    return (window.localStorage.getItem('tutorialPlayed') + '') == 'true';
  }

  function markTutorialAsPlayed() {
    if (!window.localStorage) return;
    window.localStorage.setItem('tutorialPlayed', true);
  }

  function startTutorial() {
    onHomeScreen = false;
    Tutorial.start();
    // set flag to not get points for the tutorial...
    startedTutorial = true;
    // ... except when this is the first time
    if (!tutorialPlayed())
      startedTutorial = false;

    markTutorialAsPlayed();
    $('#undo').closest('.iconcon').css('display', 'none');
  }

  function backButtonPressed() {
    if (onHomeScreen)
      navigator.app.exitApp()
    else 
      doAction('back');
  }

  function getOjoo() {
    if (!remainingOjoos.length)
      remainingOjoos = Utils.shuffle(ojoos.slice(0));
    return Utils.draw(remainingOjoos);
  }

  function getScore() {
    return (window.localStorage.getItem('score') * 1);
  }

  function setScore(addPoints) {
    clearTimeout(setScore.TOH)
    var curScore = score = getScore(),
        newScore = curScore + (addPoints? addPoints : 0);
    if (newScore <= curScore) 
      return curScore;

    window.localStorage.setItem('score', newScore);
    return newScore;
  }

  function animateScore(curScore, newScore) {
    var delay = 500 / (newScore - curScore);
    next();

    function next() {
      $('#scorenr').html(curScore);
      if (curScore < newScore)
        curScore++;
      setScore.TOH = setTimeout(next, delay)
    }
  }

  function undo() {
    if (!undoStack.length) {
      if (grid.hint.visible) {
        grid.unmark();
        grid.hint.hide();
        return;
      }
      if (!undone)
        grid.hint.show('That\'s the undo button.');
      else
        grid.hint.show('Nothing to undo.');
      return;
    }
    var undoState = undoStack.pop(),
        tile = undoState[0],
        value = undoState[1];
    grid.unmark();
    if (value >= 0) {
      tile.value = value;
    } else {
      tile.clear();
    }
    tile.mark();
    var s = 'This tile was reversed to ';
    if (value == 1) s += 'red.';
    if (value == 2) s += 'blue.';
    if (value == 0) s += 'its empty state.'
    grid.hint.show(s);
    undone = true;
    clearTimeout(checkTOH);
    checkTOH = setTimeout(function(){checkForLevelComplete();}, 700);
  }

  function clearTimeouts() {
    clearTimeout(endGameTOH1);
    clearTimeout(endGameTOH2);
    clearTimeout(endGameTOH3);
  }

  function updateTweetUrl(size) {
    var msg = '#0hh1 I just completed a ' + size + ' x ' + size + ' puzzle and my score is ' + getScore() + '.',
        url = 'https://twitter.com/share?text=' + encodeURIComponent(msg);
    $('#tweeturl').attr('href', url);
  }

  //this.setScore = setScore;

  this.start = start;
  this.init = init;
  this.startGame = startGame;
  this.showTitleScreen = showTitleScreen;
  this.showGame = showGame;
  this.showMenu = showMenu;
  this.resize = resize;
  this.showAbout = showAbout;
  this.startTutorial = startTutorial;
  this.checkForLevelComplete = checkForLevelComplete;
  this.undo = undo;
  
  window.__defineGetter__('tile', function() { return grid.tile; });
  this.__defineGetter__('grid', function() { return grid; });
  this.__defineGetter__('debug', function() { return debug; });
})();
