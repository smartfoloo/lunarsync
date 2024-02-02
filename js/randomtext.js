const texts = [
  "dm me to host this site",
  "derek is cool",
  "join the discord!",
  "its christmas timeeeeeeee",
  "🎄🎄🎄🎄",
  "rooftop snipers 2 is peak gaming",
  "you can flex your time in profile ",
  "get back to work, blud",
  "https://youtu.be/dQw4w9WgXcQ DONT CLICK!!!",
  "make ur own platformer link in out github repo",
  "theres an emulator in extras 🤯",
  "change your nickname in profile",
  "nobody ever reads these :sigh:",
  "hello from dill ehehehhe",
];

function getRandomText() {
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

const randomTextElement = document.getElementById("randomText");
randomTextElement.textContent = getRandomText();
