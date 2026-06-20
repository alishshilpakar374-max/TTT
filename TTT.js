/* =========================
   DOM ELEMENT SELECTION
   ========================= */

// Select all Tic-Tac-Toe cells
const boxes = document.querySelectorAll(".boxes");

// Restart button
const button = document.getElementById("butt");

// Player selection buttons
const selectO = document.getElementById("chooseO");
const selectX = document.getElementById("chooseX");

// Element that displays current turn, winner, or draw message
const displayTurn = document.getElementById("display-turn");

/* =========================
   AUDIO FILES
   ========================= */

// Sound when choosing X or O buttons
const selectSound = new Audio("./audio/clicks.mp3");

// Sound when placing a mark on the board
const movesSound = new Audio("./audio/moves.mp3");

// Sound when a player wins
const victorySound = new Audio("./audio/victory.mp3");

// Sound when the game ends in a draw
const drawSound = new Audio("./audio/draw.mp3");

// Sound when restarting the game
const resetSound = new Audio("./audio/resets.mp3");

/* =========================
   GAME VARIABLES
   ========================= */

// Stores whose turn it currently is ("X" or "O")
let currentPlayer;

// Prevents further moves after a win or draw
let gameOver = false;

/* =========================
   UPDATE BOARD BORDER COLOR
   ========================= */

/*
 Changes all box borders to match
 the current player's color.
 X -> cyan border
 O -> red border
*/
function updateBorderColor() {
  boxes.forEach((box) => {
    box.style.borderColor =
      currentPlayer === "X" ? "var(--X-color)" : "var(--O-color)";
  });
}

/* =========================
   BOX CLICK EVENT
   ========================= */

/*
 Adds a click event to every box.

 Responsibilities:
 - Prevent moves if game hasn't started
 - Prevent moves if game is over
 - Display player's symbol
 - Check win condition
 - Check draw condition
 - Switch turns
*/
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    // Stop if player hasn't selected X/O yet
    // or if game is already finished
    if (!currentPlayer || gameOver) return;

    // Allow move only on empty boxes
    if (box.textContent === "") {
      // Place X or O
      display(box);

      // Play move sound
      movesSound.currentTime = 0;
      movesSound.play();

      // Prevent changing selected symbol
      disableBtn();

      // Stop immediately if someone won
      if (winConditions()) return;

      // Check for draw
      if (checkDraw()) {
        gameOver = true;
        displayTurn.textContent = "It's a draw!";
        drawSound.play();
        return;
      }

      // Pass turn to the other player
      switchTurn();
    }
  });
});

/* =========================
   SELECT X EVENT
   ========================= */

/*
 Runs when player chooses X.
 Sets current player to X
 and updates UI.
*/
selectX.addEventListener("click", () => {
  // Highlight X button
  selectX.classList.add("selectedX");

  // Remove O highlight
  selectO.classList.remove("selectedO");

  // X starts first
  currentPlayer = "X";

  // Update board border color
  updateBorderColor();

  // Play selection sound
  selectSound.currentTime = 0;
  selectSound.play();

  // Display turn message
  displayTurn.innerHTML = `<span class="span-x">${currentPlayer}</span>'s turn`;
});

/* =========================
   SELECT O EVENT
   ========================= */

/*
 Runs when player chooses O.
 Sets current player to O
 and updates UI.
*/
selectO.addEventListener("click", () => {
  // Highlight O button
  selectO.classList.add("selectedO");

  // Remove X highlight
  selectX.classList.remove("selectedX");

  // O starts first
  currentPlayer = "O";

  // Update board border color
  updateBorderColor();

  // Play selection sound
  selectSound.currentTime = 0;
  selectSound.play();

  // Display turn message
  displayTurn.innerHTML = `<span class="span-o">${currentPlayer}</span>'s turn`;
});

/* =========================
   DISPLAY PLAYER SYMBOL
   ========================= */

/*
 Places the current player's
 symbol inside a box and
 adds corresponding styling.
*/
function display(box) {
  box.textContent = currentPlayer;
  box.classList.add(currentPlayer);
}

/* =========================
   DISABLE PLAYER SELECTORS
   ========================= */

/*
 Prevents switching between
 X and O after the game begins.
*/
function disableBtn() {
  selectO.disabled = true;
  selectX.disabled = true;
}

/* =========================
   SWITCH PLAYER TURN
   ========================= */

/*
 Alternates between
 X and O after each move.
 Also updates UI colors
 and turn display.
*/
function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  updateBorderColor();

  if (currentPlayer === "X") {
    displayTurn.innerHTML = `<span class="span-x">X</span>'s turn`;
  } else {
    displayTurn.innerHTML = `<span class="span-o">O</span>'s turn`;
  }
}

/* =========================
   CHECK WIN CONDITIONS
   ========================= */

/*
 Checks all possible winning
 combinations.

 Returns:
 true  -> winner found
 false -> no winner yet
*/
function winConditions() {
  // All possible ways to win
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition;

    // Check if all 3 boxes match
    if (
      boxes[a].textContent !== "" &&
      boxes[a].textContent === boxes[b].textContent &&
      boxes[b].textContent === boxes[c].textContent
    ) {
      gameOver = true;

      // X Wins
      if (currentPlayer === "X") {
        displayTurn.innerHTML = `<span class="span-x">X</span>&nbsp;wins!`;

        // Animate winning cells
        setTimeout(() => {
          boxes[a].classList.add("x-wins");

          victorySound.currentTime = 0;
          victorySound.play();
        }, 200);

        setTimeout(() => boxes[b].classList.add("x-wins"), 500);
        setTimeout(() => boxes[c].classList.add("x-wins"), 1000);
      }
      // O Wins
      else {
        displayTurn.innerHTML = `<span class="span-o">O</span>&nbsp;wins!`;

        setTimeout(() => {
          boxes[a].classList.add("o-wins");

          victorySound.currentTime = 0;
          victorySound.play();
        }, 200);

        setTimeout(() => boxes[b].classList.add("o-wins"), 500);
        setTimeout(() => boxes[c].classList.add("o-wins"), 1000);
      }

      return true;
    }
  }

  return false;
}

/* =========================
   CHECK DRAW CONDITION
   ========================= */

/*
 Returns true when
 every box contains
 either X or O.
*/
function checkDraw() {
  return [...boxes].every((box) => box.textContent !== "");
}

/* =========================
   RESET GAME
   ========================= */

/*
 Restores the game to
 its initial state.

 - Clears board
 - Removes winner styles
 - Enables player selection
 - Resets variables
 - Plays reset sound
*/
function resetGame() {
  // Clear all cells
  boxes.forEach((box) => {
    box.textContent = "";
    box.classList.remove("X", "O", "x-wins", "o-wins");
    box.style.borderColor = "var(--border-color)";
  });

  // Remove selected button styles
  selectX.classList.remove("selectedX");
  selectO.classList.remove("selectedO");

  // Re-enable player selection
  selectX.disabled = false;
  selectO.disabled = false;

  // Reset game state
  currentPlayer = undefined;
  gameOver = false;

  // Play reset sound
  resetSound.currentTime = 0;
  resetSound.play();

  // Restore default message
  displayTurn.textContent = "Choose ";
}
