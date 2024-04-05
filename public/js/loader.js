const gameframe = document.querySelector('.gameframe');
const gamename = document.getElementById('gamename');
const gameimage = document.querySelector('.game-image');

const params = new URLSearchParams(window.location.search);
const gameToLoad = params.get('game');

if (gameToLoad) {
  if (gameToLoad === 'little-alchemy-2') {
    gameframe.src = 'https://littlealchemy2.com';
    gamename.textContent = 'Little Alchemy 2';
    gameimage.src = './assets/images/littlealchemy2.png';
  } else if (gameToLoad === 'flip-bros') {
    gameframe.src = './assets/games/flip-bros/game.html';
    gamename.textContent = 'Flip Bros';
    gameimage.src = './assets/images/flipbros.avif';
  } else if (gameToLoad === 'level-devil') {
    gameframe.src = './assets/games/level-devil/game.html';
    gamename.textContent = 'Flip Bros';
    gameimage.src = './assets/images/leveldevil.avif';
  } else {
    const imageName = gameToLoad.replace(/-/g, '');
    const imageSrcPng = `./assets/images/${imageName}.png`;
    const imageSrcAvif = `./assets/images/${imageName}.avif`;

    const imageChecker = new Image();
    imageChecker.src = imageSrcPng;

    imageChecker.onload = function () {
      gameimage.src = imageSrcPng;
      loadGame();
    };

    imageChecker.onerror = function () {
      gameimage.src = imageSrcAvif;
      loadGame();
    };

    function loadGame() {
      const words = gameToLoad.split('-');
      const title = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      gamename.textContent = title;
      gameframe.src = `./assets/fonts/${gameToLoad}`;

      gameframe.style.display = 'none';

      setTimeout(() => {
        gameframe.style.display = 'block';
      }, 300);
    }
  }
}



