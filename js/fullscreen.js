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
    toggleLike(true);
  }

  likeButton.addEventListener('click', function () {
    if (index !== -1) {
      likedGames.splice(index, 1);
      toggleLike(false);
    } else {
      likedGames.push(currentPage);
      toggleLike(true);
    }

    localStorage.setItem('likedGames', JSON.stringify(likedGames));
  });
});

function toggleLike(isLiked) {
  var starButton = document.getElementById('likeButton');
  var starLogo = starButton.querySelector('.star-logo');

  if (isLiked) {
    starLogo.innerHTML = '<i class="fa-solid fa-star" style="color: #fff;"></i>';
  } else {
    starLogo.innerHTML = '<i class="fa-regular fa-star" style="color: #fff;"></i>';
  }
}


