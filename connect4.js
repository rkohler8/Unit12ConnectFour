/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.board = [];
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    alert(msg);
  }
  handleClick(evt) {
    if(this.gameOver !== true) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
    
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`${this.currPlayer.color} wins!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.gameOver = true;
        return this.endGame("It's a Tie!");
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
    else {  // Adds arrows to emphasize starting a new game
      const infoBar = document.getElementById('info-bar');
      const emphasisLabel = document.createElement('label');
      emphasisLabel.setAttribute('id', 'emph');
      emphasisLabel.innerText = '←';
      infoBar.append(emphasisLabel);
    }
  }
  checkForWin() {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
    const _win = cells => 
      cells.every(
        ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color =  color;
  }
}

/*
Function to check that chosen token colors are valid colors 
and are not the same as each other or the background color
*/
function colorCheck(p1Color, p2Color) {
  if(p1Color === 'skyblue' || p2Color === 'skyblue') {
    return 'back';
  }
  if(p1Color === p2Color) {
    return 'same';
  }
  if(CSS.supports('color', p1Color) && CSS.supports('color', p2Color)) {
    return 'pass';
  }
  if(!CSS.supports('color', p1Color) && !CSS.supports('color', p2Color)) {
    return 'both fail';
  }
  if(!CSS.supports('color', p1Color)) {
    return 'p1 fail';
  }

  return 'p2 fail';
}

const startButton = document.getElementById('start-game');
startButton.addEventListener('click', () => {
  let p1 = document.getElementById('p1-color');
  let p2 = document.getElementById('p2-color');
  let cLabels = document.querySelectorAll('body label');
  let check = colorCheck(p1.value.toLowerCase(), p2.value.toLowerCase());   // Sets the token color chack as a variable for readability

  if(check === 'back') {    // See 'colorCheck'
    alert("Please don't use 'skyblue'");
  }
  else if(check !== 'same') {
    if(check === 'pass') {
      for (let i = cLabels.length-1; i >= 2; i--) {   // Removes all emphasis arrows
        cLabels.item(i).remove();
      }
      p1.style.backgroundColor = cLabels[0].style.backgroundColor = p1.value;   // Changes p1 token color and text background color to selected color
      p2.style.backgroundColor = cLabels[1].style.backgroundColor = p2.value;   // Changes p2 token color and text background color to selected color
      startButton.innerText = 'New Game';
      new Game(new Player(p1.value), new Player(p2.value));
    }
    else if(check === 'both fail') {
      alert(`\'${p1.value}\' and \'${p2.value}\' are not valid colors`);
    }
    else if(check === 'p1 fail') {
      alert(`\'${p1.value}\' is not a valid color`);
    }
    else {
      alert(`\'${p2.value}\' is not a valid color`);
    }
  }
  else {
    alert('Players cannot use the same color')
  }
});