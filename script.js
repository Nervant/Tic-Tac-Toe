const board = document.getElementById('board');
const status = document.getElementById('status');
const difficultySelect = document.getElementById('difficulty');

let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;

function drawBoard() {
  board.innerHTML = '';
  cells.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell' + (val ? ' taken' : '');
    cell.textContent = val;
    cell.addEventListener('click', () => handleMove(i));
    board.appendChild(cell);
  });
}

function handleMove(index) {
  if (cells[index] || gameOver || currentPlayer !== 'X') return;
  cells[index] = 'X';
  drawBoard();
  if (checkWin('X')) return endGame('You win!');
  if (cells.every(c => c)) return endGame("It's a draw!");
  currentPlayer = 'O';
  status.textContent = 'AI is thinking...';
  setTimeout(aiMove, 300);
}

function aiMove() {
  const mode = difficultySelect.value;
  let move;
  if (mode === 'easy') {
    const empty = cells.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else {
    move = getBestMove();
  }

  if (move !== null) cells[move] = 'O';
  drawBoard();
  if (checkWin('O')) return endGame('AI wins!');
  if (cells.every(c => c)) return endGame("It's a draw!");
  currentPlayer = 'X';
  status.textContent = 'Your turn (X)';
}

function getBestMove() {
  let bestScore = -Infinity;
  let move = null;
  for (let i = 0; i < 9; i++) {
    if (cells[i] === '') {
      cells[i] = 'O';
      let score = minimax(cells, 0, false);
      cells[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinState(boardState, 'O')) return 10 - depth;
  if (checkWinState(boardState, 'X')) return depth - 10;
  if (boardState.every(c => c)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'O';
        let eval = minimax(boardState, depth + 1, false);
        boardState[i] = '';
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = 'X';
        let eval = minimax(boardState, depth + 1, true);
        boardState[i] = '';
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

function checkWin(player) {
  return checkWinState(cells, player);
}

function checkWinState(state, player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return wins.some(p => p.every(i => state[i] === player));
}

function endGame(msg) {
  status.textContent = msg;
  gameOver = true;
}

function resetGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  status.textContent = 'Your turn (X)';
  drawBoard();
}

drawBoard();
