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

function clearTime (){
  clearTimeout(turnTimeout);
  clearInterval(timerInterval);
}

function  resetGameState() {
  currentPlayer = 'X';
  gameActive = true;
  cells.fill(null);
  winnerDisplay.textContent = '';
  clearTime()
  
  createBoard();
}

function createBoard() {
  board.innerHTML = '';
  for (let index = 0; index < cells.length; index++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    // cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  };
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
    clearTime()
    return;
  }

  if (cells.every(cell => cell)) {
    winnerDisplay.textContent = `It's a draw!`;
    gameActive = false;
    clearTime()
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

function handleTimerTick() {
  timeLeft -= 1;
  updateTimerDisplay();
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
  }
}

function handleTurnTimeout() {
  gameActive = false;
  clearInterval(timerInterval);
  winnerDisplay.textContent = `${currentPlayer === 'X' ? 'O' : 'X'} wins by timeout!`;
}

function resetTimer() {
  clearTime()
  timeLeft = 15;
  updateTimerDisplay();

  timerInterval = setInterval(handleTimerTick, 1000);
  turnTimeout = setTimeout(handleTurnTimeout, 15000);
}

function updateTimerDisplay() {
  timerContainer.textContent = `Time Left: ${timeLeft} seconds`;
}

// Restart the game
restartButton.addEventListener('click',resetGameState);

board.addEventListener('click', handleCellClick);

document.addEventListener('DOMContentLoaded',createBoard,{ once: true } )
