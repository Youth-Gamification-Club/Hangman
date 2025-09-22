// Game state variables
let selectedWord;
let guessedLetters;
let attempts;
let wrongGuesses;
let hintsUsed;
let score;
let streak;

// Sound effects
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

let riddles;
let words;

async function loadRiddles() {
  const response = await fetch("riddles.json");
  riddles = await response.json();
  words = Object.keys(riddles);
}

window.onload = async function () {
  await loadRiddles();
  // Initialize score and streak from localStorage
  score = parseInt(localStorage.getItem("hangmanScore")) || 0;
  streak = parseInt(localStorage.getItem("hangmanStreak")) || 0;

  // Set up event listeners
  document
    .getElementById("letter-input")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const input = event.target.value.toLowerCase();
        if (input.length === 1 && /^[a-z]$/.test(input)) {
          guessLetter(input);
        }
      }
    });

  // Initialize the game
  initGame();
};

// Initialize or reset the game
function initGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = new Set();
  attempts = 6;
  wrongGuesses = [];
  hintsUsed = 0;

  // Update UI
  document.getElementById("riddle-text").innerText =
    riddles[selectedWord] || "Guess the word!";
  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
  document.getElementById("attempts").innerText = attempts;
  document.getElementById("wrong-guesses").innerText = "None";
  document.getElementById("hangman-image").src = "images/hangman-0.png";
  document.getElementById("win").innerText = "";
  document.getElementById("lose").innerText = "";
  document.getElementById("message").innerText = "";
  document.getElementById("letter-input").disabled = false;
  document.getElementById("letter-input").value = "";
  document.getElementById("hint-btn").disabled = false;
  document.getElementById("restart-btn").style.display = "none";

  updateWordDisplay();
}

// Update the word display with underscores and correct letters
function updateWordDisplay() {
  let display = selectedWord
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");
  document.getElementById("word-display").innerText = display;

  if (!display.includes("_")) {
    document.getElementById("win").innerText = "🎉 You Win!";
    document.getElementById("letter-input").disabled = true;
    score += Math.max(10 - hintsUsed * 2, 1); // Bonus for fewer hints
    streak++;
    localStorage.setItem("hangmanScore", score);
    localStorage.setItem("hangmanStreak", streak);
    document.getElementById("score").innerText = score;
    document.getElementById("streak").innerText = streak;
    const button = document.getElementById("restart-btn");
    button.style.display = "inline";
    button.onclick = restartGame;
  }
}

// Handle a letter guess
function guessLetter(inputLetter = null) {
  const input =
    inputLetter || document.getElementById("letter-input").value.toLowerCase();
  document.getElementById("letter-input").value = ""; // Clear input
  document.getElementById("message").innerText = ""; // Clear message

  if (
    !input ||
    guessedLetters.has(input) ||
    input.length !== 1 ||
    !/^[a-z]$/.test(input)
  ) {
    document.getElementById("message").innerText =
      "⚠️ Invalid or repeated letter!";
    return;
  }

  guessedLetters.add(input);

  const isCorrect = selectedWord.includes(input);
  if (isCorrect) {
    correctSound.play(); // Play correct guess sound
    updateWordDisplay();
  } else {
    wrongSound.play(); // Play wrong guess sound
    attempts--;
    wrongGuesses.push(input);
    document.getElementById("wrong-guesses").innerText =
      wrongGuesses.length === 0 ? "None" : wrongGuesses.join(", ");
    document.getElementById("attempts").innerText = attempts;

    // Update hangman image
    const hangmanImage = document.getElementById("hangman-image");
    hangmanImage.src = `images/hangman-${6 - attempts}.png`;
  }

  if (attempts === 0) {
    document.getElementById("lose").innerText =
      "💀 Game Over! The word was " + selectedWord;
    document.getElementById("letter-input").disabled = true;
    streak = 0;
    localStorage.setItem("hangmanStreak", streak);
    document.getElementById("streak").innerText = streak;
    const button = document.getElementById("restart-btn");
    button.style.display = "inline";
    button.onclick = restartGame;
  }
}

// Give a hint by revealing a random letter
function giveHint() {
  if (hintsUsed >= 2 || attempts <= 1) {
    document.getElementById("message").innerText =
      "⚠️ No more hints available!";
    return;
  }

  const unguessedLetters = selectedWord
    .split("")
    .filter((letter) => !guessedLetters.has(letter));
  if (unguessedLetters.length === 0) return;

  const randomLetter =
    unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
  guessedLetters.add(randomLetter);
  hintsUsed++;

  document.getElementById("message").innerText =
    `💡 Hint used! Revealed: ${randomLetter.toUpperCase()}`;
  updateWordDisplay();

  if (hintsUsed >= 2) {
    document.getElementById("hint-btn").disabled = true;
  }
}

// Restart the game without reloading the page
function restartGame() {
  initGame();
}

// Expose functions to window for global access
window.guessLetter = guessLetter;
window.giveHint = giveHint;
