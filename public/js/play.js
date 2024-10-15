const reqFs = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

const fullscreen = () => {
  const elem = document.getElementsByClassName("gameframe")[0];
  reqFs(elem);
};

document.addEventListener('DOMContentLoaded', function () {
  var likeButton = document.getElementById('likeButton');
  var likedGames = JSON.parse(localStorage.getItem('likedGames')) || [];
  var currentPage = window.location.pathname + window.location.search;
  if (currentPage.includes('play?')) {
    currentPage = currentPage.replace('play?', 'play.html?');
  }

  var index = likedGames.indexOf(currentPage);

  if (index !== -1) {
    toggleLike(true, currentPage);
  }

  likeButton.addEventListener('click', function () {
    if (index !== -1) {
      likedGames.splice(index, 1);
      toggleLike(false, currentPage);
    } else {
      likedGames.push(currentPage);
      toggleLike(true, currentPage);
    }

    localStorage.setItem('likedGames', JSON.stringify(likedGames));
    index = likedGames.indexOf(currentPage);
  });

  function toggleLike(isLiked, currentPage) {
    var heartButton = document.getElementById('likeButton');
    var heartLogo = heartButton.querySelector('.heart-logo');

    if (isLiked) {
      heartLogo.innerHTML = '<ion-icon name="heart" style="color: #e64553;"></ion-icon>';
    } else {
      heartLogo.innerHTML = '<ion-icon name="heart-outline" style="color: var(--text);"></ion-icon>';
    }
  }
});
