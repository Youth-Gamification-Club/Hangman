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

    // Display the riddle for the chosen word
    document.getElementById("riddle-text").innerText = riddles[selectedWord] || "Guess the word!";

    // Update the word display with underscores and correct letters
    function updateWordDisplay() {
        let display = selectedWord.split("").map(letter => guessedLetters.has(letter) ? letter : "_").join(" ");
        document.getElementById("word-display").innerText = display;

        if (!display.includes("_")) {
            document.getElementById("win").innerText = "🎉 You Win!";
            document.getElementById("letter-input").disabled = true;
        }
    }

    // Handle a letter guess
    function guessLetter() {
        const input = document.getElementById("letter-input").value.toLowerCase();
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
        }
    }

    window.guessLetter = guessLetter;

    document.getElementById("letter-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            guessLetter();
        }
    });
    

    // Initialize display
    updateWordDisplay();
};
