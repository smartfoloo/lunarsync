const texts = [
  "check out settings for custom themes",
  "who got the apple vision pro?",
  "you got homework to do!",
  "this is v4 beta"
];

function getRandomText() {
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

const randomTextElement = document.getElementById("randomText");
randomTextElement.textContent = getRandomText();
