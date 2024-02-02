var PokiPlugin = {
    adblock: false,
    canShowAds: false,
    init: function() {
        var style = document.createElement('style');
        style.innerHTML = '#application-console{ display:none; }'
        document.head.appendChild(style);

    
        PokiPlugin.onLoad();
    },
    onLoad: function() {
        PokiPlugin.loadCompleted();
        PokiPlugin.canShowAds = true;
     
    },
    loadCompleted: function() {
   

        //has been requested by Poki to trigger commercial before gameplay
        PokiPlugin.showMidroll();
        //PokiPlugin.playGame();

        Utils.logCheckpoint('first_entry');
    },
    pauseGame: function() {
        if (typeof pc !== 'undefined') {
            pc.app.timeScale = 0;

            if (pc.app.systems && pc.app.systems.sound) {
                pc.app.systems.sound.volume = 0;
            }

            pc.app.fire('Player:Stop');
            pc.app.fire('Gameplay:Pause');
        }

     
    },
    playGame: function() {
        if (typeof pc !== 'undefined') {
            pc.app.timeScale = 1;

            if (pc.app.systems && pc.app.systems.sound) {
                pc.app.systems.sound.volume = 0.5;
            }

            pc.app.fire('Gameplay:Play');
        }

        try {
 
        } catch (e) {

        }
    },
    showMidroll: function(callback) {
        try {
            JumpGame.showInterstitial({
                beforeShowAd: ()=> {
                    PokiPlugin.pauseGame();                     
                },
                afterShowAd: ()=> {
                   
                    callback(true);
    
                    PokiPlugin.playGame();                     
                }
            })
          
        } catch (e) {
            PokiPlugin.playGame();
        }
    },
    showReward: function(callback) {
        if (PokiPlugin.adblock) {
            return false;
        }

        if (!PokiPlugin.canShowAds) {
            return false;
        }
        JumpGame.showReward({
            beforeShowAd: ()=> {
                PokiPlugin.pauseGame();                       
            },
            afterShowAd: ()=> {
                callback(true);
    
                PokiPlugin.playGame();                          
            }
        })
     
    }
};

PokiPlugin.init();

window.addEventListener('keydown', function(ev) {
    if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
    }
});

window.addEventListener('wheel', function(ev) {
    ev.preventDefault()
}, {
    passive: false
});

//disable context
window.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
});