<!DOCTYPE html>
<html>

<head>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <link rel="stylesheet" href="/css/main/games.css">
  <link rel="stylesheet" href="/css/error.css">
  <link rel="icon" href="/favicon.ico">
  <title>404 | Page not found</title>
</head>

<body>
  <iframe src="" frameborder="0" id="game-id" style="display: none;"></iframe>
  <header class="header">
    <div class="logo">
      <button class="home-menu-item btn41-43 btn-41" onclick="window.location.href='/'" class="title">
        <img src="/favicon.ico" class="nav-icon" />
        <strong>nate-games</strong>
      </button>
    </div>
    <nav class="menu">
      <a href="/en-us/settings/">
        <button class="menu-item">
          <i class="fa-solid fa-gear"></i> Settings
        </button>
      </a>
      <a href="/en-us/signup/">
        <button class="menu-item">
          <i class="fa-solid fa-user"></i> Account
        </button>
      </a>
      <div class="dropdown">
        <button class="menu-item dropbtn">
          <i class="fa-solid fa-dragon"></i>Categories
        </button>
        <div class="dropdown-content">
          <a href="/0/g/#clicker">Clicker |
            <i class="fa-solid fa-arrow-pointer"></i> <i class="fa-solid fa-hand-pointer"></i></a>
          <a href="/0/g/#shooting">Shooting |
            <i class="fa-solid fa-gun"></i></a>
          <a href="/0/g/#point-and-click">Point & Click | <i class="fa-solid fa-computer-mouse"></i></a>
          <a href="/0/g/#action">Action | <i class="fa-solid fa-burst"></i></a>
          <a href="/0/g/#kids">Kids | <i class="fa-solid fa-child-reaching"></i></a>
          <span style="
                  border-top: 2px solid #222;
                  border-bottom: 2px solid #222;
                  border-radius: 0;
                "><b>Game engines <i class="fa-solid fa-dice-d6"></i></b></span>
          <a href="/0/g/#html5">HTML5 |
            <img src="/img/svg/html5.svg" style="vertical-align: middle; height: 14px" /></a>
          <a href="/0/g/#unity">Unity |
            <img src="/img/svg/unity.svg" style="vertical-align: middle; height: 14px" /></a>
          <a href="/0/g/#flash">Flash |
            <img src="/img/svg/adobe-flash.svg" style="vertical-align: middle; height: 14px" /></a>
          <a href="/0/g/#scratch">Scratch |
            <img src="/img/svg/scratch.svg" style="vertical-align: middle; height: 14px" /></a>
        </div>
      </div>
      <a href="/0/g/">
        <button class="menu-item">
          <i class="fa-solid fa-gamepad"></i> Games
        </button>
      </a>
      <a href="/en-us/emu/">
        <button class="menu-item">
          <i class="fa-solid fa-dice-d6"></i> Emulator
        </button>
      </a>
      <a href="/en-us/projects/">
        <button class="menu-item">
          <i class="fa-solid fa-paper-plane"></i> Projects
        </button>
      </a>
      <a href="https://docs.nate-games.xyz/">
        <button class="menu-item">
          <i class="fa-solid fa-book"></i> Docs
        </button>
      </a>
      <div class="dropdown">
        <button class="menu-item dropbtn">
          <i class="fa-solid fa-caret-down"></i> More
        </button>
        <div class="dropdown-content" style="right: 0; min-width: 180px">
          <a href="https://discord.gg/9mJcqwZ2a5" target="_blank">Join the Discord | 💬</a>
          <a href="/en-us/contact" target="_blank">Contact | 📝</a>
          <a href="https://github.com/nate-games/nate-games.xyz" target="_blank">GitHub |
            <img src="/img/svg/github.svg" style="vertical-align: middle; height: 25px" /></a>
          <a href="https://github.com/nate-games/nate-games.xyz" target="_blank">Sponsor |
            <img src="/img/svg/sponsor.svg" class="sponsor" /></a>
        </div>
      </div>
    </nav>
  </header>

  <div class="container2">
    <div class="container">
      <h2>404 | Page not found.</h2>
      <p>Sorry, The URL <span id="path"></span> was <br> not found on this server or you don't have access.</p>
      <a class="buttons" href="/">Home</a>
      <a class="buttons" href="/0/g/">Games</a><br><br>
      <a class="sfn" onclick="statsForNerds()">Stats for nerds <span class="material-symbols-outlined"
          style="vertical-align: middle; font-size: 20px;">
          bug_report
        </span></a>

      <div id="sfn" class="message">
        <br>
        <b>Screen height:</b> <span id="height">Fetching...</span><br />
        <b>Screen width:</b> <span id="width">Fetching...</span><br />
        <b>Window height:</b> <span id="winheight">Fetching...</span><br />
        <b>Window width:</b> <span id="winwidth">Fetching...</span><br />
        <b>Cookies Enabled:</b> <span id="cookie">Fetching...</span><br />
        <b>User's IP:</b> <span id="displayIP">Fetching...</span><br />
      </div>

      <script>
        // Credits 3kh0, some changes were made
        function statsForNerds() {
          var x = document.getElementById("sfn");
          if (x.style.display === "none") {
            x.style.display = "block";
          } else {
            x.style.display = "none";
          }
        }
        document.getElementById("height").innerHTML = screen.height + "px";
        document.getElementById("width").innerHTML = screen.width + "px";
        document.getElementById("winheight").innerHTML =
          window.innerHeight + "px";
        document.getElementById("winwidth").innerHTML = window.innerWidth + "px";
        document.getElementById("cookie").innerText = navigator.cookieEnabled;

        function fetchText() {
          fetch('https://ip.nate-games.xyz')
            .then(response => response.text())
            .then(data => {
              document.getElementById('displayIP').textContent = data;
            })
            .catch(error => {
              console.error('Error fetching text:', error);
            });
        }
        fetchText();
      </script>

    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      let path = window.location.pathname;

      if (window !== window.parent) {
        path = window.parent.location.pathname;
      }

      document.getElementById('path').textContent = path;
    });
  </script>
  <script>
    function getParameterByName(name) {
      const url = new URL(window.location.href);
      return url.searchParams.get(name);
    }

    function hideElementById(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.style.display = 'none';
      }
    }

    const elementToHide = getParameterByName('hide');

    if (elementToHide) {
      hideElementById(elementToHide);
    }

  </script>
  <script src="/js/iframe_referer.js"></script>
  <script src="/js/sw.js"></script>
  <script src="/js/editor.js"></script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v84a3a4012de94ce1a686ba8c167c359c1696973893317" integrity="sha512-euoFGowhlaLqXsPWQ48qSkBSCFs3DPRyiwVu3FjR96cMPx+Fr+gpWRhIafcHwqwCqWS42RZhIudOvEI+Ckf6MA==" data-cf-beacon='{"rayId":"81bdcff2b912479c","version":"2023.10.0","r":1,"token":"0fcff0389bdb4b418bc07a51c51215d7","b":1}' crossorigin="anonymous"></script>
</body>

</html>