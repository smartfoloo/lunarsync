const gameframe = document.querySelector('.gameframe');
const gamename = document.getElementById('gamename');
const gameimage = document.querySelector('.game-image');

const params = new URLSearchParams(window.location.search);
const gameToLoad = params.get('game');

if (gameToLoad) {
  if (gameToLoad === 'taming-io') {
    gameframe.src = 'https://school-homework.com/';
    gamename.textContent = 'Taming.io';
    gameimage.src = '/images/tamingio.png';
  } else if (gameToLoad === 'little-alchemy-2') {
    gameframe.src = 'https://littlealchemy2.com';
    gamename.textContent = 'Little Alchemy 2';
    gameimage.src = '/images/littlealchemy2.png';
  } else if (gameToLoad === 'san-francisco') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/san-francisco';
    gamename.textContent = 'San Francisco';
    gameimage.src = '/images/sanfrancisco.png';
  } else if (gameToLoad === 'funny-shooter-2') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/funny-shooter-2';
    gamename.textContent = 'Funny Shooter 2';
    gameimage.src = '/images/funnyshooter2.png';
  } else if (gameToLoad === 'time-shooter-2') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/time-shoter-2o';
    gamename.textContent = 'Time Shooter 2';
    gameimage.src = '/images/timshooter2.png';
  } else if (gameToLoad === 'time-shooter-3') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/time-shooter-3';
    gamename.textContent = 'San Francisco';
    gameimage.src = '/images/sanfrancisco.png';
  } else if (gameToLoad === 'turbo-moto-racer') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/turbo-moto-racer';
    gamename.textContent = 'Turbo Moto Racer';
    gameimage.src = '/images/turbomotoracer.png';
  } else if (gameToLoad === 'bank-robbery') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/bank-robbery';
    gamename.textContent = 'Bank Robbery';
    gameimage.src = '/images/bankrobbery.png';
  } else if (gameToLoad === 'bank-robbery-2') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/bank-robbery-2';
    gamename.textContent = 'Bank Robbery 2';
    gameimage.src = '/images/bankrobbery2.png';
  } else if (gameToLoad === 'squid-shooter') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/squid-shooter';
    gamename.textContent = 'Squid Shooter';
    gameimage.src = '/images/squidshooter.png';
  } else if (gameToLoad === 'zombies-shooter-2') {
    gameframe.src = 'https://smartfoloolol.netlify.app/assets/zombies-shooter-2';
    gamename.textContent = 'Zombies Shooter 2';
    gameimage.src = '/images/zombiesshooter2.png';
  } else if (gameToLoad === 'dogeminer2') {
    gameframe.src = 'https://minerdoge2.netlify.app/play/index.html';
    gamename.textContent = 'Dogeminer 2';
    gameimage.src = '/images/dogeminer2.png';
  } else if (gameToLoad === 'dogeminer') {
    gameframe.src = 'https://minerdoge.netlify.app/';
    gamename.textContent = 'Dogeminer';
    gameimage.src = '/images/zombiesshooter.png';
  } else if (gameToLoad === 'karlsont') {
    gameframe.src = 'https://smartfoloolol.pages.dev/karlsont';
    gamename.textContent = 'KARLSONT';
    gameimage.src = '/images/karlsont.png';
  } else if (gameToLoad === 'airmash') {
    gameframe.src = 'https://altao.azureedge.net/';
    gamename.textContent = 'Airmash';
    gameimage.src = '/images/airmash.png';
  } else if (gameToLoad === 'yohoho-io') {
    gameframe.src = 'https://nearpod-currentlyconnectedtolesson.onrender.com/assets/yohoho/index.html';
    gamename.textContent = 'Yohoho.io';
    gameimage.src = '/images/yohohoio.avif';
  } else if (gameToLoad === 'dadish-3') {
    gameframe.src = 'https://dadish3.netlify.app/';
    gamename.textContent = 'Dadish 3';
    gameimage.src = '/images/dadish3.avif';
  } else if (gameToLoad === 'level-devil') {
    gameframe.src = 'https://smartfoloosanta.pages.dev/level-devil';
    gamename.textContent = 'Dadish 3';
    gameimage.src = '/images/leveldevil.avif';
  } else if (gameToLoad === 'blumgi-dragon') {
    gameframe.src = 'https://gefjwhkqgg.bitbucket.io';
    gamename.textContent = 'Blumgi Dragon';
    gameimage.src = '/images/blumgidragon.avif';
  } else {
    const imageName = gameToLoad.replace(/-/g, '');
    const imageSrcPng = `/images/${imageName}.png`;
    const imageSrcAvif = `/images/${imageName}.avif`;

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
      gameframe.src = `/assets/${gameToLoad}`;

      gameframe.style.display = 'none';

      setTimeout(() => {
        gameframe.style.display = 'block';
      }, 300);
    }
  }
}



