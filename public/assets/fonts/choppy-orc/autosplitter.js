window.autosplitter = {};
var wrs = ["3.09", "2.75", "4.13", "3.45", "2.22", "4.87", "6.30", "3.97", "4.65", "5.72", "4.05", "3.97", "10.53", "6.05", "2.78"];

var oneChestLevels = [2, 3, 5, 8, 11, 13, 14, 15];

var levelCookie = "level_stats";

function getStats() {
    var name = levelCookie + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    var stats = [];
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return [];
}

function registerLevelReset(level_code) {
    var stats = getStats();
    stats[level_code - 1] = (stats[level_code - 1] || 0) + 1;
    document.cookie = levelCookie + "=" + JSON.stringify(stats);
}

window.stats = function() {
    var stats = getStats();
    for (i = 1; i <= 15; i++) {
        console.log("Level " + i + ": " + (stats[i - 1] || 0) + " run resets.");
    }
    console.log((stats[15] || 0) + " game finishes.");
}


function chestsInLevel(num) {
    return oneChestLevels.includes(num) ? 1 : 2;
}

var state = {
    hasReset: false,
    previousTime: null,
    lastTime: null,
    damselTime: NaN,
    level: NaN,
    menu: true,
    damselCount: 0,
    levelStart: null
}

function showTime() {
    return ((state.lastTime - state.levelStart) / 1000).toFixed(2);
}

window.autosplitter.onSound = function (sound) {
    // console.log(sound);
    if (sound == "damsel") {
        state.damselTime = state.lastTime;
        state.damselCount += 1;
        // console.log("chest " + state.damselCount + " at " + showTime());
    }
}

window.autosplitter.onScene = function (name) {
    var previousState = JSON.parse(JSON.stringify(state));

    // console.log(state.lastTime - state.damselTime); // log load time

    document.getElementById("timer1").innerText = "0.00";
    document.getElementById("timer2").innerText = "0.00";

    state.level = parseInt(name.slice(5, 10));
    state.menu = name === "Menu" || (Number.isNaN(state.level));
    if (!state.menu) {
        document.getElementById("wr").innerText = wrs[state.level - 1];
    } else {
        document.getElementById("wr").innerText = "0.00";
    }
    state.damselCount = 0;
    state.levelStart = state.lastTime;

    if ((name == "Menu" && !previousState.menu) || (state.level == 1 && previousState.level == 1)) {
        registerLevelReset(previousState.level);
    }

    if (name == "End") {
        registerLevelReset(16);
    }
}

window.autosplitter.onUpdate = function (time) {
    state.previousTime = state.lastTime;
    state.lastTime = time;
    if (!state.menu && state.damselCount < chestsInLevel(state.level)) {
        var id = (state.damselCount == 0) ? "timer1" : "timer2";
        document.getElementById(id).innerText = showTime();
    }
}
