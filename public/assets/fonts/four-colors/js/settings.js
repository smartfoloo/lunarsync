var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = 1080;

var EDGEBOARD_X = 256;
var EDGEBOARD_Y = 84;

var PRIMARY_FONT = "comfortaabold";

var FPS           = 30;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;
var ENABLE_FULLSCREEN = true;


var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;
var STATE_SELECT_PLAYERS = 4;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;
var ON_CARD_DEALED = 6;

var ENABLE_CHECK_ORIENTATION;
var ENABLE_FULLSCREEN;

var AD_SHOW_COUNTER;

var NUM_PLAYERS; 
var STARTING_NUM_CARDS;

var CARD_WIDTH = 156;
var CARD_HEIGHT = 242;

var aHandPos = new Array();
aHandPos["num_player_2"] = [{x:(CANVAS_WIDTH/2), y: (CANVAS_HEIGHT/2)+350},{x:(CANVAS_WIDTH/2), y: (CANVAS_HEIGHT/2)-350}];
aHandPos["num_player_3"] = [{x:(CANVAS_WIDTH/2), y: (CANVAS_HEIGHT/2)+350},{x:(CANVAS_WIDTH/2)-650, y: (CANVAS_HEIGHT/2)-40},{x:(CANVAS_WIDTH/2)+650, y: (CANVAS_HEIGHT/2)}];
aHandPos["num_player_4"] =  [{x:(CANVAS_WIDTH/2), y: (CANVAS_HEIGHT/2)+350},{x:(CANVAS_WIDTH/2)-650, y: (CANVAS_HEIGHT/2)-40},{x:(CANVAS_WIDTH/2), y: (CANVAS_HEIGHT/2)-350},{x:(CANVAS_WIDTH/2)+650, y: (CANVAS_HEIGHT/2)-40}];;

