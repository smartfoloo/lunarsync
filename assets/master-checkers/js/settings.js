var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 1920;

var EDGEBOARD_X = 190;
var EDGEBOARD_Y = 220;

var FPS_TIME      = 1000/24;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "arialrounded";

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var MODE_HUMAN     = 0;
var MODE_COMPUTER  = 1;

var EASY_MODE = 0;
var MEDIUM_MODE = 1;
var HARD_MODE = 2;

var BOARD8 = 0;

var NUM_CELL = 8;
var TOT_CELL = 64;      
var BOARD_LENGTH  = 815;
var CELL_LENGTH   = BOARD_LENGTH/NUM_CELL;

var BG_BLACK = 0;
var BG_WHITE = 1;

var DRAW = -1;
var WIN_WHITE = 0;
var WIN_BLACK = 1;
var WIN_WHITE_BLACK_NOMOVES = 2;
var WIN_BLACK_WHITE_NOMOVES = 3;


var PAWN_WHITE = 0;
var PAWN_BLACK = 1;
var KING_WHITE = 2;
var KING_BLACK = 3;
var PAWN_NULL = -1;

var PAWN_STOP = -1;
var PAWN_MOVE = 0;
var PAWN_EAT = 1;

var ALERT_TYPE_NOMOVES = 0;
var ALERT_TYPE_STALL = 1;

var PAWN_SIZE     = 100;

var TIME_MOVE = 500;

var TIME_LOOP_WAIT = 1000;
var MIN_AI_THINKING   = 1000;
var MAX_AI_THINKING   = 1500;

var SEARCH_DEPTH = 4;
var DRAW_COUNTER = 40;


var ENABLE_CHECK_ORIENTATION;
var ENABLE_FULLSCREEN;