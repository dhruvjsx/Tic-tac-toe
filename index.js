const board = document.getElementById('board');
const winnerDisplay = document.getElementById('winner');
const restartButton = document.getElementById('restart');
const timerContainer = document.getElementById('timer')


let currentPlayer = 'X';
let gameActive = true;
const cells = Array(9).fill(null);
let turnTimeout;
let timerInterval;
let timeLeft = 15;

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];


function createBoard() {
  board.innerHTML = '';
  cells.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  });
  resetTimer();
}


function handleCellClick(e) {
  const index = e.target.dataset.index;

  // to prevent double click or clicking after one of the user already won
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken');

  if (checkWinner()) {
    winnerDisplay.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    clearTimeout(turnTimeout);
    clearInterval(timerInterval);
    return;
  }

  if (cells.every(cell => cell)) {
    winnerDisplay.textContent = `It's a draw!`;
    gameActive = false;
    clearTimeout(turnTimeout);
    clearInterval(timerInterval);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  resetTimer();
}

function checkWinner() {
  return winningCombinations.some(combination => {
    return combination.every(index => cells[index] === currentPlayer);
  });
}

function resetTimer() {
  clearTimeout(turnTimeout);
  clearInterval(timerInterval);
  timeLeft = 15;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);

  turnTimeout = setTimeout(() => {
    gameActive = false;
    clearInterval(timerInterval);
    winnerDisplay.textContent = `${currentPlayer === 'X' ? 'O' : 'X'} wins by timeout!`;
  }, 15000); 
}


function updateTimerDisplay() {
  timerContainer.textContent = `Time Left: ${timeLeft} seconds`;
}

// Restart the game
restartButton.addEventListener('click', () => {
  currentPlayer = 'X';
  gameActive = true;
  cells.fill(null);
  winnerDisplay.textContent = '';
  clearTimeout(turnTimeout);
  clearInterval(timerInterval);
  createBoard();
});

createBoard();
