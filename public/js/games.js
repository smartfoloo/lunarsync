const gameList = document.getElementById("gameList");
const searchInput = document.getElementById("searchInput");
const likedGamesContainer = document.getElementById("likedGames");

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  const gameCards = gameList.querySelectorAll(".game-card");

  gameCards.forEach((card) => {
    const title = card.querySelector(".title").textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  likedGamesContainer.forEach((card) => {
    const title = card.querySelector(".title").textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
  
  gameList.style.removeProperty("display");
  gameList.style.removeProperty("flex-wrap");
  likedGamesContainer.style.removeProperty("display");
  likedGamesContainer.style.removeProperty("flex-wrap");

  const visibleCards = Array.from(gameList.querySelectorAll(".game-card[style='display: block;']"));

  if (visibleCards.length > 0) {
    gameList.style.display = "flex";
    gameList.style.flexWrap = "wrap";
  } else {
    gameList.style.display = "grid";
    gameList.style.gridTemplateColumns = "repeat(auto-fit, 150px)";
  }
});

function incrementGamesPlayed(gameName) {
  var gamesPlayed = JSON.parse(localStorage.getItem("gamesPlayed")) || [];
  if (!gamesPlayed.includes(gameName)) {
    gamesPlayed.push(gameName);
    localStorage.setItem("gamesPlayed", JSON.stringify(gamesPlayed));
  }
}

function storeTotalGames() {
  var totalGames = document.querySelectorAll(".game-card").length;
  localStorage.setItem("totalGames", totalGames);
}

function displayGameStats() {
  var gamesPlayed = JSON.parse(localStorage.getItem("gamesPlayed")) || [];
  var totalGames = localStorage.getItem("totalGames") || 0;
  return gamesPlayed.length + "/" + totalGames;
}

var gameCards = document.querySelectorAll(".game-card");
gameCards.forEach(function (gameCard) {
  gameCard.addEventListener("click", function () {
    var gameName = gameCard.querySelector(".title").textContent;
    incrementGamesPlayed(gameName);
  });
});

storeTotalGames();

document.addEventListener('DOMContentLoaded', function () {
  var likedGames = JSON.parse(localStorage.getItem('likedGames')) || [];
  var gameCards = document.querySelectorAll('.game-card');

  likedGames.forEach(function (likedGameLink) {
    gameCards.forEach(function (card) {
      var link = card.closest('a').getAttribute('href');
      if (link === likedGameLink) {
        addLikedLabel(card);
        moveToLiked(card);
      }
    });
  });
});

function addLikedLabel(gameCard) {
  var likedLabel = document.createElement('i');
  likedLabel.className = 'fa-solid fa-star';
  gameCard.appendChild(likedLabel);
}

function removeLikedLabel(gameCard) {
  var likedLabel = gameCard.querySelector('#liked-game');
  if (likedLabel) {
    likedLabel.remove();
  }
}

function moveToLiked(card) {
  card.closest('a').remove();

  likedGamesContainer.appendChild(card.closest('a'));

  card.closest('a').classList.add('liked-game');
}