window.onload = function () {
    // List of eco-friendly words
    const words = ["recycle", "compost", "plant", "water", "organic", "windmill", "solar", "plastic", "carbon", "bamboo", "biofuel", "habitat", "oxygen", "fungi", "wetland", "tundra", "rainforest", "ecofriendly", "upcycle", "permaculture", "biodiesel", "tree", "earth", "leaf", "sun", "wind", "air", "eco"];

    // Sound effects
    const correctSound = document.getElementById("correct-sound");
    const wrongSound = document.getElementById("wrong-sound");

    // Riddles matching each word
    const riddles = {
        recycle: "♻️ I give old things new life—what am I?",
        compost: "🌱 I turn food scraps into garden gold—what am I?",
        plant: "🪴 I'm green, I grow, and I photosynthesize—what am I?",
        water: "💧 I'm essential for all life, but I can drown you too—what am I?",
        organic: "🥦 No chemicals, no synthetics—just nature. What is it?",
        windmill: "🌬️ I spin with the breeze to make electricity—what am I?",
        solar: "☀️ I catch rays to power homes—what energy source am I?",
        plastic: "🧴 I'm useful but polluting—what material am I?",
        carbon: "🧪 I'm a building block of life, but too much of me heats the Earth—what element am I?",
        biofuel: "🌾 I'm fuel from plants, not fossils—what am I?",
        habitat: "🏞️ All creatures need me to live—what am I?",
        oxygen: "🫁 You breathe me every second—what gas am I?",
        fungi: "🍄 I'm not a plant or animal, but I help trees talk—what am I?",
        wetland: "🦆 I’m soggy and full of life—what ecosystem am I?",
        tundra: "❄️ I'm frozen most of the year—what biome am I?",
        rainforest: "🌳 I’m hot, wet, and home to half the world’s species—what biome am I?",
        ecofriendly: "🌍 I’m what you call things that are kind to Earth—what term am I?",
        upcycle: "🔁 I turn trash into treasure—what am I?",
        permaculture: "🌾 I design agriculture systems that work like nature—what practice am I?",
        biodiesel: "🛢️ I fuel engines with vegetable oil—what kind of diesel am I?",
        tree: "🌳 I provide shade, shelter, and air—what am I?",
        earth: "🌎 I’m your home and third from the Sun—what planet am I?",
        leaf: "🍃 I flutter in the wind and soak up sunlight—what am I?",
        sun: "☀️ I light up the day and help plants grow—what star am I?",
        wind: "💨 You can’t see me, but I can knock you down—what am I?",
        air: "🌬️ I’m everywhere but you can’t see me—what element am I?",
        eco: "♻️ I’m short for something green and sustainable—what prefix am I?"
    };

    // Game state
    let selectedWord = words[Math.floor(Math.random() * words.length)];
    let guessedLetters = new Set();
    let attempts = 6;
    let wrongGuesses = [];
    let score = parseInt(localStorage.getItem('hangmanScore')) || 0;
    let streak = parseInt(localStorage.getItem('hangmanStreak')) || 0;
    let hintsUsed = 0;

    // Display the riddle for the chosen word
    document.getElementById("riddle-text").innerText = riddles[selectedWord] || "Guess the word!";
    document.getElementById("score").innerText = score;
    document.getElementById("streak").innerText = streak;

    // Update the word display with underscores and correct letters
    function updateWordDisplay() {
        let display = selectedWord.split("").map(letter => guessedLetters.has(letter) ? letter : "_").join(" ");
        document.getElementById("word-display").innerText = display;

        if (!display.includes("_")) {
            document.getElementById("win").innerText = "🎉 You Win!";
            document.getElementById("letter-input").disabled = true;
            score += Math.max(10 - hintsUsed * 2, 1); // Bonus for fewer hints
            streak++;
            localStorage.setItem('hangmanScore', score);
            localStorage.setItem('hangmanStreak', streak);
            document.getElementById("score").innerText = score;
            document.getElementById("streak").innerText = streak;
            document.querySelectorAll('.key').forEach(key => key.disabled = true);
            const button=document.getElementById("restart-btn");
            button.style.display="inline";
            button.onclick=restartGame;
        }
    }

    // Handle a letter guess
    function guessLetter(inputLetter = null) {
        const input = inputLetter || document.getElementById("letter-input").value.toLowerCase();
        document.getElementById("letter-input").value = ""; // Clear input
        document.getElementById("message").innerText = ""; // Clear message

        if (!input || guessedLetters.has(input) || input.length !== 1 || !/^[a-z]$/.test(input)) {
            document.getElementById("message").innerText = "⚠️ Invalid or repeated letter!";
            return;
        }

        guessedLetters.add(input);

        if (selectedWord.includes(input)) {
            correctSound.play();  // Play correct guess sound
            updateWordDisplay();
        } else {
            wrongSound.play();  // Play wrong guess sound
            attempts--;
            wrongGuesses.push(input);
            document.getElementById("wrong-guesses").innerText = wrongGuesses.join(", ");
            document.getElementById("attempts").innerText = attempts;

            // Update hangman image
            const hangmanImage = document.getElementById("hangman-image");
            hangmanImage.src = `images/hangman-${6 - attempts}.png`;
        }

        if (attempts === 0) {
            document.getElementById("lose").innerText = "💀 Game Over! The word was " + selectedWord;
            document.getElementById("letter-input").disabled = true;
            streak = 0;
            localStorage.setItem('hangmanStreak', streak);
            document.getElementById("streak").innerText = streak;
        }
    }

    // Give a hint by revealing a random letter
    function giveHint() {
        if (hintsUsed >= 2 || attempts <= 1) {
            document.getElementById("message").innerText = "⚠️ No more hints available!";
            return;
        }

        const unguessedLetters = selectedWord.split("").filter(letter => !guessedLetters.has(letter));
        if (unguessedLetters.length === 0) return;

        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        guessedLetters.add(randomLetter);
        hintsUsed++;

        document.getElementById("message").innerText = `💡 Hint used! Revealed: ${randomLetter.toUpperCase()}`;
        updateWordDisplay();

        if (hintsUsed >= 2) {
            document.getElementById("hint-btn").disabled = true;
        }
    }

    window.guessLetter = guessLetter;
    window.giveHint = giveHint;

    document.getElementById("letter-input").addEventListener("input", function (event) {
        const input = event.target.value.toLowerCase();
        if (input.length === 1 && /^[a-z]$/.test(input)) {
            guessLetter(input);
        }
    });
    

    // Initialize display
    updateWordDisplay();

    function restartGame() {
        location.reload();
    }  
};
