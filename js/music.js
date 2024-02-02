document.addEventListener('DOMContentLoaded', () => {
	const playlistCards = document.querySelectorAll('.playlist-card');
	const musicContainer = document.getElementById('music-container');
	const audio = document.getElementById('audio');
	const playBtn = document.getElementById('play');
	const prevBtn = document.getElementById('prev');
	const nextBtn = document.getElementById('next');
	const progress = document.getElementById('progress');
	const progressContainer = document.getElementById('progress-container');
	const title = document.getElementById('title');
	const cover = document.getElementById('cover');
	const queueList = document.getElementById('queue-list');
	const likeBtn = document.getElementById('like-btn');
	const shuffleBtn = document.getElementById('shuffle-btn'); // Add this line

	let playlists = {
		'liked-songs': [],
		'yoasobi': ['怪物', 'ハルジオン', 'ハルカ', '夜に駆ける', 'あの夢をなぞって', '三原色', '祝福', 'セブンティーン', 'もう少しだけ', 'もしも命が描けたら', 'ミスター'],
		'phonk': ['metamorphosis', 'close-eyes', 'lovely-bastards', 'memory-reboot', 'rave', 'aircraft', 'rainstorm', 'shadow', 'psycho-cruise', 'baixo', 'classical-phonk', 'ghost!', 'gigachad-theme', 'eggstreme-duck-phonk', 'brazilian-phonk-mano', 'brazilian-danca-phonk', 'unholy', 'murder-in-my-mind', 'tokyo-drift', 'hyptonic-data', 'avoid-me', 'neon-blade'],
		'gaming-tracks': ['my-ordinary-life', 'metamorphosis', 'close-eyes', 'close-eyes-sped-up', 'rave', 'after-dark', 'chug-jug-with-you', 'kerosene', 'past-lives'],
		'meme-songs': ['whopper', 'nom-nom-nom-nom-nom-nom-nom', 'peppa-pig', 'loud-indian-music', 'soviet-anthem'],
		'slowed-and-reverb': ['close-eyes-slowed-reverb', 'metamorphosis-slowed-reverb', 'living-life-in-the-night-slowed'],
		'vibes': ['blueberry-faygo', 'back-to-you', 'love-you-better', 'living-life-in-the-night-slowed', 'sea-of-thieves', 'i-see-london-i-see-france', 'spicy', 'thousand', 'RO7-3ALATOL', 'lemonade', 'buster', 'mathematical-disrespect', 'hollywood-perfect', 'holiday', 'barking', 'outside', 'easier', 'slidin', 'mercedes', 'forever-never'],
		'lofi-jazz': ['circus', 'that-kyoto-vibe', 'brazilian-beach-rumba', 'kyoto-nights', 'cactus-cafe', 'coffee-moments', 'jazz-in-my-coffee', 'sushi'],
		'seasonal': ['mariahcarey','snowman'],
		'mix': ['paint-the-town-red','somebody-that-i-used-to-know','somebodys-watching-me',"ballin'",'bad-habit','luxury','everybody-wants-to-rule-the-world','the-box','the-perfect-girl'],
        'rap':['all-girls-are-the-same','the-box',"ballin'"]
	};

	let currentPlaylist = [];
	let queue = [];
	let isLiked = false;

	

	playlistCards.forEach(card => {
		card.addEventListener('click', () => {
			const playlistName = card.getAttribute('data-playlist');
			currentPlaylist = playlists[playlistName] || [];
			if (currentPlaylist.length > 0) {
				loadSong(0);
				playSong();
			}
		});
	});

	// Add the shuffle functionality
	shuffleBtn.addEventListener('click', () => {
		shufflePlaylist();
	});

	let songIndex = 0;

	const playlistIndicator = document.getElementById('playlist-indicator');

	function loadSong(index) {
		if (currentPlaylist.length > 0 && index >= 0 && index < currentPlaylist.length) {
			const selectedSong = currentPlaylist[index];
			console.log('Loading song:', selectedSong); // Log the selected song

			title.innerText = selectedSong.replace(/-/g, " ");
			audio.src = `/music/songs/${selectedSong}.mp3`; // Check if the path and file name match your audio files
			cover.src = `/music/images/${selectedSong}.jpeg`;
			songIndex = index;

			updateQueueList();

			// Update like button state
			isLiked = playlists['liked-songs'].includes(currentPlaylist[songIndex]);
			updateLikeButton();

			// Update playlist indicator
			updatePlaylistIndicator();

			// Log the audio source being set
			console.log('Audio source:', audio.src);

			// Play the song (if needed)
			playSong();
            navigator.mediaSession.metadata = new MediaMetadata({
                title: selectedSong.replace(/-/g, " "),
                artist: "Groovy",
                artwork: [
                  {
                    src: cover.src,
                    sizes: "300x300",
                    type: "image/jpeg",
                    src: cover.src,
                    sizes: "2000x2000",
                    type: "image/jpeg",
                  },
                ],
              });
		} else {
			console.error('Invalid song index or playlist');
		}
	}


	function playSong() {
		musicContainer.classList.add('play');
		playBtn.querySelector('i.fas').classList.remove('fa-play');
		playBtn.querySelector('i.fas').classList.add('fa-pause');
		audio.play();
        navigator.mediaSession.playbackState = "playing";
	}

	function pauseSong() {
		musicContainer.classList.remove('play');
		playBtn.querySelector('i.fas').classList.add('fa-play');
		playBtn.querySelector('i.fas').classList.remove('fa-pause');
		audio.pause();
        navigator.mediaSession.playbackState = "paused";
	}
    

	playBtn.addEventListener('click', () => {
		const isPlaying = musicContainer.classList.contains('play');
		if (isPlaying) {
			pauseSong();
            
		} else {
			playSong();
		}
	});

	likeBtn.addEventListener('click', () => {
		isLiked = !isLiked; // Toggle like state
		updateLikeButton();
		updateLikedSongs(); // Update liked songs playlist
	});

	prevBtn.addEventListener('click', () => {
		songIndex = (songIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
		loadSong(songIndex);
		playSong();
	});

	nextBtn.addEventListener('click', () => {
		songIndex = (songIndex + 1) % currentPlaylist.length;
		loadSong(songIndex);
		playSong();
	});

	function updateProgress(e) {
		const { duration, currentTime } = e.srcElement;
		const progressPercent = (currentTime / duration) * 100;
		progress.style.width = `${progressPercent}%`;
	}

	function setProgress(e) {
		const width = this.clientWidth;
		const clickX = e.offsetX;
		const duration = audio.duration;
		const newTime = (clickX / width) * duration;
		audio.currentTime = newTime;

		const isPaused = audio.paused;
		if (!isPaused) {
			audio.play();
		}
	}


	function DurTime(e) {
		const { duration, currentTime } = e.srcElement;
		let sec;
		let sec_d;

		let min = (currentTime == null) ? 0 : Math.floor(currentTime / 60);
		min = min < 10 ? '0' + min : min;

		function get_sec(x) {
			if (Math.floor(x) >= 60) {
				for (let i = 1; i <= 60; i++) {
					if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
						sec = Math.floor(x) - (60 * i);
						sec = sec < 10 ? '0' + sec : sec;
					}
				}
			} else {
				sec = Math.floor(x);
				sec = sec < 10 ? '0' + sec : sec;
			}
		}

		get_sec(currentTime, sec);

		let min_d = (isNaN(duration) === true) ? '0' : Math.floor(duration / 60);
		min_d = min_d < 10 ? '0' + min_d : min_d;

		function get_sec_d(x) {
			if (Math.floor(x) >= 60) {
				for (let i = 1; i <= 60; i++) {
					if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
						sec_d = Math.floor(x) - (60 * i);
						sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
					}
				}
			} else {
				sec_d = (isNaN(duration) === true) ? '0' : Math.floor(x);
				sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
			}
		}

		get_sec_d(duration);
	}

	function updateQueueList() {
		queueList.innerHTML = '';
		for (let i = songIndex; i < currentPlaylist.length; i++) {
			const listItem = document.createElement('li');

			// Create an img element for the song image
			const img = document.createElement('img');
			img.src = `/music/images/${currentPlaylist[i]}.jpeg`;
			img.alt = currentPlaylist[i];

			listItem.appendChild(img);

			// Create a span element for the song title
			const titleSpan = document.createElement('span');
			titleSpan.innerText = currentPlaylist[i].replace(/-/g, " ");

			listItem.appendChild(titleSpan);

			if (i === songIndex) {
				// Add an outline to indicate the currently playing song
				listItem.classList.add('current-song');
			}

			queueList.appendChild(listItem);
		}
	}

	function updateLikeButton() {
		if (isLiked) {
			likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
		} else {
			likeBtn.innerHTML = '<i class="far fa-heart"></i>';
		}
	}
	function updateLikedSongs() {
		if (isLiked) {
			if (!playlists['liked-songs'].includes(currentPlaylist[songIndex])) {
				playlists['liked-songs'].push(currentPlaylist[songIndex]);
			}
		} else {
			const indexToRemove = playlists['liked-songs'].indexOf(currentPlaylist[songIndex]);
			if (indexToRemove !== -1) {
				playlists['liked-songs'].splice(indexToRemove, 1);
			}
		}
	}

	function updatePlaylistIndicator() {
		const playlistName = getPlaylistNameBySong(currentPlaylist[songIndex]);
		playlistIndicator.innerText = `Playing from: ${playlistName}`;
	}

	function getPlaylistNameBySong(song) {
		for (const [playlistName, songs] of Object.entries(playlists)) {
			if (songs.includes(song)) {
				return playlistName;
			}
		}
		return 'Unknown Playlist';
	}

	function shufflePlaylist() {
		for (let i = currentPlaylist.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[currentPlaylist[i], currentPlaylist[j]] = [currentPlaylist[j], currentPlaylist[i]];
		}
		loadSong(0);
		playSong();
	}

	audio.addEventListener('timeupdate', updateProgress);
	progressContainer.addEventListener('click', setProgress);

	audio.addEventListener('ended', () => {
		songIndex = (songIndex + 1) % currentPlaylist.length;
		loadSong(songIndex);
		playSong();
	});

	audio.addEventListener('timeupdate', DurTime);

	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') {
			if (musicContainer.classList.contains('play')) {
				playSong();
			}
		}
	});
    
        const loopBtn = document.getElementById('loop');
        let isLooping = false;
    
        loopBtn.addEventListener('click', () => {
            isLooping = !isLooping;
            updateLoopButton();
        });
    
        function updateLoopButton() {
            if (isLooping) {
                loopBtn.style.color = "#FFFFFF"; ;
            } else {
                loopBtn.style.color = "#1cd96a"; 
            }
        }
        audio.addEventListener('ended', () => {
            if (isLooping) {
                loadSong(songIndex);
                playSong();
            } else {
                songIndex = (songIndex + 1) % currentPlaylist.length;
                loadSong(songIndex);
                playSong();
            }
        });
});

